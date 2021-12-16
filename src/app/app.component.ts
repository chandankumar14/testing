import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chaplin';
  loading: boolean = false;
  loadingSubscription: Subscription;
  constructor(private loaderService: LoaderService) {}
  ngOnInit() {
    this.loadingSubscription = this.loaderService.loaderStatus.subscribe(
      (val: boolean) => {
        console.log('isSpinnerVisible', val);
        setTimeout(() => {
          this.loading = val;
        });
      }
    );
  }
  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
