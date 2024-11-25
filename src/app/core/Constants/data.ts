export const jsonData=`{
  "alignment": "row",
  "descriptionImage": "https://images.pexels.com/photos/29437784/pexels-photo-29437784/free-photo-of-vibrant-autumn-leaves-on-the-forest-floor.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "formBackgroundColor": "#ebe9e9",
  "headingText": "This Season",
  "textFontStyle": [
    "B"
  ],
  "textFontFamily": "'Montserrat', sans-serif",
  "textSize": 42,
  "textColor": "#000000",
  "showSubText": true,
  "subText": "BE READY TO CHANGE",
  "subtextFontStyle": [
    "B"
  ],
  "subtextFontFamily": "'Montserrat', sans-serif",
  "subTextSize": 32,
  "subTextColor": "#000000",
  "buttonText": "Shop for Women",
  "buttonLink": "products",
  "buttonColor": "#f24141",
  "buttonBorderColor": "none",
  "buttonTextColor": "#ffffff",
  "buttonVisiblity": true,
  "buttonBorderRadius": 0,
  "buttonBorderLocation": "all",
  "textAlignment": "center",
  "isButtonBorder": false
}`
export const HtmlContent =`
<div
  class="shop-for work-section"
  [ngStyle]="{'background-color': formBackgroundColor}"
  fxLayout="row" fxLayout.lt-md="column" fxLayoutGap="10px">
  
  <!-- Image Section -->
  <div fxFlex="50%" class="img-height" [ngStyle.lt-md]="{'height': 'auto'}">
    <img
      [src]="descriptionImage"
      alt="description-images"
      [ngStyle]="{'object-fit': 'cover', 'width': '100%', 'height': '100%'}" />
  </div>

  <!-- Description Section -->
  <div
    class="description content"
    fxFlex="50%"
    fxLayout="column"
    fxLayoutAlign="center center"
    [ngStyle]="{'background-color': formBackgroundColor}">
    
    <!-- Heading Text -->
    <div fxLayout="column" fxLayoutAlign="center {{textAlignment}}" style="width: 100%;">
      <span
        *ngIf="headingText"
        class="three-line-clamp"
        [ngStyle]="{
          'color': textColor || '#000000',
          'font-family': textFontFamily || 'Montserrat',
          'font-weight': textFontStyle?.includes('B') ? 'bold' : 'normal',
          'font-style': textFontStyle?.includes('I') ? 'italic' : 'normal',
          'text-align': textAlignment,
          'font-size': textSize ? textSize + 'px' : '28px'
        }">
        {{ headingText }}
      </span>

      <!-- Subtext -->
      <p
        *ngIf="showSubText"
        class="primary-text-color four-line-clamp"
        [ngStyle]="{
          'color': subTextColor || '#000000',
          'font-family': subtextFontFamily || 'Montserrat',
          'font-weight': subtextFontStyle?.includes('B') ? 'bold' : 'normal',
          'font-style': subtextFontStyle?.includes('I') ? 'italic' : 'normal',
          'text-align': textAlignment,
          'font-size': subTextSize ? subTextSize + 'px' : '12px'
        }">
        {{ subText }}
      </p>
    </div>

    <!-- Button -->
    <div class="btn-container" *ngIf="buttonVisiblity" fxLayoutAlign="center">
      <button
        [ngStyle]="{
          'background-color': buttonColor || 'var(--primary-color)',
          'color': buttonTextColor || '#ffffff',
          'border-radius': buttonBorderRadius + 'px',
          'border': buttonBorderColor
        }"
        (click)="navigateTo(buttonLink)">
        {{ buttonText }}
      </button>
    </div>
  </div>
</div>
`