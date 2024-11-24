import { Component } from '@angular/core';

@Component({
  selector: 'app-angulat-to-html',
  templateUrl: './angulat-to-html.component.html',
  styleUrls: ['./angulat-to-html.component.scss']
})
export class AngulatToHtmlComponent {
  sampleJson: string = '';
  sampleCode: string = '';
  outputCode: string = '';

  processJson() {
    try {
      this.outputCode = this.compileAngularTemplate(this.sampleCode, JSON.parse(this.sampleJson));
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
    // Helper to evaluate expressions safely
    const evaluateExpression = (expression: string | null, context: Record<string, any>): any => {
      if (!expression) return null;
      try {
        return new Function('with(this) { return ' + expression + '}').call(context);
      } catch (error) {
        console.error(`Error evaluating expression: "${expression}"`, error);
        return {};
      }
    };

    template = template.replace(/\*ngFor/g, 'ngFor').replace(/\*ngIf/g, 'ngIf');

    // Parse the template string into a DOM structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');

    // Process *ngIf
    doc.querySelectorAll('[ngIf]').forEach((ngIfNode) => {
      const condition = ngIfNode.getAttribute('ngIf');
      if (!evaluateExpression(condition, data)) {
        ngIfNode.remove();
      } else {
        ngIfNode.removeAttribute('ngIf');
      }
    });

    // Process *ngFor
    doc.querySelectorAll('[ngFor]').forEach((ngForNode) => {
      const directive = ngForNode.getAttribute('ngFor');
      const match = directive?.match(/let (\w+) of (\w+)/);
      if (match) {
        const [_, item, array] = match;
        const items = evaluateExpression(array, data) || [];
        const parent = ngForNode.parentElement;
        const fragment = document.createDocumentFragment();

        items.forEach((itemData: Record<string, any>) => {
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

    // Process Interpolation ({{ ... }})
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
    const responsiveBreakpoints = {
      'xs': '(max-width: 599px)',
      'sm': '(min-width: 600px) and (max-width: 959px)',
      'md': '(min-width: 960px) and (max-width: 1279px)',
      'lg': '(min-width: 1280px) and (max-width: 1919px)',
      'xl': '(min-width: 1920px)',
      'lt-sm': '(max-width: 599px)',
      'lt-md': '(max-width: 959px)',
      'lt-lg': '(max-width: 1279px)',
      'lt-xl': '(max-width: 1919px)',
      'gt-xs': '(min-width: 600px)',
      'gt-sm': '(min-width: 960px)',
      'gt-md': '(min-width: 1280px)',
      'gt-lg': '(min-width: 1920px)',
    };

    // Store all generated style blocks
    const styleBlocks: string[] = [];

    // Process elements with ngStyle
    doc.querySelectorAll('*').forEach((node) => {
      if (node instanceof HTMLElement) {
        let combinedStyles: Record<string, string> = {};
        let baseClassName = '';

        // Generic ngStyle
        const ngStyle = node.getAttribute('ngStyle');
        if (ngStyle) {
          const styles = evaluateExpression(ngStyle, data) as Record<string, string>;
          if (styles && typeof styles === 'object') {
            baseClassName = `dynamic-${Math.random().toString(36).substr(2, 8)}`;
            combinedStyles = { ...styles };
          }
          node.removeAttribute('ngStyle');
        }

        // Handle responsive ngStyle.<breakpoint>
        Object.entries(responsiveBreakpoints).forEach(([suffix, mediaQuery]) => {
          const directive = `ngStyle.${suffix}`;
          const responsiveStyle = node.getAttribute(directive);

          if (responsiveStyle) {
            const styles = evaluateExpression(responsiveStyle, data) as Record<string, string>;
            if (styles && typeof styles === 'object') {
              const className = `${baseClassName || `dynamic-${Math.random().toString(36).substr(2, 8)}`}-${suffix}`;
              node.classList.add(className);

              styleBlocks.push(`
                @media ${mediaQuery} {
                  .${className} {
                    ${Object.entries(styles)
                      .map(([key, value]) => `${key}: ${value};`)
                      .join(' ')}
                  }
                }
              `);
            }
            node.removeAttribute(directive);
          }
        });

        // Add the base class to the element
        if (Object.keys(combinedStyles).length > 0) {
          const baseClassNameFinal = baseClassName || `dynamic-${Math.random().toString(36).substr(2, 8)}`;
          node.classList.add(baseClassNameFinal);

          styleBlocks.push(`
            .${baseClassNameFinal} {
              ${Object.entries(combinedStyles)
                .map(([key, value]) => `${key}: ${value};`)
                .join(' ')}
            }
          `);
        }
      }
    });

    // Append all styles to the document
    if (styleBlocks.length > 0) {
      const styleTag = document.createElement('style');
      styleTag.textContent = styleBlocks.join('\n');
      doc.body.appendChild(styleTag);
    }

    // Serialize the DOM back to an HTML string
    return doc.body.innerHTML;
  }




}
