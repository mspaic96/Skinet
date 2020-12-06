import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private shopService: ShopService, private activeRoute: ActivatedRoute ,
              private bcService: BreadcrumbService) { 
                this.bcService.set('@productDetails', '');
              }

  ngOnInit(): void {
    this.loadProduct();
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
