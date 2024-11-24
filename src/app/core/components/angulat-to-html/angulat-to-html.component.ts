import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
type Breakpoint =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'lt-sm'
  | 'lt-md'
  | 'lt-lg'
  | 'lt-xl'
  | 'gt-xs'
  | 'gt-sm'
  | 'gt-md'
  | 'gt-lg'
  | 'base';

@Component({
  selector: 'app-angulat-to-html',
  templateUrl: './angulat-to-html.component.html',
  styleUrls: ['./angulat-to-html.component.scss']
})
export class AngulatToHtmlComponent {
  sampleJson: string = '';
  sampleCode: string = '';
  outputCode: string = '';

  sanitizedCode!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {

  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  processJson() {
    try {
      this.outputCode = this.compileAngularTemplate(this.sampleCode, JSON.parse(this.sampleJson));
      this.sanitizedCode = this.sanitizeHtml(this.outputCode);
      console.log('this.outputCode',this.outputCode);
    } catch (error) {
      alert('Invalid Data format ' + error);
    }
  }

  enterSampleJson() {
    this.sampleJson = `{
      "title": "Sample Page",
      "description": "This is a demo page.",
      "items": [
        { "name": "Item 1", "price": 10 },
        { "name": "Item 2", "price": 20 }
      ],
      "isVisible": true,
      "styles":{
        "normal_color":"black",
        "medium_color":"red",
        "small_color":"blue"
      }
    }`;
  }

  enterSampleCode() {
    this.sampleCode = `
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <ul>
          <li *ngFor="let item of items">
            {{ item.name }}: {{ item.price }}
          </li>
        </ul>
        <p *ngIf="isVisible">This content is visible.</p>
        <div
          ngStyle="{ color: styles.normal_color}"
          ngStyle.lt-md="{ color: styles.medium_color}"
          ngStyle.gt-md="{ color: styles.small_color}"
        >
          Responsive styled content
        </div>
      </div>
    `;
  }
  reset() {
    this.sampleJson = ''
    this.sampleCode = ''
    this.outputCode = ''
  }

  compileAngularTemplate(template: string, data: Record<string, any>): string {
    const evaluateExpression = (expression: string | null, context: Record<string, any>): any => {
      if (!expression) return null;
      try {
        return new Function('with(this) { return ' + expression + '}').call(context);
      } catch (error) {
        console.error(`Error evaluating expression: "${expression}"`, error);
        return null;
      }
    };

    // Replace shorthand Angular directives
    template = template.replace(/\*ngFor/g, 'ngFor').replace(/\*ngIf/g, 'ngIf');

    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');

    // Handle `ngIf` directives
    doc.querySelectorAll('[ngIf]').forEach((ngIfNode) => {
      const condition = ngIfNode.getAttribute('ngIf');
      if (!evaluateExpression(condition, data)) {
        ngIfNode.remove();
      } else {
        ngIfNode.removeAttribute('ngIf');
      }
    });

    // Handle `ngFor` directives
    doc.querySelectorAll('[ngFor]').forEach((ngForNode) => {
      const directive = ngForNode.getAttribute('ngFor');
      const match = directive?.match(/let (\w+) of (\w+)/);
      if (match) {
        const [_, item, array] = match;
        const items = evaluateExpression(array, data) || [];
        const parent = ngForNode.parentElement;
        const fragment = document.createDocumentFragment();

        items.forEach((itemData: any) => {
          const clone = ngForNode.cloneNode(true) as HTMLElement;
          clone.removeAttribute('ngFor');
          clone.innerHTML = clone.innerHTML.replace(/{{\s*(.*?)\s*}}/g, (_, expr) => {
            return evaluateExpression(expr, { ...data, [item]: itemData }) || '';
          });
          fragment.appendChild(clone);
        });

        parent?.replaceChild(fragment, ngForNode);
      }
    });

    // Handle text interpolation
    doc.querySelectorAll('*').forEach((node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = (child.textContent || '').replace(/{{\s*(.*?)\s*}}/g, (_, expr) => {
            return evaluateExpression(expr, data) || '';
          });
        }
      });
    });

    // Define responsive breakpoints
    const responsiveBreakpoints: Record<Breakpoint, string> = {
      xs: '(max-width: 599px)',
      sm: '(min-width: 600px) and (max-width: 959px)',
      md: '(min-width: 960px) and (max-width: 1279px)',
      lg: '(min-width: 1280px) and (max-width: 1919px)',
      xl: '(min-width: 1920px)',
      'lt-sm': '(max-width: 599px)',
      'lt-md': '(max-width: 959px)',
      'lt-lg': '(max-width: 1279px)',
      'lt-xl': '(max-width: 1919px)',
      'gt-xs': '(min-width: 600px)',
      'gt-sm': '(min-width: 960px)',
      'gt-md': '(min-width: 1280px)',
      'gt-lg': '(min-width: 1920px)',
      base: '', // Special case for base styles
    };

    // Collect styles
    const globalStyles: Record<string, string[]> = {
      base: [],
      ...Object.keys(responsiveBreakpoints).reduce((acc, key) => ({ ...acc, [key]: [] }), {}),
    };

    doc.querySelectorAll('*').forEach((node) => {
      if (node instanceof HTMLElement) {
        // Process `ngStyle`
        const ngStyle = node.getAttribute('ngStyle');
        if (ngStyle) {
          const styles = evaluateExpression(ngStyle, data);
          if (styles && typeof styles === 'object') {
            const className = `dynamic-${Math.random().toString(36).substr(2, 8)}`;
            node.classList.add(className);
            globalStyles['base'].push(this.generateCssRule(className, styles));
          }
          node.removeAttribute('ngStyle');
        }

        // Process responsive `ngStyle`
        Object.entries(responsiveBreakpoints).forEach(([breakpoint, query]) => {
          const directive = `ngStyle.${breakpoint}`;
          const responsiveStyle = node.getAttribute(directive);
          if (responsiveStyle) {
            const styles = evaluateExpression(responsiveStyle, data);
            if (styles && typeof styles === 'object') {
              const className = `dynamic-${Math.random().toString(36).substr(2, 8)}`;
              node.classList.add(className);
              globalStyles[breakpoint].push(this.generateCssRule(className, styles));
            }
            node.removeAttribute(directive);
          }
        });
      }
    });

    // Generate style blocks
    const styleBlocks = Object.entries(globalStyles)
      .map(([breakpoint, styles]) => {
        if (styles.length === 0) return ''; // Skip empty styles
        const mediaQuery =
          breakpoint in responsiveBreakpoints && responsiveBreakpoints[breakpoint as Breakpoint]
            ? `@media ${responsiveBreakpoints[breakpoint as Breakpoint]}`
            : '';
        return `${mediaQuery} {\n${styles.join('\n')}\n}`;
      })
      .filter(Boolean);

    // Append styles to the document
    if (styleBlocks.length > 0) {
      const styleTag = document.createElement('style');
      styleTag.textContent = styleBlocks.join('\n');
      doc.body.appendChild(styleTag);
    }

    return doc.body.innerHTML;
  }

  // Utility function to generate CSS rules
  generateCssRule(className: string, styles: Record<string, any>): string {
    return `.${className} { ${Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`;
  }








}
