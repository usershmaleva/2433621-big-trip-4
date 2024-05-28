import AbstractView from '../framework/view/abstract-view';

const createMenuTemplate = () =>
  '<nav class="trip-controls__trip-tabs trip-tabs">\
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>\
    <a class="trip-tabs__btn" href="#">Stats</a>\
  </nav>';

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }
}
