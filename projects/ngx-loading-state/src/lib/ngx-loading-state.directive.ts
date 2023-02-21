import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxLoadingStateService } from './ngx-loading-state.service';

@Directive({
  selector: '[ngxLoadingState]',
  host: {
    '[class.ngx-loading-state]': 'true',
    '[class.ngx-loading-state--active]': 'loading'
  }
})
export class NgxLoadingStateDirective implements OnChanges, OnDestroy {

  /**
   * The channel on which the loader should subscribe to.
   */
  @Input()
  ngxLoadingState?: string;

  /**
   * The current loading state.
   */
  loading = false;

  private subscription?: Subscription;

  constructor(private elementRef: ElementRef, private ngxLoadingStateService: NgxLoadingStateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clear();
    if (this.ngxLoadingState == null) {
      return;
    }
    this.subscription = this.ngxLoadingStateService.getChanges(this.ngxLoadingState).subscribe(state => {
      this.loading = state;
    });
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private clear() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

}
