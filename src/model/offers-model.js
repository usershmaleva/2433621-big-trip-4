import Observable from '../framework/observable.js';
import { deleteItem, updateItem } from '../utils.js';

export default class OffersModel extends Observable {
  #service = null;
  #offers = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#offers = this.#service.offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offers) => offers.type === type.toLowerCase()).offers;
  }

  add(type, offer) {
    this.#offers.push(offer);
    this._notify(type, offer);
  }

  update(type, offer) {
    this.#offers = updateItem(this.#offers, offer);
    this._notify(type, offer);
  }

  delete(type, offer) {
    this.#offers = deleteItem(this.#offers, offer);
    this._notify(type, offer);
  }
}
