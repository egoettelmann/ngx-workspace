import { TestBed } from '@angular/core/testing';

import { NgxLoadingStateService } from './ngx-loading-state.service';

describe('NgxLoadingStateService', () => {
  let service: NgxLoadingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLoadingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
