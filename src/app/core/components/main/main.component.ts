import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/Auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  loginLoading = false;
  collection!: FormGroup;
  credential!: any;
  @ViewChild('collectiondialog') collectiondialog!: TemplateRef<any>;
  @HostListener('window:keydown', ['$event']) onKeyDown(e: any) {
    if (e.shiftKey && e.keyCode == 76) {
      this.dialog.open(this.collectiondialog);
    }
  }
  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.collection = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  onLogin() {
    this.loginLoading = true;
    this.auth
      .login(
        this.collection.get('name')?.value,
        this.collection.get('password')?.value
      )
      .then((res) => {
        this.loginLoading = false;
        this.credential = res;
        sessionStorage.setItem(
          'currentUserToken',
          JSON.stringify({ token: this.credential._tokenResponse.idToken })
        );
        this.snack.open('Login successfully', 'ok', {
          duration: 3000,
        });
      })
      .catch((err) => {
        this.loginLoading = false;
        this.snack.open(this.displayErrors(err), 'close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      });
  }
  displayErrors(err: any) {
    return err['code'].slice(5);
  }
}
