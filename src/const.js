import dayjs from 'dayjs';

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SORT_TYPES = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UPDATE_TYPES = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const TIME = {
  MINUTES: 60,
  HOURS: 24,
};

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const USER_ACTIONS = {
  UPDATE: 'UPDATE_POINT',
  ADD: 'ADD_POINT',
  DELETE: 'DELETE_POINT',
};

const NEW_POINT = {
  basePrice: 0,
  startDate: dayjs(),
  endDate: dayjs(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

export {
  TIME,
  FILTER_TYPES,
  SORT_TYPES,
  USER_ACTIONS,
  UPDATE_TYPES,
  NEW_POINT,
  TIME_LIMIT,
};
