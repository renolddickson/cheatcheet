import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/API/api.service';
@Component({
  selector: 'app-recentlyvp-translate',
  templateUrl: './recentlyvp-translate.component.html',
  styleUrls: ['./recentlyvp-translate.component.scss']
})
export class RecentlyvpTranslateComponent {
  constructor(
    private apiService: ApiService,
    private translate: TranslateService
  ) {}
  inputObject = {
    greeting: 'HELLO',
    farewell: 'GOODBYE'
  };
  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.translateObject()
  }
  translateObject() {
    this.apiService.translateObject(this.inputObject, 'ta').subscribe(res=>{
      console.log(res);
      
    })
  }
}
