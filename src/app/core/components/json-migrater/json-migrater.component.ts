import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-json-migrater',
  templateUrl: './json-migrater.component.html',
  styleUrls: ['./json-migrater.component.scss']
})
export class JsonMigraterComponent {
  converter!: FormGroup;
  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    })

  }
  onConvert() {
    if(this.isValidJSON(this.converter.get('normal')?.value)){

    }else{
      alert('Enter a valid json')
      this.converter.reset()
    }
  }
  isValidJSON(jsonString:string) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
}
