import AbstractView from '../framework/view/abstract-view';

const createErrorTemplate = () =>
  '<p class="trip-events__msg error">Oops, the server seems to be down.</p>';

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
