import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Dish } from '../../shared/dish';
import { Observable } from 'rxjs/Observable';
import { DishProvider } from '../dish/dish';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {
  
    favorites: Array<any>;
  
    constructor(public http: Http,
      private dishservice: DishProvider,
      private favStorage: Storage,
      private localNotifications: LocalNotifications) {

      
      console.log('Hello FavoriteProvider Provider');
      this.favorites = [];
      
      
      favStorage.get('favorites').then(favorites => {
        if (favorites) {
          console.log(favorites);
          this.favorites=favorites;
        }

      });
      
    }
  
    addFavorite(id: number): boolean {
      if (!this.isFavorite(id))
        this.favorites.push(id);
        this.favStorage.set('favorites', this.favorites)

        // Schedule a single notification
        this.localNotifications.schedule({
        id: id,
        text: 'Dish ' + id + ' added as a favorite successfully'
      });

      console.log('favorites', this.favorites);
      return true;
    }
    
    
    isFavorite(id: number): boolean {
      return this.favorites.some(el => el === id);
          
    }
    

    getFavorites(): Observable<Dish[]> {
      return this.dishservice.getDishes()
        .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
        
    }

    getName(): Observable<Dish[]> {
      return this.dishservice.getDishes()
        .map(dishes => dishes.filter(dish => this.favorites.some(eo => eo === dish.name)));
        
  
    }
    
    deleteFavorite(id: number): Observable<Dish[]> {
      let index = this.favorites.indexOf(id);
      if (index >= 0) {
        this.favorites.splice(index,1);
        this.favStorage.set('favorites', this.favorites);
        return this.getFavorites();
      }
      else {
        console.log('Deleting non-existant favorite', id);
        return Observable.throw('Deleting non-existant favorite' + id);
      }
    }
  }
    
    