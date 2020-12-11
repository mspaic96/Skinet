import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService,
              private activeRoute: ActivatedRoute,
              private bcService: BreadcrumbService,
              private basketService: BasketService) {
                this.bcService.set('@productDetails', '');
              }

  ngOnInit(): void {
    this.loadProduct();
  }
  // tslint:disable-next-line: typedef
  addItemToBasket()
  {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
  // tslint:disable-next-line: typedef
  incrementQuantity()
  {
    this.quantity ++;
  }
  // tslint:disable-next-line: typedef
  decrementQuantity()
  {
    if (this.quantity > 1) {
    this.quantity --;
    }
  }
  // tslint:disable-next-line: typedef
  loadProduct()
  {

    // tslint:disable-next-line: no-non-null-assertion
    this.shopService.getProduct(+this.activeRoute.snapshot.paramMap.get('id')!).subscribe(product => {
      this.product = product;
      // tslint:disable-next-line: no-unused-expression
      this.bcService.set('@productDetails', product.name);
    }, error => {
      console.log(error);
    }

      );

  }

}
