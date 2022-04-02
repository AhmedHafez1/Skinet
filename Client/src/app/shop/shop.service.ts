import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination as IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly BASE_URL = 'https://localhost:7029/api/';

  constructor(private http: HttpClient) {}

  getProducts(pageSize = 50, brandId?: number, typeId?: number) {
    console.log(brandId, typeId);
    let params = new HttpParams().append('pageSize', pageSize);
    brandId && (params = params.append('brandId', `${brandId}`));
    typeId && (params = params.append('typeId', `${typeId}`));

    return this.http.get<IPagination>(this.BASE_URL + 'products', { params });
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.BASE_URL + 'products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.BASE_URL + 'products/types');
  }
}
