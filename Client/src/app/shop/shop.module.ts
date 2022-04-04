import { ShopRoutingModule } from './shop-routing.module';
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';

@NgModule({
  declarations: [ShopComponent, ProductComponent, ProductDetailsComponent],
  imports: [SharedModule, ShopRoutingModule],
  exports: [],
})
export class ShopModule {}
