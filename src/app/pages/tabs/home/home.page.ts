import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Strings } from 'src/app/enum/strings.enum';
import { IonModal, IonSlides, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from 'src/app/services/api/api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  profileSub: Subscription;
  profile: any = {};
  users: any = [];
  parrots: any = [];
  type = 'custom';
  darkMode: boolean = true;
  message: string;

  constructor(
    private globalService: GlobalService,
    private navCtrl: NavController,
    private authService: AuthService,
    private profileService: ProfileService,
    private afs: AngularFirestore,
    private api: ApiService,
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  ngOnInit() {
    this.profileSub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
    });
    this.getData();
    this.getUsers();
    this.getParrots();
  }

  async getData() {
    try {
      // this.isLoading = true;
      await this.profileService.getProfile();
      // this.isLoading = false;
    } catch (e) {
      // this.isLoading = false;
      console.log(e);
      this.globalService.errorToast();
    }
  }

  confirmLogout() {
    this.globalService.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          },
        },
      ]
    );
  }

  logout() {
    this.globalService.showLoader();
    this.authService
      .logout()
      .then(() => {
        this.navCtrl.navigateRoot(Strings.LOGIN);
        this.globalService.hideLoader();
      })
      .catch((e) => {
        console.log(e);
        this.globalService.hideLoader();
        this.globalService.errorToast(
          'Logout Failed! Check your internet connection'
        );
      });
  }

  change() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');
  }

  getUsers() {
    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((user) => (this.users = user));
  }

  getParrots() {
    this.afs
      .collection('parrots')
      .valueChanges()
      .subscribe((parrots) => (this.parrots = parrots));
  }

  someThingLikeLogOut() {
    console.log('entra');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.message = '';
  }

  confirm() {
    this.afs
      .collection('parrots')
      .add({
        email: this.profile.email,
        message: this.message,
        name: this.profile.name,
        date: new Date(),
        favorite: false,
        uid: this.profile.uid,
      })
      .then(
        (res) => {
          console.log('Se ha creado correctamente');
          this.modal.dismiss(null, 'cancel');
          this.message = '';
          this.updateUserId(res.id);
        },
        (err) => console.log(err)
      );
  }

  updateUserId(id: string) {
    return this.afs.collection('parrots').doc(id).set({ id }, { merge: true });
  }

  onChange(event: any) {
    this.message = event.target.value;
  }
}
