import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ProductService } from './services/product.service';
import { Product } from './common/Product';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './components/product/product.component';
import { ProductType } from './common/ProductType';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule,ProductComponent,ProductDetailComponent,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[ProductService]
})
export class AppComponent implements OnInit{
  title = 'shop';
  itemTypeList:ProductType[]=new Array();
  isBlinking = false;
  isBlinkingIndex: number | null = null;
  productList:Product[]=new Array()
  hasProduct=false;
  loading=false;
  page = 1;
  pageSize = 6;
  endOfList = false;
  isLoading=false;
  currentProductType:string;
   searchControl = new FormControl();
  lastScrollPosition = 0;
  selectedProduct: Product;
  selectProduct=false;
  search=false
  carrentquery:string
  constructor(private service:ProductService){}

  ngOnInit(): void {
    this.currentProductType="Главная"    
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),  
        tap(value => {
          window.scrollTo(0, 0)
          this.search = value !== ''; // Set the flag based on input value
        }),
        switchMap(query => this.InitsearchProducts(query))
        
      ).subscribe((data:any )=> {      
       // console.log(data)
        this.productList = data.results||[];
      //  console.log(this.productList)
        this.search=true;        
        this.lastScrollPosition=0
        this.threshold=-300
        this.endOfList=false
        this.isLoading=false      
        if(!this.flag)  
            this.page=1;
      });
      this.service.getCategory().subscribe((data:any)=>{
        this.itemTypeList.push({id:1,name:"Главная"},...data.results||[])
      })
    this.normalGet()
  }

  loadProducts() {
    this.isLoading = true;
   // console.log("laod")
    if(this.search==false ||this.carrentquery==''){
         //  console.log("get")          
           this.normalGet()
  }else {
   // console.log("get1")
      this.searchGet()
  }
   this.loading=true;
  }
  threshold=-300;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
     // Threshold in pixels before the end of the page
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;
    //console.log(height - position)
    // Check if the user is scrolling down and approaching the bottom of the page
    if (window.scrollY < this.lastScrollPosition) {
 //     console.log("loadin to true ")
      this.isLoading = true; // Reset isLoading flag when scrolling up
    }
 //  console.log(this.isLoading )
   // console.log(this.endOfList )

    if (height - position <= this.threshold && !this.isLoading && !this.endOfList) {
      this.threshold=this.threshold-150;

      this.loadProducts();
      this.isLoading = true; // Set isLoading flag to true to prevent concurrent requests
    //  console.log("Loading more products...");
    }
    
    // Additional check to prevent loading if the user scrolls back up to an area that was already loaded

  
    this.lastScrollPosition = window.scrollY; // Update last scroll position
  }
  handlItemClick(item:string,index:number){
    this.lastScrollPosition=0;
    this.threshold=-300
    this.productList=new Array();
    this.page=1;
    if(this.currentProductType==item)
        return ;     
    this.isBlinking = true;
    this.isBlinkingIndex = index;
    this.endOfList=false
    this.isLoading=true;
    // Выключаем мигание через 1 секунду
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.isBlinkingIndex = null;
      this.isBlinking = false;
    }, 750);
    //console.log(item)
    this.currentProductType=item;
    if(this.search==false || this.carrentquery==''){
    this.normalGet();
      }else{
        this.searchProducts(this.carrentquery);
      }
      //  console.log(this.productList)
  }

  normalGet(){
    return this.service.getByCategory(this.currentProductType,this.page, this.pageSize).subscribe(
      (data: any) => {
        let list=data.results||[]
      // console.log(list)
        if (list.length > 0) {
          this.productList.push(...data.results);
          this.page++;
          this.loading=true
      //    console.log(this.productList)
        } else {
          this.endOfList = true; 
          this.page=1
        // console.log("end")// Помечаем, что больше товаров нет
        }
        this.isLoading = false;
      },  (error) => {
        
        this.isLoading = false; // Установка isLoading в false даже в случае ошибки
        // Здесь можно добавить дополнительную логику обработки ошибки, если требуется
      }
    );
   
  }
  searchGet(){
  //console.log("search")
    return this.service.searchProducts(this.carrentquery,this.currentProductType,this.page, this.pageSize).subscribe(
      (data: any) => {
        let list=data.results||[]
      // console.log(list)
        if (list.length > 0) {
          this.productList.push(...data.results);
          this.page++;
          this.loading=true
      //    console.log(this.productList)
        } else {
          this.endOfList = true; 
          this.page=1;
        // console.log("end")// Помечаем, что больше товаров нет
        }
        this.isLoading = false;
      },  (error) => {
        
        this.isLoading = false; // Установка isLoading в false даже в случае ошибки
        // Здесь можно добавить дополнительную логику обработки ошибки, если требуется
      }
    );

  }
  private searchProducts(query: string) {

    this.carrentquery=query

      return this.searchGet();

  }  
  flag:boolean=false;
  private InitsearchProducts(query: string) {

    this.carrentquery=query
    if(this.carrentquery==''){
      this.search=false
      //console.log("defulat loading") 
      this.page=2;
      this.isLoading=false
      this.threshold=-300
      this.flag=true
      return this.service.getByCategory(this.currentProductType,1,this.pageSize);
    }
    this.threshold=-300
    this.isLoading=false
    this.page=2;
    return this.service.searchProducts(query,this.currentProductType,1,this.pageSize);

  }
  
  receiveProductFromChild(product: Product) {
    this.selectedProduct = product;
    this.selectProduct=true
    this.isLoading=true
  }
  receiveProductFromChild1(flag:boolean){
    this.selectProduct=false;
    this.isLoading=false
  }
}
