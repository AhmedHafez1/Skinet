import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [PaginationHeaderComponent, PagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    HttpClientModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    HttpClientModule,
    PaginationHeaderComponent,
    PagerComponent,
    RouterModule,
  ],
})
export class SharedModule {}
