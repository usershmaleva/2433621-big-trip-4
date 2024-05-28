import AbstractView from '../framework/view/abstract-view';
import { SORT_TYPES } from '../const.js';
import { capitalizeFirstLetter } from '../utils';

const sortTypes = [
  {
    name: 'day',
    type: SORT_TYPES.DEFAULT,
    isDisabled: false,
  },
  {
    name: 'event',
    type: '',
    isDisabled: true,
  },
  {
    name: 'time',
    type: SORT_TYPES.TIME,
    isDisabled: false,
  },
  {
    name: 'price',
    type: SORT_TYPES.PRICE,
    isDisabled: false,
  },
  {
    name: 'offers',
    type: '',
    isDisabled: true,
  },
];

const createTypeSortTemplate = (sortType) =>
  sortTypes
    .map(
      ({ name, type, isDisabled }) =>
        `<div class="trip-sort__item  trip-sort__item--${name}">
    <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio"
      name="trip-sort" value="sort-${name}" data-sort-type="${type}"
        ${sortType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${name}">${capitalizeFirstLetter(name)}</label>
  </div>`
    )
    .join('\n');

const createSortingTemplate = (sortType) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createTypeSortTemplate(sortType)}
  </form>`;

export default class SortingView extends AbstractView {
  #sortType;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    return createSortingTemplate(this.#sortType);
  }

  setSortHandler = (callback) => {
    this._callback.sort = callback;
    this.element.addEventListener('click', this.#sortHandler);
  };

  #sortHandler = (e) => {
    if (e.target.type !== 'radio') {
      return;
    }
    e.preventDefault();
    this._callback.sort(e.target.dataset.sortType);
  };
}
