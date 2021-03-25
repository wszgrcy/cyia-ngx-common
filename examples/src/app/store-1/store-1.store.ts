import { StoreBase, NgrxStore, NgrxAction } from 'cyia-ngx-common/store';
@NgrxStore()
export class Store1Store implements StoreBase {
  readonly initState: { sum: number } = {
    sum: 0,
  };
  state: { sum: number };
  @NgrxAction()
  ADD() {
    return { sum: this.state.sum + 1 };
  }

  @NgrxAction()
  RESET() {
    return { sum: 0 };
  }
}
