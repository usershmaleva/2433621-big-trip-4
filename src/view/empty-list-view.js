import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../const.js';

const TEXT_TYPE = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
  [FILTER_TYPES.PAST]: 'There are no past events now',
};

const createEmptyListTemplate = (filterType) =>
  `<p class="trip-events__msg">${TEXT_TYPE[filterType]}</p>`;

export default class EmptyListView extends AbstractView {
  #filterType;
  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
