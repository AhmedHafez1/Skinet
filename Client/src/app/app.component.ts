import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProductPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  products: IProduct[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<IProductPagination>('https://localhost:7029/api/products?pageSize=10')
      .subscribe((res: IProductPagination) => {
        this.products = res.data;
      });
  }
}
