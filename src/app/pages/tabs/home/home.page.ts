import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Strings } from 'src/app/enum/strings.enum';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slides', { static: false }) slider: IonSlides;
  profileSub: Subscription;
  profile: any = {};
  type = 'home';
  selectedSlide: any;
  segment = 0;

  options = {
    slidesPerView: 1.5,
    centered: true,
    spaceBetweenView: 10,
  };

  sliderOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 500,
  };

  constructor(
    private globalService: GlobalService,
    private navCtrl: NavController,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileSub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
    });
    this.getData();
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

  async segmentChanged(event) {
    console.log(this.segment);
    this.slider.slideTo(this.segment);
    //await this.selectedSlide.slideTo(this.segment);
  }

  async slidesChanged(slides: IonSlides) {
    this.selectedSlide = slides;
    slides.getActiveIndex().then((selectedIndex) => {
      this.segment = selectedIndex;
    });
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
}
