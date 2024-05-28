import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { NEW_POINT } from '../const';
import {
  convertEventDateForEditForm,
  capitalizeFirstLetter,
  isSubmitDisabledByDate,
  isSubmitDisabledByPrice,
  isSubmitDisabledByDestinationName,
} from '../utils';
import dayjs from 'dayjs';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const getSelectedDestinationData = (destinationName, allDestinations) => {
  const selectedDestinationData = allDestinations.find(
    ({ name }) => name === destinationName
  );
  if (!selectedDestinationData) {
    return {
      name: destinationName,
      description: '',
      pictures: [],
    };
  }
  return selectedDestinationData;
};

const findOffersForType = (eventType, allOffers) =>
  allOffers.find(({ type }) => type === eventType).offers;

const createTypeListTemplate = (allOffers, currentType) =>
  allOffers
    .map(
      ({ type }) =>
        `<div class="event__type-item">
      <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio"
        name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}"> ${capitalizeFirstLetter(type)}</label>
    </div>`
    )
    .join('\n');

const createDestinationsOptionsTemplate = (destinations) =>
  destinations.reduce((result, { name }) => result.concat(`<option value="${name}"></option>\n`),'');

const createAvailableOptionsTemplate = (eventOffers, allOffersForType) =>
  allOffersForType.reduce((result, offer) => result.concat(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-${offer.id}" type="checkbox" name="event-offer-${offer.title.split(' ').pop()}"  ${eventOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-${offer.id}"><span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`),'');

const createPicturesListTemplate = (pictures) =>
  `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.reduce((result, picture) =>result.concat(`<img class="event__photo" src="${picture.src}" alt="Event photo">`),'')}</div>
   </div>`;

const createEditFormTemplate = (
  {
    id,
    selectedDestinationName,
    type,
    basePrice,
    startDate,
    endDate,
    offers,
    isDisabled,
    isSaving,
    isDeleting,
  },
  allOffers,
  allDestinations
) => {
  const selectedDestinationData = getSelectedDestinationData(
    selectedDestinationName,
    allDestinations
  );
  const allOffersForType = findOffersForType(type, allOffers);
  const deleting = isDeleting ? 'Deleting...' : 'Delete';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeListTemplate(allOffers, type)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">${capitalizeFirstLetter(type)}</label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(selectedDestinationName)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">${createDestinationsOptionsTemplate(allDestinations)}</datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${convertEventDateForEditForm(startDate)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${convertEventDateForEditForm(endDate)}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
            value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit"
          ${isSubmitDisabledByDate(startDate, endDate) ? '' : 'disabled'}
          ${isSubmitDisabledByPrice(basePrice) ? '' : 'disabled'}
          ${isSubmitDisabledByDestinationName(selectedDestinationName, allDestinations)? '': 'disabled'}>
          ${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">
        ${id ? deleting : 'Cancel'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers"
          ${!allOffersForType.length ? 'visually-hidden' : ''}>
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${createAvailableOptionsTemplate(offers, allOffersForType)}
          </div>
        </section>
        <section class="event__section  event__section--destination
        ${selectedDestinationData.description ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${selectedDestinationData.description}</p>
          ${selectedDestinationData.pictures? createPicturesListTemplate(selectedDestinationData.pictures): ''}
        </section>
      </section>
      </form>
    </li>`;
};

export default class EditFormView extends AbstractStatefulView {
  #allOffers;
  #allDestinations;
  #startDatepicker;
  #stopDatepicker;

  constructor(event = NEW_POINT, allOffers, allDestinations) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this._state = EditFormView.parseEvent(
      event,
      this.#allOffers,
      this.#allDestinations
    );
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setStopDatepicker();
  }

  get template() {
    return createEditFormTemplate(
      this._state,
      this.#allOffers,
      this.#allDestinations
    );
  }

  removeElement = () => {
    super.removeElement();
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#stopDatepicker) {
      this.#stopDatepicker.destroy();
      this.#stopDatepicker = null;
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSaveHandler(this._callback.save);
    this.setRollDownHandler(this._callback.rollDown);
    this.#setStartDatepicker();
    this.#setStopDatepicker();
    this.setDeleteHandler(this._callback.delete);
  };

  reset = (event, allOffers, allDestinations) =>
    this.updateElement(
      EditFormView.parseEvent(event, allOffers, allDestinations)
    );

  #setStartDatepicker = () => {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('[name = "event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        onChange: this.#startDateChangeHandler,
      }
    );
  };

  #startDateChangeHandler = ([userStartDate]) => {
    this.updateElement({
      startDate: dayjs(userStartDate),
    });
  };

  #setStopDatepicker = () => {
    const refDate = dayjs(this._state.startDate).subtract(1, 'days');
    this.#stopDatepicker = flatpickr(
      this.element.querySelector('[name = "event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        onChange: this.#endDateChangeHandler,
        disable: [
          function (date) {
            return date <= refDate;
          },
        ],
      }
    );
  };

  #endDateChangeHandler = ([userEndDate]) => {
    this.updateElement({
      endDate: dayjs(userEndDate),
    });
  };

  setRollDownHandler = (callback) => {
    this._callback.rollDown = callback;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollDownHandler);
  };

  #rollDownHandler = (e) => {
    e.preventDefault();
    this._callback.rollDown();
  };

  setSaveHandler = (callback) => {
    this._callback.save = callback;
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#saveHandler);
  };

  #saveHandler = (e) => {
    e.preventDefault();
    this._callback.save(
      EditFormView.parseState(this._state, this.#allDestinations)
    );
  };

  setDeleteHandler = (callback) => {
    this._callback.delete = callback;
    this.element
      .querySelector('form')
      .addEventListener('reset', this.#deleteHandler);
  };

  #deleteHandler = (e) => {
    e.preventDefault();
    this._callback.delete(
      EditFormView.parseState(this._state, this.#allDestinations)
    );
  };

  #destinationToggleHandler = (e) => {
    e.preventDefault();
    this.updateElement({
      selectedDestinationName: e.target.value,
    });
  };

  #typeToggleHandler = (e) => {
    if (!e.target.matches('input[name=event-type]')) {
      return;
    }
    const typeValue = e.target.value;
    e.preventDefault();
    this.updateElement({
      type: typeValue,
      offers: [],
      availableOffers: this.#allOffers.find((item) => item.type === typeValue)
        .offers,
    });
  };

  #offerToggleHandler = (e) => {
    e.preventDefault();
    const selectedOffers = [...this._state.offers];
    const clickedOfferId = parseInt(e.target.id.match(/\d+/), 10);

    if (e.target.checked) {
      selectedOffers.push(clickedOfferId);
    } else {
      selectedOffers.splice(selectedOffers.indexOf(clickedOfferId), 1);
    }
    this.updateElement({ offers: selectedOffers });
  };

  #setInnerHandlers = () => {
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationToggleHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#typeToggleHandler);
    this.element
      .querySelector('.event__available-offers')
      .addEventListener('change', this.#offerToggleHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceToggleHandler);
  };

  #priceToggleHandler = (e) => {
    e.preventDefault();
    this.updateElement({ basePrice: parseInt(e.target.value, 10) });
  };

  static parseEvent = (event, allOffers, allDestinations) => ({
    ...event,
    selectedDestinationName: allDestinations.find(
      (item) => item.id === event.destination
    ).name,
    availableOffers: allOffers.find((item) => item.type === event.type).offers,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseState = (state, allDestinations) => {
    const event = {
      ...state,
      destination: allDestinations.find(
        (item) => item.name === state.selectedDestinationName
      ).id,
    };
    delete event.selectedDestinationName;
    delete event.availableOffers;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  };
}
