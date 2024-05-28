import Observable from '../framework/observable';
import { UPDATE_TYPES } from '../const';
import dayjs from 'dayjs';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #offers = [];
  #destinations = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
      this.#offers = await this.#eventsApiService.offers;
      this.#destinations = await this.#eventsApiService.destinations;
    } catch (err) {
      this.#events = [];
      this.#offers = [];
      this.#destinations = [];
      this._notify(UPDATE_TYPES.ERROR);
      return;
    }
    this._notify(UPDATE_TYPES.INIT);
  };

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting point');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updated = this.#adaptToClient(response);

      this._notify(updateType, update);
      this.#events = [
        ...this.#events.slice(0, index),
        updated,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updated);
    } catch (err) {
      throw new Error('Can not update task');
    }
  };

  addEvent = async (updateType, update) => {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can not add event');
    }
  };

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting point');
    }

    this._notify(updateType);
    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can not delete event');
    }
  };

  #adaptToClient = (event) => {
    const adapted = {
      ...event,
      basePrice: event['base_price'],
      startDate: dayjs(event['date_from']),
      endDate: dayjs(event['date_to']),
      isFavorite: event['is_favorite'],
    };

    delete adapted['base_price'];
    delete adapted['date_from'];
    delete adapted['date_to'];
    delete adapted['is_favorite'];

    return adapted;
  };
}
