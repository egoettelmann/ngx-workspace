import { ReplaySubject } from 'rxjs';

export class NgxLoadingStateChannel {
  name: string;
  state?: number;
  changes: ReplaySubject<boolean>;

  constructor(name: string) {
    this.name = name;
    this.changes = new ReplaySubject<boolean>(1);
  }

  setLoading() {
    if (this.state == null) {
      this.state = 0;
    }
    this.state++;
    this.changes.next(true);
  }

  unsetLoading() {
    if (this.state == null) {
      this.state = 0;
    }
    if (this.state > 0) {
      this.state--;
    }
    this.changes.next(false);
  }

}
