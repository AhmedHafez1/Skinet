import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shop-params';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];

  shopParams = new ShopParams();
  totalCount: number = 0;

  sortOPtions = [
    {
      name: 'Alphabetical',
      value: 'name',
    },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService
      .getProducts(this.shopParams)
      .subscribe((res: IPagination) => {
        this.products = res.data;
        this.totalCount = res.count;
        this.shopParams.pageIndex = res.page;
        this.shopParams.pageSize = res.pageSize;
      });
  }

  getBrands() {
    this.shopService.getBrands().subscribe((res) => {
      this.brands = [{ id: 0, name: 'All' }, ...res];
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe((res) => {
      this.types = [{ id: 0, name: 'All' }, ...res];
    });
  }

  onBrndFilter(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeFilter(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSort(event: Event) {
    this.shopParams.sort = (event.target as HTMLSelectElement).value;
    this.getProducts();
  }
}
