import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private  url:string="http://localhost:8080"
  constructor(private http:HttpClient) { }
  get():Observable<any>{
    let limit=new HttpParams().append("limit",5);
    return this.http.get<any>(`${this.url}/products/`);
  }
  getByCategory(category:string,page:number,pageSize:number):Observable<any>{
    if (category==="Главная")
      category="Main"
    let params=new HttpParams().append("category",category).append("page",page).append("pageSize",pageSize);
    return this.http.get<any>(`${this.url}/category/`,{params:params});
  }
  getCategory():Observable<any>{
    return this.http.get<any>(`${this.url}/categories/`);
  }
}
