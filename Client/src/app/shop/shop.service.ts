import { IProduct } from 'src/app/shared/models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination as IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shop-params';
import { of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private products: IProduct[] = [];
  private brands: IBrand[] = [];
  private types: IType[] = [];

  private readonly baseUrl = environment.apiUrl;

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

    if (shopParams.search) params = params.append('search', shopParams.search);

    return this.http
      .get<IPagination>(this.baseUrl + 'products', { params })
      .pipe(
        tap((response) => {
          this.products = response.data;
        })
      );
  }

  getProduct(id: number) {
    const product = this.products.find((p) => p.id === id);

    if (product) return of(product);

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands() {
    if (this.brands.length > 0) return of(this.brands);
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      tap((data) => {
        this.brands = data;
      })
    );
  }

  getTypes() {
    if (this.types.length > 0) return of(this.types);
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      tap((data) => {
        this.types = data;
      })
    );
  }
}
