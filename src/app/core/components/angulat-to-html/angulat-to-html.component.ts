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

  responsiveBreakpoints: Record<Breakpoint, string> = {
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
    base: '' // Special case for base styles
  };

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  processJson() {
    try {
      const parsedJson = JSON.parse(this.sampleJson);
      this.outputCode = this.compileAngularTemplate(this.sampleCode, parsedJson);
      this.sanitizedCode = this.sanitizeHtml(this.outputCode);
      console.log('this.outputCode', this.outputCode);
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
      "styles": {
        "normal_color": "black",
        "medium_color": "red",
        "small_color": "blue"
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
          ngStyle="{ color: styles.normal_color }"
          ngStyle.lt-md="{ color: styles.medium_color }"
          ngStyle.gt-md="{ color: styles.small_color }"
        >
          Responsive styled content
        </div>
      </div>
    `;
  }

  reset() {
    this.sampleJson = '';
    this.sampleCode = '';
    this.outputCode = '';
  }

  compileAngularTemplate(template: string, data: Record<string, any>): string {
    template = this.replaceShorthandDirectives(template);

    const doc = new DOMParser().parseFromString(template, 'text/html');
    this.processNgIfDirectives(doc, data);
    this.processNgForDirectives(doc, data);
    this.interpolateText(doc, data);

    const globalStyles = this.collectStyles(doc, data);
    const styleBlocks = this.generateStyleBlocks(globalStyles);

    if (styleBlocks.length > 0) {
      this.appendStylesToDocument(doc, styleBlocks);
    }

    return doc.body.innerHTML;
  }

  private replaceShorthandDirectives(template: string): string {
    return template.replace(/\*ngFor/g, 'ngFor').replace(/\*ngIf/g, 'ngIf');
  }

  private evaluateExpression(expression: string | null, context: Record<string, any>): any {
    if (!expression) return null;
    try {
      return new Function('with(this) { return ' + expression + '}').call(context);
    } catch (error) {
      console.error(`Error evaluating expression: "${expression}"`, error);
      return null;
    }
  }

  private processNgIfDirectives(doc: Document, data: Record<string, any>) {
    doc.querySelectorAll('[ngIf]').forEach((node) => {
      const condition = node.getAttribute('ngIf');
      if (!this.evaluateExpression(condition, data)) {
        node.remove();
      } else {
        node.removeAttribute('ngIf');
      }
    });
  }

  private processNgForDirectives(doc: Document, data: Record<string, any>) {
    doc.querySelectorAll('[ngFor]').forEach((node) => {
      const directive = node.getAttribute('ngFor');
      const match = directive?.match(/let (\w+) of (\w+)/);
      if (match) {
        const [_, item, array] = match;
        const items = this.evaluateExpression(array, data) || [];
        const parent = node.parentElement;
        const fragment = document.createDocumentFragment();

        items.forEach((itemData: any) => {
          const clone = node.cloneNode(true) as HTMLElement;
          clone.removeAttribute('ngFor');
          clone.innerHTML = clone.innerHTML.replace(/{{\s*(.*?)\s*}}/g, (_, expr) =>
            this.evaluateExpression(expr, { ...data, [item]: itemData }) || ''
          );
          fragment.appendChild(clone);
        });

        parent?.replaceChild(fragment, node);
      }
    });
  }

  private interpolateText(doc: Document, data: Record<string, any>) {
    doc.querySelectorAll('*').forEach((node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = (child.textContent || '').replace(/{{\s*(.*?)\s*}}/g, (_, expr) =>
            this.evaluateExpression(expr, data) || ''
          );
        }
      });
    });
  }

  private collectStyles(doc: Document, data: Record<string, any>): Record<string, string[]> {
    const globalStyles: Record<string, string[]> = {
      base: [],
      ...Object.keys(this.responsiveBreakpoints).reduce((acc, key) => ({ ...acc, [key]: [] }), {})
    };

    doc.querySelectorAll('*').forEach((node) => {
      if (node instanceof HTMLElement) {
        this.processNgStyle(node, data, globalStyles, 'base');
        this.processResponsiveStyles(node, data, globalStyles);
      }
    });

    return globalStyles;
  }

  private processNgStyle(
    node: HTMLElement,
    data: Record<string, any>,
    globalStyles: Record<string, string[]>,
    breakpoint: string
  ) {
    const ngStyle = node.getAttribute('ngStyle');
    if (ngStyle) {
      const styles = this.evaluateExpression(ngStyle, data);
      if (styles && typeof styles === 'object') {
        const className = this.generateDynamicClassName();
        node.classList.add(className);
        globalStyles[breakpoint].push(this.generateCssRule(className, styles));
      }
      node.removeAttribute('ngStyle');
    }
  }

  private processResponsiveStyles(
    node: HTMLElement,
    data: Record<string, any>,
    globalStyles: Record<string, string[]>
  ) {
    Object.entries(this.responsiveBreakpoints).forEach(([breakpoint, query]) => {
      const directive = `ngStyle.${breakpoint}`;
      const responsiveStyle = node.getAttribute(directive);
      if (responsiveStyle) {
        const styles = this.evaluateExpression(responsiveStyle, data);
        if (styles && typeof styles === 'object') {
          const className = this.generateDynamicClassName();
          node.classList.add(className);
          globalStyles[breakpoint].push(this.generateCssRule(className, styles));
        }
        node.removeAttribute(directive);
      }
    });
  }

  private generateDynamicClassName(): string {
    const timestamp = Date.now().toString(36).substr(2, 8);
    const randomPart = Math.random().toString(36).substr(2, 8);
    return `dynamic-${timestamp}-${randomPart}`;
}


  private generateCssRule(className: string, styles: Record<string, any>): string {
    return `.${className} { ${Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`;
  }

  private generateStyleBlocks(globalStyles: Record<string, string[]>): string[] {
    return Object.entries(globalStyles)
      .map(([breakpoint, styles]) => {
        if (styles.length === 0) return ''; // Skip empty styles
        const mediaQuery =
          breakpoint in this.responsiveBreakpoints && this.responsiveBreakpoints[breakpoint as Breakpoint]
            ? `@media ${this.responsiveBreakpoints[breakpoint as Breakpoint]}`
            : '';
        return `${mediaQuery} {\n${styles.join('\n')}\n}`;
      })
      .filter(Boolean);
  }

  private appendStylesToDocument(doc: Document, styleBlocks: string[]) {
    const styleTag = document.createElement('style');
    styleTag.textContent = styleBlocks.join('\n');
    doc.body.appendChild(styleTag);
  }
}
