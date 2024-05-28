import { render, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view';
import { sortByDate } from '../utils';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#modelEventHandler);
  }

  get events() {
    return this.#eventsModel.events.sort(sortByDate);
  }

  get offers() {
    return this.#eventsModel.offers;
  }

  get destinations() {
    return this.#eventsModel.destinations;
  }

  init = () => {
    if (this.#tripInfoComponent instanceof TripInfoView) {
      remove(this.#tripInfoComponent);
    }
    if (this.events.length) {
      this.#tripInfoComponent = new TripInfoView(
        this.events,
        this.offers,
        this.destinations
      );
      render(
        this.#tripInfoComponent,
        this.#tripInfoContainer,
        RenderPosition.AFTERBEGIN
      );
    }
  };

  destroy = () => {
    if (!this.#tripInfoComponent) {
      return;
    }

    remove(this.#tripInfoComponent);
    this.#tripInfoComponent = null;
  };

  #modelEventHandler = () => {
    this.init();
  };
}
