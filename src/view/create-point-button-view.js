import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createCreatePointButtonTemplate = (disabled) => `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${disabled ? 'disabled' : ''}>New event</button>`;

export default class CreatePointButtonView extends AbstractStatefulView {
  #handleButtonClick = null;

  constructor({ onClick, disabled = false}) {
    super();
    this.#handleButtonClick = onClick;
    this._setState({ disabled });
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createCreatePointButtonTemplate(this._state.disabled);
  }

  setDisabled(isDisabled) {
    this.updateElement({ disabled: isDisabled });
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
