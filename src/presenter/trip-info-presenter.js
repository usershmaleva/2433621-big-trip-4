import { SortType } from '../const.js';
import {
  render,
  replace,
  RenderPosition
} from '../framework/render.js';
import { sortByType } from '../utils.js';

import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#pointsModelEventHandler);
  }

  init() {
    this.#tripInfoComponent = new TripInfoView(this.#getTripInfoProps());
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);

  }

  #updateInfo() {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(this.#getTripInfoProps());

    if(!prevTripInfoComponent) {
      throw new Error('TripInfoPresenter: presenter not initialized!');
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);

  }

  #getTripInfoProps() {
    const points = this.#pointsModel.get();
    return {
      points: points ? sortByType[SortType.DAY](points) : [],
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      isLoading: !points,
    };
  }

  #pointsModelEventHandler = () => {
    this.#updateInfo();
  };
}
