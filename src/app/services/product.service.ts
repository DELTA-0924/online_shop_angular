import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }
  get():Observable<Product[]>{
    let limit=new HttpParams().append("limit",5);
    return this.http.get<Product[]>("https://fakestoreapi.com/products",{params:limit});
  }
}
