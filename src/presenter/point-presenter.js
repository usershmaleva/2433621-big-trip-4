import { remove, render, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { EditType, PointMode, UserAction } from '../const.js';

export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #pointEditorComponent = null;
  #point = null;
  #onUserAction = null;
  #onEditorOpen = null;
  #destinationsModel = null;
  #offersModel = null;
  #mode = PointMode.IDLE;

  constructor({
    container,
    destinationsModel,
    offersModel,
    onUserAction,
    onEditorOpen,
  }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onUserAction = onUserAction;
    this.#onEditorOpen = onEditorOpen;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = this.#createPointView();

    this.#pointEditorComponent = this.#createPointEditorView();

    if (this.#mode === PointMode.EDITABLE) {
      render(this.#pointEditorComponent, this.#container);
      return;
    }

    render(this.#pointComponent, this.#container);
  }

  update(point) {
    this.#point = point;

    const updatedPointComponent = this.#createPointView();

    const updatedEditorComponent = this.#createPointEditorView();

    if (this.#mode === PointMode.EDITABLE) {
      replace(updatedEditorComponent, this.#pointEditorComponent);
    } else {
      replace(updatedPointComponent, this.#pointComponent);
    }

    this.#pointComponent = updatedPointComponent;
    this.#pointEditorComponent = updatedEditorComponent;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditorComponent);
  }

  resetView() {
    if (this.#mode !== PointMode.IDLE) {
      this.#replaceEditorByPoint();
    }
  }

  triggerError() {
    if(this.#mode !== PointMode.EDITABLE) {
      this.#pointComponent.shake();
      return;
    }

    this.#pointEditorComponent.shake(() => {
      this.#pointEditorComponent.setDeleting(false);
      this.#pointEditorComponent.setUpdating(false);
    });
  }

  #createPointView() {
    return new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getById(this.#point.destination),
      offers: this.#offersModel.getByType(this.#point.type),
      onEditClick: this.#pointEditHandler,
      onFavoriteToggle: this.#pointFavoriteToggleHandler,
    });
  }

  #createPointEditorView() {
    return new PointEditorView({
      point: this.#point,
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      onCloseClick: this.#pointCloseHandler,
      onDeleteClick: this.#pointDeleteHandler,
      onSubmitForm: this.#pointSubmitHandler,
      mode: EditType.EDITING,
    });
  }

  #replacePointByEditor() {
    replace(this.#pointEditorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.EDITABLE;
  }

  #replaceEditorByPoint() {
    replace(this.#pointComponent, this.#pointEditorComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.IDLE;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditorByPoint();
    }
  };

  #pointEditHandler = () => {
    this.#onEditorOpen();
    this.#replacePointByEditor();
  };

  #pointSubmitHandler = (point) => {
    this.#pointEditorComponent.setUpdating(true);
    this.#onUserAction(UserAction.UPDATE_POINT, point);
  };

  #pointDeleteHandler = (point) => {
    this.#pointEditorComponent.setDeleting(true);
    this.#onUserAction(UserAction.DELETE_POINT, point);
  };

  #pointCloseHandler = () => {
    this.#replaceEditorByPoint();
  };

  #pointFavoriteToggleHandler = (isFavorite) => {
    this.#onUserAction(UserAction.UPDATE_POINT, { ...this.#point, isFavorite });
  };
}
