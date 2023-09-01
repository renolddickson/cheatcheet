import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  resetPasswordInit(email: string) {
    return sendPasswordResetEmail(this.auth, email).then(() =>
      console.log('success')
    );
  }
}
