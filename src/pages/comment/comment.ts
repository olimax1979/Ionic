import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {

  commentForm: FormGroup;
  
    constructor(public navCtrl: NavController, public navParams: NavParams,
      public viewCtrl: ViewController,
      private formBuilder: FormBuilder, ) {

        this.commentForm = this.formBuilder.group({
          author: ['', Validators.required],
          rating: 5,
          comment: ['', Validators.required],
        });
      }

      dismiss() {
        this.viewCtrl.dismiss();
  
      }
  
      onSubmit() {
        let comment=this.commentForm.value;
        console.log(comment);
        this.commentForm.value.date=new Date().toISOString();
        this.viewCtrl.dismiss(comment);
      }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad ReservationPage');
    }
  
  }
