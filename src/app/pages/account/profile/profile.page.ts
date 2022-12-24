import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileSub: Subscription;
  profile: any = {};
  params: any = {};
  username: string;
  email: string;
  uid: string;
  followersRef: any;
  followingRef: any;
  activityFeedRef: any;
  isFollowing: boolean = false;
  followerCount: number = 0;
  followingCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private afs: AngularFirestore,
    translate: TranslateService
  ) {
    this.followersRef = this.afs.collection('followers');
    this.followingRef = this.afs.collection('following');
    this.activityFeedRef = this.afs.collection('feed');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.params = params;
    });
    this.username = this.route.snapshot.queryParamMap.get('name');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.uid = this.route.snapshot.queryParamMap.get('uid');

    this.profileSub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
      if (this.profile) {
        this.getFollowers();
        this.getFollowing();
        this.checkIfFollowing();
      }
    });
  }

  buildProfileButton() {
    if (this.profile) {
      if (this.profile.uid === this.params.id) {
        return 'editar perfil';
      }
      if (this.profile.uid !== this.params.id && this.isFollowing) {
        return 'dejar de seguir';
      }
      if (this.profile.uid !== this.params.id && !this.isFollowing) {
        return 'seguir';
      }
    }
    return '';
  }

  editProfile() {
    console.log('entra');
  }

  async getFollowers() {
    const followers = await this.followersRef
      .doc(this.uid)
      .collection('userFollowers')
      .get();
    followers.subscribe((res) => {
      this.followerCount = res.size;
    });
  }

  async getFollowing() {
    const following = await this.followingRef
      .doc(this.uid)
      .collection('userFollowing')
      .get();
    following.subscribe((res) => {
      this.followingCount = res.size;
    });
  }

  async checkIfFollowing() {
    if (this.followersRef) {
      const doc = await this.followersRef
        .doc(this.uid)
        .collection('userFollowers')
        .doc(this.profile.uid)
        .get();
      doc.subscribe((res) => {
        this.isFollowing = res.exists;
      });
    }
  }

  follow(followerId: string, followedId: string) {
    this.isFollowing = true;

    this.followersRef
      .doc(followedId)
      .collection('userFollowers')
      .doc(followerId)
      .set({});

    this.followingRef
      .doc(followerId)
      .collection('userFollowing')
      .doc(followedId)
      .set({});

    this.activityFeedRef
      .doc(followedId)
      .collection('feedItems')
      .doc(followerId)
      .set({
        type: 'follow',
        ownerId: followedId,
        username: this.profile.name,
        date: new Date(),
      });

    this.getFollowers();
    this.getFollowing();
  }

  unFollow(followerId: string, followedId: string) {
    this.isFollowing = false;

    this.followersRef
      .doc(followedId)
      .collection('userFollowers')
      .doc(followerId)
      .delete();

    this.followingRef
      .doc(followerId)
      .collection('userFollowing')
      .doc(followedId)
      .delete();

    this.activityFeedRef
      .doc(followedId)
      .collection('feedItems')
      .doc(followerId)
      .delete();

    this.getFollowers();
    this.getFollowing();
  }
}
