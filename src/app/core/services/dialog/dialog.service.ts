import { Injectable } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private openDialog: MatDialog) {}
opendialog(message:string,message2:string){
    return this.openDialog.open(DialogComponent,{
      data:{
        content:message,
        content2:message2
      },
    autoFocus:false,
    width:'400px'
  })
}
}
