import { Component, OnInit } from '@angular/core';
import { concatMap, delay, interval, mergeMap, of } from 'rxjs';
import { ngxLoadingState } from '../../../ngx-loading-state/src/lib/ngx-loading-state.operator';
import { NgxLoadingStateService } from '../../../ngx-loading-state/src/lib/ngx-loading-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'Sample App';

  state: any = {};

  constructor(private ngxLoadingStateService: NgxLoadingStateService) {
  }

  ngOnInit(): void {
    this.ngxLoadingStateService.getChanges('sample-app.root').subscribe(value => {
      console.log('ngxLoadingState:', value);
    });
  }

  startDelay() {
    of(1).pipe(
      delay(3000),
      ngxLoadingState('sample-app.root')
    ).subscribe(value => {
      this.state['delay'] = value;
    });
  }

  startInterval() {
    interval(1000).pipe(
      ngxLoadingState('sample-app.root')
    ).subscribe(value => {
      this.state['interval'] = value;
    });
  }

  startNested() {
    of(...Array(5).keys()).pipe(
      concatMap(value => {
        return of(value).pipe(
          delay(1000)
        );
      }),
      mergeMap((value) => {
        return of(value).pipe(
          delay(500),
          ngxLoadingState('sample-app.root')
        )
      })
    ).subscribe(value => {
      this.state['nested'] = value;
    });
  }


}
