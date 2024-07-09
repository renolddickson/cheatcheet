import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-translate-path',
  templateUrl: './translate-path.component.html',
  styleUrls: ['./translate-path.component.scss']
})

export class TranslatePathComponent {
  @ViewChild('chipdialog') selectDialog!:TemplateRef<any>;

  converter!: FormGroup;
  result: string[][] = [];
  selectedKeys: boolean[][] = [];
  allComplete: boolean[] = [];
constructor(private dialog:MatDialog){}
  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    });
  }

  onConvert() {
    const Json_data: string = this.converter.get('normal')?.value;
    if (Json_data) {
      const json: any[] = JSON.parse(Json_data);
      this.getKeyPathsFromDetails(json).then(res => {
        this.result = res;
        this.initializeSelections();
        const dialogRef= this.dialog.open(this.selectDialog)
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
        if (key.toLowerCase().includes('color') || key.toLowerCase().includes('images') || key.toLowerCase().includes('imageurl') || key.toLowerCase().includes('fontfamily') || key.toLowerCase().includes('fontstyle') || typeof value === 'boolean' || typeof value === 'number' || value === 'en') {
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
    const selectedPaths: string[][] = [];
    this.selectedKeys.forEach((keyArray, i) => {
      const selected = keyArray
        .map((selected, index) => (selected ? this.result[i][index] : null))
        .filter(key => key !== null); // Filter out null values here
      selectedPaths.push(selected as string[]); // Assert 'selected' as 'string[]'
    });
    console.log(selectedPaths);
    // Perform further actions with selectedPaths
  }
  
}
