import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import { deleteItem, updateItem } from '../utils.js';

export default class DestinationsModel extends Observable {
  #service = null;
  #destinations = null;

  constructor(service) {
    super();
    this.#service = service;
  }

  async init() {
    try {
      const destinations = await this.#service.destinations;
      this.#destinations = destinations;
      this._notify(UpdateType.INIT, { data: destinations });

    } catch (err) {
      this.#destinations = [];
      this._notify(UpdateType.INIT, { error: err });
    }
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
