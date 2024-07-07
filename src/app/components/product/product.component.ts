import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Product } from '../../common/Product';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product:Product;
  @Output() productOutput: EventEmitter<Product> = new EventEmitter<Product>();

  productDetail() {

    this.productOutput.emit(this.product);
    
  }
}
