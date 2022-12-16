import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(
    private authService: AuthService,
    private globalService: GlobalService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.valid) return;
    this.authService
      .resetPassword(form.value.email)
      .then((data) => {
        console.log(data);
        this.globalService.successToast(
          'Reset password link is sent to your Email Address'
        );
        this.navCtrl.back();
      })
      .catch((e) => {
        console.log(e);
        this.globalService.showAlert('Something went wrong');
      });
  }
  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
