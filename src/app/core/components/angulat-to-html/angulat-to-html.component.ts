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
      "isVisible": true
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
          ngStyle="{ color: styles.default.color, fontSize: styles.default.fontSize }"
          ngStyle.lt-md="{ color: styles.lt-md.color, fontSize: styles.lt-md.fontSize }"
          ngStyle.gt-md="{ color: styles.gt-md.color, fontSize: styles.gt-md.fontSize }"
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
    const evaluateExpression = (expression: string, context: Record<string, any>) => {
      try {
        return new Function('with(this) { return ' + expression + '}').call(context);
      } catch {
        return '';
      }
    };
    template = template.replace(/\*ngFor/g, 'ngFor').replace(/\*ngIf/g, 'ngIf');
    // Parse the template string into a DOM structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');

    // Process *ngIf
    doc.querySelectorAll('[ngIf]').forEach((ngIfNode) => {
      const condition = ngIfNode.getAttribute('ngIf');
      if (!evaluateExpression(condition || '', data)) {
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

    // Process ngStyle and Responsive Styles
    const responsiveBreakpoints = {
      'lt-md': '(max-width: 768px)',
      'gt-md': '(min-width: 769px)',
    };
    const styleBlocks: string[] = [];
    doc.querySelectorAll('[ngStyle]').forEach((ngStyleNode) => {
      const ngStyleElement = ngStyleNode as HTMLElement;
      const styleObject = ngStyleElement.getAttribute('ngStyle');
      if (styleObject) {
        const styles = evaluateExpression(styleObject, data); // Evaluate the style object
        const className = `dynamic-style-${Math.random().toString(36).substr(2, 8)}`;
        ngStyleElement.classList.add(className); // Add a unique class
        console.log(styles);

        // Generate the style block for the class
        styleBlocks.push(`
            .${className} {
                ${Object.entries(styles)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')}
            }
        `);
        ngStyleElement.removeAttribute('ngStyle'); // Remove the ngStyle attribute
      }
    });

    // Append generated styles to the document
    if (styleBlocks.length > 0) {
      const styleTag = document.createElement('style');
      styleTag.textContent = styleBlocks.join('\n');
      doc.body.appendChild(styleTag); // Append to the body instead of the head
    }

    // Serialize the DOM back to an HTML string
    return doc.body.innerHTML;
  }
}
