import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { SearchService } from './search.service';
import { catchError, debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'Application TP5';
	productsAll: any[] = [];
	isLoggedIn = false;
	loginForm = { login: '', password: '' };
	searchTerm: string = '';
	searchField$: any;
	input: any;
	model: any;

	constructor(
		private productService: ProductService, // utilisé dans la version sans back end temporairement
		private apiService: ApiService,
		private searchService: SearchService,

	) { }

	ngOnInit(): void {
		this.checkAuthentication();
	}

	login(): void {
		const { login, password } = this.loginForm;

		this.apiService.loginClient(login, password).subscribe(
			(client) => {
				this.isLoggedIn = true;
				this.loadProducts();
			},
			(error) => {
				console.error('Erreur lors de la connexion :', error);
				this.loginForm = { login: '', password: '' }; // On "vide" le formulaire si la connexion a échoué
			}
		);
	}

	private checkAuthentication(): void {
	}

	// Ce chargement se produit après authentification
	private loadProducts(): void {
		this.productService.getProducts().subscribe(
			(data: any[]) => {
				this.productsAll = data;
			},
			(error) => {
				console.error('Erreur lors du chargement des produits :', error);
			}
		);
	}
	ngAfterViewInit() {
		this.searchField$ = fromEvent(this.input.nativeElement, `keyup`);
		this.model = this.searchField$.pipe(
		  map((event: any) => event.target.value),
		  debounceTime(300),
		  distinctUntilChanged(),
	
		  switchMap((term: string) =>
			this.searchService.search(term).pipe(
			  catchError(() => {
				return of([]);
			  })
			)
		  )
		);
	  }
}






// import { Component, OnInit } from '@angular/core';
// import { ProductService } from './product.service';
// import { Observer, Observable } from 'rxjs';
// import { ApiService } from './api.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   title = 'Application TP3';
//   productsAll: any[] = [];

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     const observer: Observer<any[]> = {
//       next: (data: any[]) => {
//         this.productsAll = data;
//       },
//       error: (error: any) => {
//         console.error('Erreur lors de la recherche !', error);
//       },
//       complete: () => {
//       }
//     };

//     this.productService.getProducts().subscribe(observer);
//   }
// }
