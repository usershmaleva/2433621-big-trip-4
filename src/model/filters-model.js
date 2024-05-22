import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FiltersModel extends Observable {
  #filter = FilterType.ANY;

  get() {
    return this.#filter;
  }

  set(updateType, update) {
    this.#filter = update;
    this._notify(updateType, update);
  }
}
