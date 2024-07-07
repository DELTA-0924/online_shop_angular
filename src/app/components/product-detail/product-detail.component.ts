import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../common/Product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product: Product={id:1,title:"Base",description:"base",category:"base",color:"base",image:"base",price:"0",size:"base"};
  @Output() detailOutput: EventEmitter<boolean>= new EventEmitter();
  closeDetail(){
    this.detailOutput.emit(false);

  }
}
