import { NgModule } from '@angular/core';
import { NgxLoadingStateDirective } from './ngx-loading-state.directive';
import { NgxLoadingStatePipe } from './ngx-loading-state.pipe';


@NgModule({
  declarations: [
    NgxLoadingStateDirective,
    NgxLoadingStatePipe
  ],
  imports: [],
  exports: [
    NgxLoadingStateDirective,
    NgxLoadingStatePipe
  ]
})
export class NgxLoadingStateModule {
}
