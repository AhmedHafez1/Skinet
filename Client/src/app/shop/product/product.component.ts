import { BasketService } from './../../basket/basket.service';
import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() product!: IProduct;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {}

  addProductToBasket() {
    this.basketService.addBasketItem(this.product);
  }
}
