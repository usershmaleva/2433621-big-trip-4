import Observable from '../framework/observable.js';
import { deleteItem, updateItem } from '../utils.js';

export default class DestinationsModel extends Observable {
  #service = null;
  #destinations = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#destinations = this.#service.destinations;
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  add(type, destination) {
    this.#destinations.push(type, destination);
    this._notify(destination);
  }

  update(type, destination) {
    this.#destinations = updateItem(this.#destinations, destination);
    this._notify(type, destination);
  }

  delete(type, destination) {
    this.#destinations = deleteItem(this.#destinations, destination);
    this._notify(type, destination);
  }
}
