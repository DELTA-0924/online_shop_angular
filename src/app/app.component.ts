import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ProductService } from './services/product.service';
import { Product } from './common/Product';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './components/product/product.component';
import { ProductType } from './common/ProductType';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule,ProductComponent,ProductDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[ProductService]
})
export class AppComponent implements OnInit{
  title = 'shop';
  itemTypeList:ProductType[];
  isBlinking = false;
  isBlinkingIndex: number | null = null;
  productList:Product[]
  hasProduct=false;
  loading=true;
  page = 1;
  pageSize = 10;
  endOfList = true;
  currentProductType:string;

  selectedProduct: Product;
  selectProduct=false;
  receiveProductFromChild(product: Product) {
    this.selectedProduct = product;
    this.selectProduct=true

  }
  receiveProductFromChild1(flag:boolean){
    this.selectProduct=false;

  }
  constructor(private service:ProductService){}
  handlItemClick(item:string,index:number){
    this.isBlinking = true;
    this.isBlinkingIndex = index;
    // Выключаем мигание через 1 секунду
    setTimeout(() => {
      this.isBlinkingIndex = null;
      this.isBlinking = false;
    }, 750);
    console.log(item)
    this.currentProductType=item;
    this.service.getByCategory(item,1,10).subscribe(  (data: any) => {
      this.productList = data.results||[]; // Принимаем массив продуктов из ответа     
        this.loading=false;
       },
        (error) => {
            console.error('Failed to fetch products:', error);
            this.loading = false;
        })

  }
  ngOnInit(): void {
    
    this.service.getByCategory("Главная",1,10).subscribe(  (data: any) => {
      this.productList = data.results||[]; // Принимаем массив продуктов из ответа     
        this.loading=false;    
       },
      (error) => {
          console.error('Failed to fetch products:', error);
      })
      this.service.getCategory().subscribe(  (data: any) => {              
        this.itemTypeList = [{ id: 1, name: "Главная" }, ...data.results || []];

         },
        (error) => {
            console.error('Failed to fetch products:', error);
        })
  }

  loadProducts() {
    this.loading = true;
    this.service.getByCategory(this.currentProductType,this.page, this.pageSize).subscribe(
      (data: any[]) => {
        if (data.length > 0) {
          this.productList.push(...data);
          this.page++;
        } else {
          this.endOfList = true; // Помечаем, что больше товаров нет
        }
        this.loading = false;
      },
      error => {
        console.error('Failed to fetch products:', error);
        this.loading = false;
      }
    );
  }

  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight && !this.loading && !this.endOfList) {
      this.loadProducts();
    }
  }

}
