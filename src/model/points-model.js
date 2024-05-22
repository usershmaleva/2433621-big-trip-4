import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import { deleteItem, mapApiDataToPoint, mapPointToApiData, updateItem } from '../utils.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor(service) {
    super();
    this.#service = service;
  }

  async init() {
    try {
      const response = await this.#service.points;
      const points = response.map(mapApiDataToPoint);
      this.#points = points;
      this._notify(UpdateType.INIT, { response: points });

    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT, { error: err });
    }
  }

  get() {
    return this.#points;
  }

  async create(type, point) {
    try {
      const response = await this.#service.createPoint(mapPointToApiData(point));
      const createdPoint = mapApiDataToPoint(response);
      this.#points.push(createdPoint);
      this._notify(type, createdPoint);
    } catch(error) {
      this._notify(type, { error });
      throw new Error(`PointsModel - failed to create point: ${error}`);
    }
  }

  async update(type, point) {
    try {
      const response = await this.#service.updatePoint(mapPointToApiData(point));
      const updatedPoint = mapApiDataToPoint(response);
      this.#points = updateItem(this.#points, updatedPoint);
      this._notify(type, updatedPoint);
    } catch(error) {
      this._notify(type, { error });
      throw new Error(`PointsModel - failed to update point: ${error}`);
    }
  }

  async delete(type, point) {
    try {
      await this.#service.deletePoint(point);
      this.#points = deleteItem(this.#points, point);
      this._notify(type);
    } catch(error) {
      this._notify(type, { error });
      throw new Error(`PointsModel - failed to delete point: ${error}`);
    }
  }
}

