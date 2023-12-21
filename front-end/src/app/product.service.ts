import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private productsUrl = environment.backendCatalogue; // récupère l'URL mentionnée dans environment.ts

	constructor(private http: HttpClient) { }

	getProducts(): Observable<any[]> {
		return this.http.get<any[]>(this.productsUrl);
	}

	getProductById(productId: number): Observable<any> {
		const url = `${this.productsUrl}?id=${productId}`;
		return this.http.get<any>(url);
	  }
}
