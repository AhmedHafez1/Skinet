import { ShopService } from './../shop.service';
import { IProduct } from 'src/app/shared/models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;

  constructor(
    private activeRoute: ActivatedRoute,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails() {
    const id = +this.activeRoute.snapshot.params['id'];

    this.shopService.getProduct(id).subscribe((p) => (this.product = p));
  }
}
