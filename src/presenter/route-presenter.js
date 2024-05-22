import {
  remove,
  render,
} from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import EventsListEmptyView from '../view/events-list-empty-view.js';
import { SORTING_COLUMNS, SortType, UpdateType } from '../const.js';
import PointPresenter from './point-presenter.js';
import { filterByType, sortByType } from '../utils.js';
import SortingView from '../view/sorting-view.js';
import LoaderView from '../view/loader-view.js';


export default class RoutePresenter {
  #container = null;
  #createPointPresenter = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersModel = null;
  #currentSortType = SortType.DAY;
  #loaderComponent = new LoaderView();
  #listComponent = new EventsListView();
  #sortingComponent = null;
  #pointsPresenters = new Map();
  #isLoading = true;
  #isError = false;

  constructor({
    container,
    createPointPresenter,
    pointsModel,
    offersModel,
    destinationsModel,
    filtersModel,
  }) {
    this.#container = container;
    this.#createPointPresenter = createPointPresenter;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#pointsModelEventHandler);
    this.#filtersModel.addObserver(this.#filterModelEventHandler);
  }

  get points() {
    const points = this.#pointsModel.get();
    const filterType = this.#filtersModel.get();
    const filteredPoints = filterByType[filterType](points);

    return sortByType[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#createPointPresenter.init();
    this.#renderRoute();
  }

  destroy() {
    remove(this.#sortingComponent);
    remove(this.#listComponent);
    this.#clearRoute();
  }

  #renderLoader() {
    render(this.#loaderComponent, this.#container);
  }

  #renderStub() {
    render(new EventsListEmptyView(), this.#container);
  }

  #renderSort() {
    this.#sortingComponent = new SortingView({
      items: SORTING_COLUMNS,
      selectedSortType: this.#currentSortType,
      onSortChange: this.#sortChangeHandler,
    });

    render(this.#sortingComponent, this.#container);
  }

  #renderRoute() {
    if (this.#isLoading) {
      this.#createPointPresenter.setButtonDisabled(true);
      this.#renderLoader();
      return;
    }

    this.#createPointPresenter.setButtonDisabled(false);
    if (!this.points.length) {
      this.#renderStub();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #renderPoints() {
    render(this.#listComponent, this.#container);

    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearRoute() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortingComponent);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#pointChangeHandler,
      onPointDelete: this.#pointDeleteHandler,
      onEditorOpen: this.#pointEditHandler,
    });

    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #pointEditHandler = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#pointsModel.update(UpdateType.MINOR, updatedPoint);
  };

  #pointDeleteHandler = (deletedPoint) => {
    this.#pointsModel.delete(UpdateType.MAJOR, deletedPoint);
  };

  #sortChangeHandler = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearRoute();
    this.#renderRoute();
  };

  #pointsModelEventHandler = (type, data) => {
    switch (type) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isError = !!data.error;
        remove(this.#loaderComponent);
        this.#renderRoute();
        break;

      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id)?.init(data);
        break;

      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      default:
        this.#clearRoute();
        this.#renderRoute();
        break;
    }
  };

  #filterModelEventHandler = (type) => {
    switch (type) {
      case UpdateType.INIT:
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      default:
        this.#clearRoute();
        this.#renderRoute();
        break;
    }
  };
}
