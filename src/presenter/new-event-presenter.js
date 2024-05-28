import { remove, render, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { USER_ACTIONS, UPDATE_TYPES } from '../const.js';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #changeData = null;
  #editComponent = null;
  #destroyCallback = null;
  #offers = null;
  #destinations = null;

  constructor(eventsListContainer, changeData) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destroyCallback = callback;

    if (this.#editComponent !== null) {
      return;
    }
    this.#editComponent = new EditFormView(
      undefined,
      this.#offers,
      this.#destinations
    );
    this.#editComponent.setSaveHandler(this.#saveHandler);
    this.#editComponent.setDeleteHandler(this.#deleteHandler);
    this.#editComponent.setRollDownHandler(this.#clickHandler);
    render(
      this.#editComponent,
      this.#eventsListContainer,
      RenderPosition.AFTERBEGIN
    );
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#editComponent);
    this.#editComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () =>
    this.#editComponent.updateElement({ isDisabled: true, isSaving: true });

  setAborting = () => {
    const resetFormState = () => {
      this.#editComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editComponent.shake(resetFormState);
  };

  #saveHandler = (event) =>
    this.#changeData(USER_ACTIONS.ADD, UPDATE_TYPES.MINOR, event);

  #deleteHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #clickHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.destroy();
    }
  };
}
