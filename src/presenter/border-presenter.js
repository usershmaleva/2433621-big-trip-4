import {
    render
  } from '../render.js';
  import EventListView from '../view/events-list.js';
  import EventItemView from '../view/item.js';
  import PointEditorView from '../view/editor-view.js';
  import SortingView from '../view/sort.js';
  
  export default class PointsPresenter {
    listComponent = new EventListView();
    sortingComponent = new SortingView();
  
    constructor({
      tripEventsContainer,
      pointsModel,
      offersModel,
      destinationsModel
    }) {
      this.tripEventsContainer = tripEventsContainer;
      this.pointsModel = pointsModel;
      this.offersModel = offersModel;
      this.destinationsModel = destinationsModel;
    }
  
    init() {
      this.eventPoints = [...this.pointsModel.getEventPoints()];
  
      render(this.sortingComponent, this.tripEventsContainer);
      render(this.listComponent, this.tripEventsContainer);
      render(new PointEditorView(), this.listComponent.getElement());
  
      for (let i = 0; i < this.eventPoints.length; i++) {
        const offers = this.offersModel.getByType(this.eventPoints[i].type);
        const destination = this.destinationsModel.getById(this.eventPoints[i].destination);
        render(new EventItemView({
          eventPoint: this.eventPoints[i],
          offers,
          destination
        }), this.listComponent.getElement());
      }
    }
  }