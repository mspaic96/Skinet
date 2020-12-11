import { HttpClient } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null >(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotals| null>(null);
  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getBasket(id: string)
  {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map((basket: IBasket) =>
      {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );

  }

  // tslint:disable-next-line: typedef
  setBasket(basket: IBasket)
  {
      return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe( (response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();

      }, error => {
        console.log(error);
      }
      );
  }

  // tslint:disable-next-line: typedef
  getCurrentBasketValue()
  {
    return this.basketSource.value;
  }

  // tslint:disable-next-line: typedef
  addItemToBasket(item: IProduct , quantity = 1)
  {
     const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
     // tslint:disable-next-line: no-non-null-assertion
     const basket: IBasket = this.getCurrentBasketValue()! ?? this.createBasket();
     basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
     this.setBasket(basket);
  }
  // tslint:disable-next-line: typedef
  incrementItemQuantity(itemBasket: IBasketItem)
  {
    // tslint:disable-next-line: no-non-null-assertion
    const basket = this.getCurrentBasketValue()!;
    const foundItemIndex = basket.items.findIndex( x => x.id === itemBasket.id);
    basket.items [foundItemIndex].quantity ++;
    this.setBasket(basket);


  }
  // tslint:disable-next-line: typedef
  decrementItemQuantity(itemBasket: IBasketItem)
  {
    // tslint:disable-next-line: no-non-null-assertion
    const basket = this.getCurrentBasketValue()!;
    const foundItemIndex = basket.items.findIndex( x => x.id === itemBasket.id);
    if (basket.items [foundItemIndex].quantity > 1)
    { basket.items[foundItemIndex].quantity --;
      this.setBasket(basket);
    }
    else { this.removeItemFromBasket(basket.items[foundItemIndex]); }

  }
  // tslint:disable-next-line: typedef
  removeItemFromBasket(itemBasket: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket?.items.some( x => x.id === itemBasket.id))
     {
       basket.items = basket.items.filter(i => i.id !== itemBasket.id);
       if ( basket.items.length > 0)
       {
         this.setBasket(basket);
       } else
       {
         this.deleteBasket(basket);
       }
     }
  }
  // tslint:disable-next-line: typedef
  deleteBasket(basket: IBasket) {
    this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    }

    );
  }

  // tslint:disable-next-line: typedef
  private calculateTotals()
  {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    // tslint:disable-next-line: no-non-null-assertion
    const subtotal = basket?.items.reduce((a, b) => (b.price * b.quantity) + a, 0)!;
    const total = shipping + subtotal;
    this.basketTotalSource.next({shipping, subtotal, total});


  }
   private addOrUpdateItem(items: IBasketItem[] , itemToAdd: IBasketItem, quantity: number): IBasketItem[]  {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1)
    {
      itemToAdd.quantity = quantity;
      items?.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;

  }
  private createBasket(): IBasket | null {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }


  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem
  {
    return {
    id: item.id,
    productName: item.name,
    price: item.price,
    pictureUrl: item.pictureUrl,
    quantity,
    brand: item.productBrand,
    type: item.productType

    } ;
  }
}
