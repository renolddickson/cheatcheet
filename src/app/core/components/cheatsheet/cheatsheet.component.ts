import { Component } from '@angular/core';
import { ApiService } from '../../services/API/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-cheatsheet',
  templateUrl: './cheatsheet.component.html',
  styleUrls: ['./cheatsheet.component.scss'],
})
export class CheatsheetComponent {
  id: any;
  data: any;
  isAuth = false;
  search!: string;
  constructor(
    private apiService: ApiService,
    private _Activatedroute: ActivatedRoute,
    private snack: MatSnackBar,
    private dialogservice: DialogService,
    private router: Router
  ) {
    this.id = this._Activatedroute.snapshot.paramMap.get('id');
    this._Activatedroute.params.subscribe((res) => {
      console.log(res);
    });
  }
  ngOnInit(): void {
    if (sessionStorage.getItem('currentUserToken')) {
      this.isAuth = true;
    }
    this.getOriginalData();
  }
  getOriginalData() {
    this.apiService.getData(this.id).subscribe((res) => {
      this.data = res;
    });
  }
  panelOpenState = false;
  onSearch(e: any) {
    const regex = new RegExp(e.target.value, 'i');
    const filteredArray = this.data.filter(
      (obj: any) => regex.test(obj.title) || regex.test(obj.description)
    );
    this.data = filteredArray;
    if (!e.target.value) {
      this.getOriginalData();
    }
  }
  onDelete(element_id: any) {
    const dialogref = this.dialogservice.opendialog(
      'You have unsaved changes!...',
      'Are you sure want to move from here?'
    );
    dialogref.afterClosed().subscribe((response) => {
      if (response) {
        this.apiService.deleteData(element_id, this.id).then(() => {
          this.snack.open('Data deleted successfully', 'ok', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        });
      }
    });
  }
  onEdit(dataId: any) {
    this.router.navigate(['/add', this.id, dataId]);
  }
}
