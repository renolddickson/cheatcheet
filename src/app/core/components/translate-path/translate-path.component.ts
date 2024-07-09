import { Component } from '@angular/core';

@Component({
  selector: 'app-translate-path',
  templateUrl: './translate-path.component.html',
  styleUrls: ['./translate-path.component.scss']
})

export class TranslatePathComponent {
  
  sections: any[] = [
    {
      sectionId: 1,
      details: {
        heading: "",
        bannerProperty: {
          text: "hello"
        },
        sample: [
          {
            subtext: ""
          }
        ]
      },
      otherProperty: "value"
    },
    {
      sectionId: 2,
      details: {
        title: "Example",
        banner: {
          text: "world",
          color: "blue"
        },
        items: [
          {
            description: "item1",
            value: 100,
            color: "red"
          },
          {
            description: "item2",
            language: "en"
          }
        ]
      }
    }
  ];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const result = this.getKeyPathsFromDetails(this.sections);
    console.log(result);
  }
  getKeyPathsFromDetails(sections: any[]): string[] {
    let result: string[] = [];
  
    sections.forEach(section => {
      if (section.details) {
        result = result.concat(this.getKeyPaths(section.details));
      }
    });
  
    return result;
  }
  
  getKeyPaths(obj: any, parentKey: string = ''): string[] {
    let keys: string[] = [];
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (key.toLowerCase().includes('color') || typeof value === 'boolean' || typeof value === 'number' || value === 'en') {
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
  
  // Example usage:
}
