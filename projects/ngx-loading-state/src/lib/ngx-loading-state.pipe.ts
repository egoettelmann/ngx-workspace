import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxLoadingStateService } from './ngx-loading-state.service';

@Pipe({
  name: 'ngxLoadingState',
  pure: false
})
export class NgxLoadingStatePipe implements PipeTransform, OnDestroy {

  /**
   * The value when loading.
   */
  private valueWhenLoading?: boolean;

  /**
   * The current loading state
   */
  private currentLoadingState?: boolean;

  private subscription?: Subscription;

  constructor(
    private ref: ChangeDetectorRef,
    private ngxLoadingStateService: NgxLoadingStateService
  ) {
  }

  transform(value: boolean, channelName: string): boolean {
    if (this.valueWhenLoading != value) {
      this.valueWhenLoading = value;
      // Input value has changed: (re)creating subscription
      this.clear();
      this.subscription = this.ngxLoadingStateService.getChanges(channelName).subscribe(value => {
        if (value === this.currentLoadingState) {
          // Loading state did not change: nothing to do
          return;
        }

        // Loading state changed: mark for check
        this.currentLoadingState = value;
        this.ref.markForCheck();
      });
    }

    // Returning value based on current state
    return this.currentLoadingState ? this.valueWhenLoading : (!this.valueWhenLoading);
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
