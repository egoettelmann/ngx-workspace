import { MonoTypeOperatorFunction, of, switchMap } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export function ngxLoadingState<T>(channelName: string): MonoTypeOperatorFunction<T> {
  return source$ => {
    // Retrieving the NgxLoadingService on subscription
    const ngxLoadingStateService = (ngxLoadingState as any).ngxLoadingStateService;
    if (ngxLoadingStateService == null) {
      throw new Error('NgxLoadingStateService not correctly initialized. Has it been provided in your AppModule ?');
    }

    return of(null).pipe(
      // Notifying loading start
      tap(() => ngxLoadingStateService.start(channelName)),
      // Switching back to source
      switchMap(() => source$),
      // Notifying loading stop on finalize
      finalize(() => ngxLoadingStateService.stop(channelName))
    );
  };
}

