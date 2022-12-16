import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { validateEmail } from '../../../utils/validations';
// import { isEmpty } from 'lodash';
// import { AuthenticationService } from '../../../services/auth/auth.service';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { SpinnerService } from 'src/app/services/spinner.service';
// import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // ionicForm: FormGroup;

  constructor(
    // public formBuilder: FormBuilder,
    // public messageService: MessageService,
    public router: Router,
    public authService: AuthService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {}

  submitForm(form: NgForm) {
    console.log(form.valid);
    if (!form.valid) return;
    this.register(form);

    // if (
    //   isEmpty(this.ionicForm.value.email) ||
    //   isEmpty(this.ionicForm.value.password) ||
    //   isEmpty(this.ionicForm.value.repeatPassword) ||
    //   isEmpty(this.ionicForm.value.nombre)
    // ) {
    //   this.messageService.show('Todos los campos son obligatorios');
    // } else if (!validateEmail(this.ionicForm.value.email)) {
    //   this.messageService.show('El email no es correcto');
    // } else if (
    //   this.ionicForm.value.password !== this.ionicForm.value.repeatPassword
    // ) {
    //   this.messageService.show('las contraseñas no coinciden');
    // } else {
    //   this.spinnerService.showLoading();
    //   this.authService
    //     .registerUser(this.ionicForm.value.email, this.ionicForm.value.password)
    //     .then((res) => {
    //       const profile = {
    //         displayName: this.ionicForm.value.nombre,
    //         // photoURL: this.avatar,
    //       };
    //       this.authService.updateName(profile);
    //       this.afs.doc(`users/${res.user.uid}`).set({
    //         uid: res.user.uid,
    //         email: this.ionicForm.value.email,
    //         avatar: '',
    //         nombre: this.ionicForm.value.nombre,
    //       });
    //       this.spinnerService.endLoading();
    //       this.router.navigate(['tabs/home']);
    //     })
    //     .catch((error) => {
    //       this.spinnerService.endLoading();
    //       this.messageService.show('El email ya está en uso.');
    //     });
    // }
  }

  register(form: NgForm) {
    this.globalService.showLoading();
    console.log(form.value);
    this.authService
      .register(form.value)
      .then((data: any) => {
        console.log(data);
        this.router.navigate(['tabs/home']);
        this.globalService.endLoading();
        form.reset();
      })
      .catch((e) => {
        console.log(e);
        this.globalService.endLoading();
        let msg: string = 'Could not sign you up, please try again.';
        if (e.code == 'auth/email-already-in-use') {
          msg = e.message;
        }
        this.globalService.showAlert(msg);
      });
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
