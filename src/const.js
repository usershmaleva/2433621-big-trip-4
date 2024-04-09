const POINTS_COUNT = 5;
const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MAX_PRICE_VALUE = 200;
const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITIES = ['Paris', 'London', 'Chicago', 'Tokio', 'New York', 'Moscow', 'Amsterdam', 'San-Francisco'];
const DESCCRIPTIONS = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt architecto labore atque!',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem exercitationem culpa, molestias qui eveniet corrupti?',
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius, dolorem.',
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit ad eaque cupiditate praesentium maxime.',
];
const DATE_FORMATS = {
  time: 'HH:mm',
  shortDate: 'MMM DD',
  formDateTime: 'DD/MM/YY HH:mm'
};
const DURATION_FORMATS = {
  days: 'DD[D] HH[H] mm[M]',
  hours: 'HH[H] mm[M]',
  mins: 'mm[M]'
};

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

export {
  POINTS_COUNT,
  EVENT_TYPES,
  MAX_PRICE_VALUE,
  CITIES,
  DESCCRIPTIONS,
  DATE_FORMATS,
  MSEC_IN_HOUR,
  MSEC_IN_DAY,
  DURATION_FORMATS
};