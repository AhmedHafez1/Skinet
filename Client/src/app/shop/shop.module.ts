import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductComponent } from './product/product.component';



@NgModule({
  declarations: [
    ShopComponent,
    ProductComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
