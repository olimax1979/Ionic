import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { DishProvider } from '../../providers/dish/dish';
import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';


/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;
  dishes: Dish[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private dishservice: DishProvider,
    private toastCtrl: ToastController,
    public asCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing) {
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
    
  }


  ngOnInit() { 
    
    this.dishservice.getDishes()
      .subscribe(dishes => this.dishes = dishes);
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);

    this.toastCtrl.create({
      message: this.dishes[this.dish.id].name + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  openAS() {

    this.asCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        
        {
          text: 'Add Comment',
          handler: () => {
            this.openComment();
          }
        },
        
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancelled')
          }
        },

        {
        text: 'Share via Facebook',
        handler: () => {
          this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Facebook'))
            .catch(() => console.log('Failed to post to Facebook'));
        }
      },

      {
        text: 'Share via Twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Twitter'))
            .catch(() => console.log('Failed to post to Twitter'));
        }
      },
      ]
    })
    .present();
    
  }

  openComment() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(comment => {
      if (comment) {
      this.dish.comments.push(comment);
      }
    });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  

}