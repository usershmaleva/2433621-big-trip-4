import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EditFormView from '../view/edit-form-view';
import { USER_ACTIONS, UPDATE_TYPES } from '../const.js';


const MODE = {
  DEFAULT: 'default',
  EDITING: 'editing'
};

export default class EventPresenter {
  #eventsListContainer;
  #changeData;
  #switchMode;
  #eventComponent;
  #editComponent;
  #event;
  #offers = null;
  #destinations = null;
  #mode = MODE.DEFAULT;

  constructor(pointListContainer, changeData, switchMode) {
    this.#eventsListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#switchMode = switchMode;
  }

  init = (event, offers, destinations) => {
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;
    const previousEventComponent = this.#eventComponent;
    const previousEventEditComponent = this.#editComponent;
    this.#eventComponent = new EventView(this.#event, this.#offers, this.#destinations);
    this.#eventComponent.setRollUpHandler(this.#editClickHandler);
    this.#eventComponent.setFavoriteHandler(this.#favoriteClickHandler);
    this.#editComponent = new EditFormView(this.#event, this.#offers, this.#destinations);
    this.#editComponent.setRollDownHandler(this.#eventClickHandler);
    this.#editComponent.setSaveHandler(this.#saveHandler);
    this.#editComponent.setDeleteHandler(this.#deleteHandler);

    if (!previousEventComponent || !previousEventEditComponent) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#eventComponent, previousEventComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#editComponent, previousEventEditComponent);
      this.#mode = MODE.DEFAULT;
    }

    remove(previousEventComponent);
    remove(previousEventEditComponent);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#editComponent);
  };

  resetView = () => {
    if (this.#mode !== MODE.DEFAULT) {
      this.#editComponent.reset(this.#event, this.#offers, this.#destinations);
      this.#editToEvent();
    }
  };

  setSaving = () => {
    if (this.#mode === MODE.EDITING) {
      this.#editComponent.updateElement({ isDisabled: true, isSaving: true, });
    }
  };

  setDeleting = () => {
    if (this.#mode === MODE.EDITING) {
      this.#editComponent.updateElement({ isDisabled: true, isDeleting: true, });
    }
  };

  setAborting = () => {
    if (this.#mode === MODE.DEFAULT) {
      this.#editComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#editComponent.updateElement({ isDisabled: false, isSaving: false, isDeleting: false });
    };
    this.#editComponent.shake(resetFormState);
  };

  #eventToEdit = () => {
    replace(this.#editComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#switchMode();
    this.#mode = MODE.EDITING;
  };

  #editToEvent = () => {
    replace(this.#eventComponent, this.#editComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  };

  #escKeyDownHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.#editComponent.reset(this.#event, this.#offers, this.#destinations);
      this.#editToEvent();
    }
  };

  #favoriteClickHandler = () => this.#changeData(
    USER_ACTIONS.UPDATE,
    UPDATE_TYPES.MINOR,
    { ...this.#event, isFavorite: !this.#event.isFavorite }
  );

  #editClickHandler = () => this.#eventToEdit();

  #eventClickHandler = () => {
    if (this.#mode !== MODE.DEFAULT) {
      this.#editComponent.reset(this.#event, this.#offers, this.#destinations);
      this.#editToEvent();
    }
  };

  #saveHandler = (update) => {
    this.#changeData(USER_ACTIONS.UPDATE, UPDATE_TYPES.MINOR, update);
  };

  #deleteHandler = (event) => {
    this.#changeData(
      USER_ACTIONS.DELETE,
      UPDATE_TYPES.MINOR,
      event,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
