import { NgxSpinnerService } from 'ngx-spinner';
import { ShopService } from './../shop.service';
import { IProduct } from 'src/app/shared/models/product';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: IProduct;
  loading = false;
  quantity: number = 1;

  constructor(
    private activeRoute: ActivatedRoute,
    private shopService: ShopService,
    private brCrumbService: BreadcrumbService,
    private spinnerService: NgxSpinnerService,
    private basketService: BasketService
  ) {}

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addProductToBasket() {
    this.basketService.addBasketItem(this.product, this.quantity);
  }

  ngOnDestroy(): void {
    this.brCrumbService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.getProductDetails();
    this.spinnerService.spinnerObservable.subscribe(
      (spin) => (this.loading = spin?.show)
    );
  }

  getProductDetails() {
    const id = +this.activeRoute.snapshot.params['id'];

    this.shopService.getProduct(id).subscribe((p) => {
      this.product = p;
      this.brCrumbService.set('@productDetails', p.name);
    });
  }
}
