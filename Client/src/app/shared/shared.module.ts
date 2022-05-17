import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { HttpClientModule } from '@angular/common/http';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';

@NgModule({
  declarations: [PaginationHeaderComponent, PagerComponent, OrderTotalsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    HttpClientModule,
    RouterModule,
    CarouselModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    HttpClientModule,
    PaginationHeaderComponent,
    PagerComponent,
    RouterModule,
    CarouselModule,
    OrderTotalsComponent,
    ReactiveFormsModule
  ],
})
export class SharedModule {}
