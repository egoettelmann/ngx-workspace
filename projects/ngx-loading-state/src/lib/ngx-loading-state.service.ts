import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxLoadingStateChannel } from './ngx-loading-state-channel';
import { ngxLoadingState } from './ngx-loading-state.operator';

@Injectable({
  providedIn: 'root'
})
export class NgxLoadingStateService {

  private channels: { [channel: string]: NgxLoadingStateChannel } = {};

  constructor() {
    // Assigning service to static function
    (ngxLoadingState as any).ngxLoadingStateService = this;
  }

  public start(channelName: string) {
    this.getChannel(channelName).setLoading();
  }

  public stop(channelName: string) {
    this.getChannel(channelName).unsetLoading();
  }

  public getChanges(channelName: string): Observable<boolean> {
    return this.getChannel(channelName).changes.asObservable();
  }

  private getChannel(channelName: string): NgxLoadingStateChannel {
    if (!this.channels.hasOwnProperty(channelName)) {
      this.channels[channelName] = new NgxLoadingStateChannel(channelName);
    }
    return this.channels[channelName];
  }

}
