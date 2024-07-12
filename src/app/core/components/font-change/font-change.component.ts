import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-font-change',
  templateUrl: './font-change.component.html',
  styleUrls: ['./font-change.component.scss']
})
export class FontChangeComponent {
  converter!: FormGroup;

  // Mapping of old font families to new ones
  fontFamilyReplacements: { [key: string]: string } = {
    'Palatino linotype': 'Crimson Text',
    'Copperplate': 'Playfair Display',
    'Papyrus': 'Satisfy',
    'Lucida Handwriting': 'Dancing Script',
    'Brush Script MT': 'Handlee',
    'Monaco': 'Roboto Mono',
    'Lucida console': 'Roboto Mono',
    'Courier New': 'Inconsolata',
    'Helvetica': 'Roboto',
    'Verdana': 'Roboto',
    'Arial': 'Roboto',
    'Georgia': 'Crimson Text',
    'Times New Roman': 'Libre Baskerville',
    'Trebuchet MS': 'Lato',
    'Tahoma': 'Nunito',
    'Monospace': 'Roboto Mono',
    'Garamond': 'EB Garamond'
  };

  constructor() {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    });
  }

  ngOnInit(): void {}

  updateFontFamilies(data: any): void {
    if (Array.isArray(data)) {
      data.forEach((item) => this.updateFontFamilies(item));
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'string') {
          data[key] = this.replaceFontFamily(data[key]);
        } else if (typeof data[key] === 'object') {
          this.updateFontFamilies(data[key]);
        }
      });
    }
  }

  replaceFontFamily(fontString: string): string {
    for (const [oldFont, newFont] of Object.entries(this.fontFamilyReplacements)) {
      const regex = new RegExp(`\\b${oldFont}\\b`, 'gi');
  
      // Check if the old font is present
      if (regex.test(fontString)) {
        // Create formatted new font with proper spacing
        const formattedNewFont = `'${newFont}'`;
        const hasStyleRegex = /(?:serif|sans-serif|cursive|monospace)/i;
        const currentStyleMatch = fontString.match(hasStyleRegex);
        const currentStyle = currentStyleMatch ? currentStyleMatch[0] : 'sans-serif'; // Default to sans-serif if none found
  
        // Ensure correct format with space
        return fontString.replace(regex, formattedNewFont).trim() + `, ${currentStyle}`;
      }
    }
  
    // Check for already existing correct format and fix it
    const correctFormatRegex = /"([^"]+)",?\s*(serif|sans-serif|cursive|monospace)/i;
    const match = fontString.match(correctFormatRegex);
    if (match) {
      const fontName = match[1];
      const style = match[2];
      return `'${fontName}', ${style}`;
    }
  
    return fontString; // Return unmodified if no replacements were made
  }
  convertJson(): void {
    const inputJson = this.converter.get('normal')?.value;
    try {
      const jsonData = JSON.parse(inputJson);
      this.updateFontFamilies(jsonData);
      const outputJson = JSON.stringify(jsonData, null, 2);
      this.converter.get('converted')?.setValue(outputJson);
    } catch (error) {
      console.error('Invalid JSON input:', error);
      this.converter.get('converted')?.setValue('Invalid JSON input');
    }
  }
}
