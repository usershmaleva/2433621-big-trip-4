import AbstractView from '../framework/view/abstract-view.js';

function createSortingItemTemplate(column, selectedSortType) {
  const { type, label, active, defaultSelected } = column;
  const isChecked = selectedSortType === type || defaultSelected;
  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${!active ? 'disabled' : ''} ${isChecked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>`;
}

function createSortingTemplate(items, selectedSortType) {
  return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${items.map((el) => createSortingItemTemplate(el, selectedSortType)).join('')}
  </form>`;
}

export default class SortingView extends AbstractView {
  #items = [];
  #selectedSortType = null;
  #onSortChange = null;

  constructor({
    items,
    selectedSortType,
    onSortChange
  }) {
    super();

    this.#items = items;
    this.#selectedSortType = selectedSortType;
    this.#onSortChange = onSortChange;
    this.element.addEventListener('change', this.#sortingChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#items, this.#selectedSortType);
  }

  #sortingChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onSortChange(evt.target.value);
  };
}
