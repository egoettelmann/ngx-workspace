import { BehaviorSubject, Subject } from 'rxjs';

export class NgxLoadingStateChannel {
  name: string;
  state?: number;
  changes: Subject<boolean>;

  constructor(name: string) {
    this.name = name;
    this.changes = new BehaviorSubject<boolean>(false);
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
