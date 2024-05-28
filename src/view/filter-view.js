import AbstractView from '../framework/view/abstract-view';
import { capitalizeFirstLetter } from '../utils';

const createEventFilterTemplate = ({ type, name, count }, currentFilterType) =>
  `<div class="trip-filters__filter">\
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter" value="${name}"
        ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${name}">${capitalizeFirstLetter(name)}</label>\
    </div>`;

const createFilterTemplate = (items, currentFilterType) => {
  const events = items.reduce((result, filter) => result.concat(createEventFilterTemplate(filter, currentFilterType)),'');
  return `<form class="trip-filters" action="#" method="get">
    ${events}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters;
  #currentFilter;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setChangeHandler = (callback) => {
    this._callback.change = callback;
    this.element.addEventListener('change', this.#changeHandler);
  };

  #changeHandler = (e) => {
    e.preventDefault();
    this._callback.change(e.target.value);
  };
}
