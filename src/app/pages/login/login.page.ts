import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { validateEmail } from '../../utils/validations';
import { isEmpty } from 'lodash';
// import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  type: boolean = true;
  isLogin = false;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  recuperarPassword() {
    console.log('recuperarPassword');
  }

  submitForm(form: NgForm) {
    console.log(form);
    if (!form.valid) return;
    this.login(form);
  }

  login(form) {
    // this.isLogin = true;
    this.authService
      .login(form.value.email, form.value.password)
      .then((data) => {
        console.log(data);
        this.router.navigate(['tabs/home']);
        // this.isLogin = false;
        form.reset();
      })
      .catch((e) => {
        console.log(e);
        // this.isLogin = false;
        let msg: string = 'Could not sign you in, please try again.';
        if (e.code == 'auth/user-not-found')
          msg = 'E-mail address could not be found';
        else if (e.code == 'auth/wrong-password')
          msg = 'Please enter a correct password';
        this.globalService.showAlert(msg);
      });
  }

  registrarFacebook() {
    // this.spinnerService.showLoading();
    // this.firebaseService
    //   .facebookAuth()
    //   .then((res) => {
    //     this.spinnerService.endLoading();
    //     this.router.navigate(['tabs/account']);
    //   })
    //   .catch((error) => {
    //     this.spinnerService.endLoading();
    //     console.log('El email ya está en uso.');
    //   });
  }

  registrarGoogle() {
    // this.spinnerService.showLoading();
    // this.firebaseService
    //   .googleAuth()
    //   .then((res) => {
    //     this.spinnerService.endLoading();
    //     this.router.navigate(['tabs/account']);
    //   })
    //   .catch((error) => {
    //     this.spinnerService.endLoading();
    //     console.log('El email ya está en uso.');
    //   });
  }

  changeType() {
    this.type = !this.type;
  }
}
