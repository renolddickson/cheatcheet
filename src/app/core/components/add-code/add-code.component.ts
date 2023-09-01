import { Component } from '@angular/core';
import { ApiService } from '../../services/API/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.scss'],
})
export class AddCodeComponent {
  ts_code = false;
  id: any;
  cheatForm!: FormGroup;

  constructor(
    private apiService: ApiService,
    private snack: MatSnackBar,
    private _Activatedroute: ActivatedRoute
  ) {
    this.id = this._Activatedroute.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.cheatForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null),
      ftype: new FormControl(null, Validators.required),
      fcode: new FormControl(null, Validators.required),
      stype: new FormControl(null),
      scode: new FormControl(null),
    });
  }
  onSubmit() {
    if (this.cheatForm.valid) {
      this.apiService
        .postData(this.id, this.cheatForm.value)
        .then(() => {
          this.snack.open('Data saved successfully', 'ok', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.cheatForm.reset();
          this.cheatForm.clearValidators();
          this.cheatForm.updateValueAndValidity();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  add() {
    this.ts_code = true;
  }

  canDeactivate() :boolean {
   return this.cheatForm ? !this.cheatForm.dirty : true;
  }
}
