import AbstractView from '../framework/view/abstract-view.js';
import {
  getRouteLabel,
  getDurationPeriod,
  getTotalPointsCost,
} from '../utils.js';

const createTripInfoDummyTemplate = (isLoading) => `
<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${isLoading ? 'Loading...' : 'No points'}</h1>
      <p class="trip-info__dates">${isLoading ? 'Loading...' : 'Not selected'}</p>
    </div>

    <p class="trip-info__cost">
      ${isLoading ? 'Loading...' : 'Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>'}
    </p>
  </section>`;

const createTripInfoTemplate = ({isEmpty, isLoading, routeLabel, periodLabel, cost}) => isEmpty
  ? createTripInfoDummyTemplate(isLoading)
  : `<section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${routeLabel}</h1>
      <p class="trip-info__dates">${periodLabel}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView {
  #points = [];
  #destinations = null;
  #offers = null;
  #isLoading = false;

  constructor({
    destinations,
    offers,
    points,
    isLoading,
  }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isLoading = isLoading;
  }

  get template() {
    const isEmpty = this.#points.length === 0;
    return createTripInfoTemplate({
      isEmpty,
      isLoading: this.#isLoading,
      routeLabel: isEmpty ? null : getRouteLabel(this.#points, this.#destinations),
      periodLabel: isEmpty ? null : getDurationPeriod(this.#points),
      cost: isEmpty ? null : getTotalPointsCost(this.#points, this.#offers),
    });
  }
}
