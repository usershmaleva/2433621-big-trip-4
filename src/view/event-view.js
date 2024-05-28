import {
  convertEventDateIntoDay,
  convertEventDateIntoHour,
  subtractDates,
  isFavoriteOption,
  capitalizeFirstLetter,
} from '../utils.js';
import AbstractView from '../framework/view/abstract-view';

const createOffersListTemplate = (eventType, eventOffers, allOffers) => {
  const allOffersForType = allOffers.find(
    (item) => item.type === eventType
  ).offers;
  const selectedOffers = eventOffers.map((offer) =>
    allOffersForType.find((item) => item.id === offer)
  );

  return `<ul class="event__selected-offers">
            ${selectedOffers.map((offer) =>`<li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
            </li>`).join('\n')}
          </ul>`;
};

const createEventTemplate = (
  { basePrice, destination, startDate, endDate, isFavorite, offers, type },
  allOffers,
  allDestinations
) => {
  const name = allDestinations.find((item) => item.id === destination).name;

  return `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${convertEventDateIntoDay(startDate)}">${convertEventDateIntoDay(startDate)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${capitalizeFirstLetter(type)} ${name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${convertEventDateIntoHour(startDate)}">${convertEventDateIntoHour(startDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="${convertEventDateIntoHour(endDate)}">${convertEventDateIntoHour(endDate)}</time>
      </p>
      <p class="event__duration">${subtractDates(startDate, endDate)}</p>
    </div>
      &euro;&nbsp;<span class="event__price">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    ${offers ? createOffersListTemplate(type, offers, allOffers) : ''}
    <button class="event__favorite-btn ${isFavoriteOption(isFavorite)}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>\
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    </div>
  </li>`;
};

export default class EventView extends AbstractView {
  #event;
  #allOffers;
  #allDestinations;
  constructor(event, allOffers, allDestinations) {
    super();
    this.#event = event;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  get template() {
    return createEventTemplate(
      this.#event,
      this.#allOffers,
      this.#allDestinations
    );
  }

  setRollUpHandler = (callback) => {
    this._callback.rollUp = callback;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollUpHandler);
  };

  #rollUpHandler = (e) => {
    e.preventDefault();
    this._callback.rollUp();
  };

  setFavoriteHandler = (callback) => {
    this._callback.favorite = callback;
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (e) => {
    e.preventDefault();
    this._callback.favorite();
  };
}
