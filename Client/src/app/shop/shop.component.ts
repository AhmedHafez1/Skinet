import { NgxSpinnerService } from 'ngx-spinner';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
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
export class ShopComponent implements OnInit, AfterViewChecked {
  @ViewChild('search') search!: ElementRef;

  products: IProduct[] | undefined;
  brands: IBrand[] | undefined;
  types: IType[] | undefined;

  shopParams = new ShopParams();
  totalCount: number = 0;

  loading = false;

  sortOPtions = [
    {
      name: 'Alphabetical',
      value: 'name',
    },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(
    private shopService: ShopService,
    private changeDetector: ChangeDetectorRef,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
    this.spinnerService.spinnerObservable.subscribe(
      (spin) => (this.loading = spin?.show)
    );
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
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
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onTypeFilter(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onSort(event: Event) {
    this.shopParams.sort = (event.target as HTMLSelectElement).value;
    this.getProducts();
  }

  onPageChange(page: number) {
    if (this.shopParams.pageIndex !== page) {
      this.shopParams.pageIndex = page;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.search.nativeElement.value;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onReset() {
    this.search.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
