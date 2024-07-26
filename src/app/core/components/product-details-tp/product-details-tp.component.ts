import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/API/api.service';

@Component({
  selector: 'app-product-details-tp',
  templateUrl: './product-details-tp.component.html',
  styleUrls: ['./product-details-tp.component.scss']
})
export class ProductDetailsTpComponent {
  @ViewChild('chipdialog') selectDialog!: TemplateRef<any>;

  converter!: FormGroup;
  result: string[][] = [];
  selectedKeys: boolean[][] = [];
  allComplete: boolean[] = [];
  jsonData: any[] = []; // Store parsed JSON data here
  autoCheckPaths: string[] = []; // Initialize with the paths you want to auto-check

  constructor(private dialog: MatDialog, private translationService: ApiService) {}

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
        this.result = res['detail'];
        this.initializeSelections();
        const dialogRef = this.dialog.open(this.selectDialog);
      });
    }
  }

  async getKeyPathsFromDetails(sections: any[]): Promise<{ detail: string[][], sampleData: string[][] }> {
    let result: any[] = [];
    let sampleResult: any[] = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.details) {
        const keyPaths = await this.getKeyPaths(section.details);
        result.push(keyPaths);
      }
      if (i === 0 || i === 4) {
        if (section.sampleData) {
          const sampleKeyPaths = await this.getKeyPaths(section.sampleData);
          sampleResult.push(sampleKeyPaths);
        }
      }
    }
    return { detail: result, sampleData: sampleResult };
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
          obj.hasOwnProperty('en')) {
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
    this.selectedKeys = this.result.map(keyArray =>
      keyArray.map(key => this.autoCheckPaths.includes(key))
    );
    this.allComplete = this.selectedKeys.map(keysArray =>
      keysArray.every(selected => selected)
    );
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
    this.dialog.closeAll();
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

    // Modify the JSON data according to the given rules
    this.modifyJsonData().then(() => {
      // Set the updated JSON data in the converter form
      this.converter.patchValue({ converted: JSON.stringify(this.jsonData, null, 2) });
      console.log(this.jsonData); // Log the updated JSON data
    });
  }

  async modifyJsonData() {
    for (let i = 0; i < this.jsonData.length; i++) {
      if (i === 0 || i === 4) {
        // Modify 'en' for section 1 and 5 details
        await this.updateTranslations(this.jsonData[i].details, ['en']);
        // Modify 'en', 'ta', 'ml', 'hi' for section 1 and 5 sample data
        if (this.jsonData[i].sampleData) {
          await this.updateTranslations(this.jsonData[i].sampleData, ['en', 'ta', 'ml', 'hi']);
        }
      } else if (i >= 1 && i <= 3) {
        // Modify 'en', 'ta', 'ml', 'hi' for details of sections 2, 3, 4
        await this.updateTranslations(this.jsonData[i].details, ['en', 'ta', 'ml', 'hi']);
      }
    }
  }

  async updateTranslations(obj: any, languages: string[]) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          const translations = await Promise.all(
            languages.map(lang => this.translationService.translate(value, lang))
          );
          languages.forEach((lang, index) => {
            obj[key] = { ...obj[key], [lang]: translations[index] };
          });
        } else if (Array.isArray(value)) {
          for (let item of value) {
            await this.updateTranslations(item, languages);
          }
        } else if (typeof value === 'object' && value !== null) {
          await this.updateTranslations(value, languages);
        }
      }
    }
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

