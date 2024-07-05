import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { productTypeList } from './common/ProductType';
import { ProductService } from './services/product.service';
import { Product } from './common/Product';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './components/product/product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule,ProductComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[ProductService]
})
export class AppComponent implements OnInit{
  title = 'shop';
  itemTypeList=productTypeList;
  isBlinking = false;
  isBlinkingIndex: number | null = null;
  productList:Product[]
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
  }
  ngOnInit(): void {
    this.service.get().subscribe(product=>{
      this.productList=product;
    })
    //console.log(this.productList)

  }
}
