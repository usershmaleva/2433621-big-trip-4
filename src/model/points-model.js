import Observable from '../framework/observable.js';
import { deleteItem, updateItem } from '../utils.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get() {
    return this.#points;
  }

  add(type, point) {
    this.#points.push(point);
    this._notify(type, point);
  }

  update(type, point) {
    this.#points = updateItem(this.#points, point);
    this._notify(type, point);
  }

  delete(type, point) {
    this.#points = deleteItem(this.#points, point);
    this._notify(type, point);
  }
}

