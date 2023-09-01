import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Observer, filter } from 'rxjs';
import { DialogService } from '../dialog/dialog.service';

export abstract class FormCanDeactivate {
  abstract canDeactivate(): boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<unknown> {
  constructor(private dialogservice : DialogService) {}
  canDeactivate(component: FormCanDeactivate): Observable<boolean> | boolean {
    if(!component.canDeactivate()){
      return new Observable((observer: Observer<boolean>) => {
        const dialogref = this.dialogservice.opendialog('You have unsaved changes!...','Are you sure want to move from here?');
        dialogref.afterClosed().pipe(filter((result: boolean) => {
          return result;
        })).subscribe((res: any) => {
          observer.next(true);
          observer.complete();
        });
      });
    }else{
      return true;
    }
  }


}
