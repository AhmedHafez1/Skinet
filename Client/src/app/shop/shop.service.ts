import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination as IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shop-params';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly BASE_URL = 'https://localhost:7029/api/';

  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams()
      .append('pageSize', shopParams.pageSize)
      .append('pageIndex', shopParams.pageIndex);

    shopParams.brandId &&
      (params = params.append('brandId', `${shopParams.brandId}`));
    shopParams.typeId &&
      (params = params.append('typeId', `${shopParams.typeId}`));

    params = params.append('sort', shopParams.sort);

    if (shopParams.search)  params = params.append('search', shopParams.search);

    return this.http.get<IPagination>(this.BASE_URL + 'products', { params });
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.BASE_URL + 'products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.BASE_URL + 'products/types');
  }
}
