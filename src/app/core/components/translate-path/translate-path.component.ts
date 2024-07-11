import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-translate-path',
  templateUrl: './translate-path.component.html',
  styleUrls: ['./translate-path.component.scss']
})

export class TranslatePathComponent {
  @ViewChild('chipdialog') selectDialog!: TemplateRef<any>;

  converter!: FormGroup;
  result: string[][] = [];
  selectedKeys: boolean[][] = [];
  allComplete: boolean[] = [];
  jsonData: any[] = []; // Store parsed JSON data here

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    });
  }

  onConvert() {
    const jsonDataString: string = this.converter.get('normal')?.value;
    if (jsonDataString) {
      this.jsonData = JSON.parse(jsonDataString);
      this.getKeyPathsFromDetails(this.jsonData).then(res => {
        this.result = res;
        this.initializeSelections();
        const dialogRef = this.dialog.open(this.selectDialog);
      });
    }
  }

  async getKeyPathsFromDetails(sections: any[]): Promise<string[][]> {
    let result: any[] = [];
    for (const section of sections) {
      if (section.details) {
        const keyPaths = await this.getKeyPaths(section.details);
        result.push(keyPaths);
      }
    }
    return result;
  }

  getKeyPaths(obj: any, parentKey: string = ''): string[] {
    let keys: string[] = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (key.toLowerCase().includes('color') ||
            key.toLowerCase().includes('images') ||
            key.toLowerCase().includes('imageurl') ||
            key.toLowerCase().includes('fontfamily') ||
            key.toLowerCase().includes('fontstyle') ||
            typeof value === 'boolean' ||
            typeof value === 'number' ||
            value.hasOwnProperty('en')) {
          continue;
        }
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              keys = keys.concat(this.getKeyPaths(item, `${newKey}[${index}]`));
            } else {
              keys.push(`${newKey}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          keys = keys.concat(this.getKeyPaths(value, newKey));
        } else {
          keys.push(newKey);
        }
      }
    }
    return keys;
  }

  initializeSelections() {
    this.selectedKeys = this.result.map(keyArray => keyArray.map(() => false));
    this.allComplete = this.result.map(() => false);
  }

  isSelected(key: string, i: number): boolean {
    const index = this.result[i].indexOf(key);
    if (index === -1) {
      return false;
    }
    return this.selectedKeys[i][index];
  }

  someComplete(i: number): boolean {
    if (this.selectedKeys[i].length === 0) {
      return false;
    }
    const numSelected = this.selectedKeys[i].filter(val => val).length;
    return numSelected > 0 && numSelected < this.selectedKeys[i].length;
  }

  setAll(checked: boolean, i: number) {
    this.selectedKeys[i] = this.selectedKeys[i].map(() => checked);
    this.allComplete[i] = checked;
  }

  confirmSelection() {
    this.dialog.closeAll()
    const selectedPaths: string[][] = [];
    this.selectedKeys.forEach((keyArray, i) => {
      const selected = keyArray
        .map((selected, index) => (selected ? this.result[i][index] : null))
        .filter(key => key !== null); // Filter out null values here
      selectedPaths.push(selected as string[]); // Assert 'selected' as 'string[]'
    });

    // Update the JSON data with translated paths
    selectedPaths.forEach((paths, i) => {
      paths.forEach(path => {
        this.setPathValue(this.jsonData[i].details, path.split('.'));
        // Add the translatePath array to each section
        if (!this.jsonData[i].translatePath) {
          this.jsonData[i].translatePath = [];
        }
        this.jsonData[i].translatePath.push(path);
      });
    });

    // Set the updated JSON data in the converter form
    this.converter.patchValue({ converted: JSON.stringify(this.jsonData, null, 2) });

    console.log(this.jsonData); // Log the updated JSON data
    // Perform further actions with selectedPaths
  }

  // Helper function to set value at given path in object
  setPathValue(obj: any, path: string[], value: any = 'en') {
    if (path.length === 1) {
      const key = path[0];
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          if (typeof item[key] === 'string') {
            item[key] = { en: item[key] };
          }
        });
      } else if (typeof obj[key] === 'string') {
        obj[key] = { en: obj[key] };
      }
    } else {
      const key = path.shift()!;
      if (key.endsWith(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
        if (!obj[arrayKey]) {
          obj[arrayKey] = [];
        }
        this.setPathValue(obj[arrayKey][index] || {}, path, value);
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        this.setPathValue(obj[key], path, value);
      }
    }
  }
  getPathValue(obj: any, path: string[]): any {
    let current = obj;
    for (const key of path) {
      if (key.includes('[')) {
        // Handle array index
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
        current = current[arrayKey];
        if (Array.isArray(current)) {
          current = current[index];
        } else {
          return null;
        }
      } else {
        current = current[key];
      }
      if (current === undefined || current === null) {
        return null; // Return null if the path is invalid
      }
    }
    return current;
  }
  getTooltipContent(sectionIndex: number, key: string): string {
    const path = key.split('.');
    const value = this.getPathValue(this.jsonData[sectionIndex].details, path);
    if (value !== null && typeof value === 'object' && 'en' in value) {
      return value.en;
    } else if (value !== null) {
      return JSON.stringify(value);
    } else {
      return 'No content available';
    }
  }
}
