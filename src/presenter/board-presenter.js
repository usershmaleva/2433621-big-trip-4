import {
    render
  } from '../render.js';
  import EventListView from '../view/events-list.js';
  import EventItemView from '../view/item.js';
  import PointEditorView from '../view/editor-view.js';
  import SortingView from '../view/sort.js';
  
  const POINTS_COUNT = 3;
  
  export default class PointsPresenter {
    listComponent = new EventListView();
    sortingComponent = new SortingView();
  
    constructor({
      tripEventsContainer
    }) {
      this.tripEventsContainer = tripEventsContainer;
    }
  
    init() {
      render(this.sortingComponent, this.tripEventsContainer);
      render(this.listComponent, this.tripEventsContainer);
      render(new PointEditorView(), this.listComponent.getElement());
  
      for (let i = 0; i < POINTS_COUNT; i++) {
        render(new EventItemView(), this.listComponent.getElement());
      }
    }
  }