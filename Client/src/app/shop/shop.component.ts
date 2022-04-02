import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
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

  selectedBrand: number | undefined = 0;
  selectedType: number | undefined = 0;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService
      .getProducts(20, this.selectedBrand, this.selectedType)
      .subscribe((res: IPagination) => {
        this.products = res.data;
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
    this.selectedBrand = brandId;
    this.getProducts();
  }

  onTypeFilter(typeId: number) {
    this.selectedType = typeId;
    this.getProducts();
  }
}
