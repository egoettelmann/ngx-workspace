# NgxLoadingState

An Angular library that allows to handle loaders globally through a dedicated RxJS operator.
The library also provides a directive to display a spinner and a pipe to subscribe to the loading state.

## Background

Handling _loading states_ in Angular is crucial to improve the user experience of an application.
When a user has to wait for an ongoing asynchronous task to finish (most of the time API calls), it should be visible on the UI.
This can be done through loading indicators, but it is also important to prevent some user actions (like button clicks).

Most of the time, this is done through manually positioned flags on the component. An approach that can be quite verbose and error-prone.

### Proposed approach

This library proposes to handle the _loading states_ through global _channels_.
When executing an asynchronous task, it is possible to create a dedicated _channel_ that holds the current _loading state_.
Components can then register to this channel through, either a directive to display a loader, or a pipe to get the current state.


## Installation

```
npm install ngx-loading-state --save
```

## Usage

Import the `NgxLoadingStateModule` in your `AppModule`.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxLoadingStateModule } from 'ngx-loading-state';

@NgModule({
declarations: [
  AppComponent
],
imports: [
  BrowserModule,
  NgxLoadingStateModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
```

### Handling the loading state

The module provides an RxJS operator: `ngxLoadingState(channelName: string)`.
This operator will perform the following:
- on subscription, the provided channel will be marked as currently loading
- on completion (or on failure), the provided channel will be marked as no longer loading

Example:
```ts
import { ngxLoadingState } from 'ngx-loading-state';

public getDataFromApi(): Observable<any> {
    return this.httpClient.get<any>('/api/data').pipe(
        ngxLoadingState('my.channel.name')
    )
}
```

### Subscribing to a channel: `NgxLoadingStatePipe`

The module provides an Angular Pipe to subscribe to the current state of a channel.
This can be useful to display or not an element/component, or to disable/enable a button.

Example (remove an element while loading):
```html
<div *ngIf="true | ngxLoadingState:'my.channel.name'">
  <span>Will only be displayed if the channel is not loading</span>
</div>
```

Example 2 (disable a button while loading):
```html
<button (click)="saveMyData()"
        [disabled]="false | ngxLoadingState:'my.channel.name'"
>Can only be clicked if the channel is not loading</button>
```

The value provided to the pipe is the value to return when the channel is NOT loading.

### Displaying a loader: `NgxLoadingStateDirective`

The module provides an Angular Directive to display a loader as overlay on an element/component.
This can be used to indicate to the user that a background task is currently ongoing, but also to swallow any mouse events on the element/component.

Example:
```html
<div [ngxLoadingState]="'my.channel.name'">
  <span>Will be covered by a loader if the channel is loading</span>
  <button (click)="saveMyData()">Not triggered on click if channel is loading</button>
</div>
```
**Note**: ensure to still disable the button (e.g. with the pipe), as the button will remain active and can be triggered through keyboard events.

This directive depends on a provided stylesheet that can be included as follows:
 - either through your main `styles.scss` file (if you use sass): 
   ```scss
   @import '~ngx-loading-state/styles/scss/default';
   ```
 - or through your `angular.json` configuration (as a prebuilt CSS):
   ```json
   "styles": [
     "src/styles.scss",
     "~ngx-loading-state/styles/prebuilt/default.css"
   ],
   ```

#### Custom loader style

The `default` style of the loader is a black loading spinner, but it can be easily adapted.
Instead of directly importing the `default` stylesheet, you can use the SASS mixins:
```scss
@use '~ngx-loading-state/styles/scss' as ngx-loading-state;

@include ngx-loading-state.ngx-loading-state() {
  @include ngx-loading-state.ngx-loading-state-dots();
}
```
This will replace the spinner with three loading dots.

Additionally, each mixin supports following arguments:
- `ngx-loading-state`:
  - `$background-color`, the background color of the overlay (default: `#000000`)
  - `$background-opacity`, the opacity of the overlay (default: `0.5`)
- `ngx-loading-state-spinner`:
  - `$size`, the size of the spinner (default: `40px`)
  - `$width`, the width of the spinner (default: `5px`),
  - `$color`, the color of the spinner (default: `#FFFFFF`)
  - `$spin-duration`, the duration of one spin cycle (default: `1s`)
- `ngx-loading-state-dots`:
  - `$size`, the size of each dot (default: `16px`)
  - `$space`, the space between each dot (default: `32px`)
  - `$color-primary`, the primary color of each dot (default: `#FFFFFF`)
  - `$color-secondary`, the secondary color of each dot (default: `#FFF2`)
  - `$transition-duration`, the duration of the transition between dots (default: `0.5s`)

You can further adapt it by specifying your custom style:
```scss
@use '~ngx-loading-state/styles/scss' as ngx-loading-state;

@include ngx-loading-state.ngx-loading-state($background-color: lightblue) {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #FFF;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
```
Have a look on following link for some nice ideas: <https://cssloaders.github.io/>

If you need even more advanced customization, you can redefine following CSS classes:
- `.ngx-loading-state`, class appended to the component
- `.ngx-loading-state--active`, class appended when the provided loading channel is active

Ensure to have a look at the `~ngx-loading-state/styles/scss/_commons.scss` file to see what is required.
Especially the `pointer-events: none;` to disable all clicks.

### Using the `NgxLoadingStateService`

Under the hood, the module provides a `NgxLoadingStateService` on the `root` scope.
This service can be injected in your services/components.
It provides following methods:

| Method                            | Description                                                                                                                                                                                                                    |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start(channelName: string)`      | Marks the provided `channelName` as loading.                                                                                                                                                                                   |
| `stop(channelName: string)`       | Notifies the end of an asynchronous task for the provided `channelName`.                                                                                                                                                       |
| `getChanges(channelName: string)` | Retrieves the Observable to subscribe to loading events of the provided `channelName`. The Observable will provide the current loading state changes (`true` for loading, `false` otherwise). The initial value being `false`. |

**Note**: a channel supports multiple (parallel) calls.
This means that calling `start` twice, requires two calls to `stop` so that the channel is considered as no longer loading.
All intermediate events will be forwarded to the `getChanges` Observable, meaning that you can receive successive `true` values.

**Note 2**: ensure that your channels are always properly stopped.
The `stop` method should be also called when your asynchronous tasks are failing.
A good practice is to call `stop` within the RxJS `finalize` operator.
