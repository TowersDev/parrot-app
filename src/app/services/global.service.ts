import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  setLoader() {
    this.isLoading = !this.isLoading;
  }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position,
    });
    toast.present();
  }

  showAlert(message: string, header?, buttonArray?, inputs?) {
    this.alertCtrl
      .create({
        header: header ? header : 'Authentication failed',
        message: message,
        inputs: inputs ? inputs : [],
        buttons: buttonArray ? buttonArray : ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(
      msg ? msg : 'No Internet Connection',
      'danger',
      'bottom',
      duration
    );
  }

  hideLoader() {
    // this.isLoading = false;
    if (this.isLoading) this.setLoader();
    return this.loadingCtrl
      .dismiss()
      .then(() => console.log('dismissed'))
      .catch((e) => console.log('error hide loader: ', e));
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: 'dots',
    });

    loading.present();
  }

  endLoading() {
    this.loadingCtrl.dismiss();
  }

  showLoader(msg?, spinner?) {
    // this.isLoading = true;
    if (!this.isLoading) this.setLoader();
    return this.loadingCtrl
      .create({
        message: msg,
        spinner: spinner ? spinner : 'bubbles',
      })
      .then((res) => {
        res.present().then(() => {
          if (!this.isLoading) {
            res.dismiss().then(() => {
              console.log('abort presenting');
            });
          }
        });
      })
      .catch((e) => {
        console.log('show loading error: ', e);
      });
  }
}
