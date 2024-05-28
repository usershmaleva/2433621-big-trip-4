import AbstractView from '../framework/view/abstract-view';

const createNoPointTemplate = () =>
  '<p class="trip-events__msg">Loading...</p>';

export default class LoaderView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
