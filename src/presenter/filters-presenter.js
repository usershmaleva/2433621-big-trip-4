import {
  render,
  replace
} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterSettings, UpdateType } from '../const.js';
import { filterByType } from '../utils';

export default class FiltersPresenter {
  #container = null;
  #pointsModel = null;
  #filtersModel = null;
  #filters = [];
  #filtersView = null;

  constructor({ container, pointsModel, filtersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#pointsModelEventHandler);
    this.#filtersModel.addObserver(this.#filtersModelEventHandler);
  }

  init() {
    this.#filters = this.#createFilters();
    this.#filtersView = this.#createView();
    render(this.#filtersView, this.#container);
  }

  #update() {
    if (!this.#filtersView) {
      return;
    }

    this.#filters = this.#updateFilters();
    const newFiltersView = this.#createView();

    replace(newFiltersView, this.#filtersView);
    this.#filtersView = newFiltersView;
  }

  #createFilters() {
    const points = this.#pointsModel.get();
    const currentFilter = this.#filtersModel.get();

    return Object.entries(filterByType)
      .map(([type, filter]) => ({
        ...FilterSettings[type],
        type,
        selected: currentFilter === type,
        disabled: points ? filter(points).length === 0 : true
      }));
  }

  #createView() {
    return new FiltersView({
      items: this.#filters,
      onFilterChange: this.#filtersChangeHandler,
    });
  }

  #updateFilters() {
    const points = this.#pointsModel.get();
    const currentFilter = this.#filtersModel.get();
    return this.#filters.map((filter) => ({
      ...filter,
      selected: currentFilter === filter.type,
      disabled: filterByType[filter.type](points).length === 0
    }));
  }

  #filtersChangeHandler = (filterType) => {
    this.#filtersModel.set(UpdateType.MAJOR, filterType);
  };

  #pointsModelEventHandler = () => {
    this.#update();
  };

  #filtersModelEventHandler = () => {
    this.#update();
  };
}
