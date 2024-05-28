import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FILTER_TYPES, TIME } from './const';

dayjs.extend(duration);

const convertEventDateForEditForm = (date) =>
  dayjs(date).format('DD/MM/YY HH:mm');
const convertEventDateIntoHour = (date) => dayjs(date).format('HH:mm');
const convertEventDateIntoDay = (date) => dayjs(date).format('MMM D');
const subtractDates = (dateFrom, dateTo) => {
  const diffInTotalMinutes = Math.ceil(
    dayjs(dateTo).diff(dayjs(dateFrom), 'minute', true)
  );
  const diffInHours =
    Math.floor(diffInTotalMinutes / TIME.MINUTES) % TIME.HOURS;
  const diffInDays = Math.floor(
    diffInTotalMinutes / (TIME.MINUTES * TIME.HOURS)
  );

  if (diffInDays === 0 && diffInHours === 0) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('mm[M]');
  } else if (diffInDays === 0) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('HH[H] mm[M]');
  }
  return dayjs
    .duration(diffInTotalMinutes, 'minutes')
    .format('DD[D] HH[H] mm[M]');
};

const isFavoriteOption = (isFavorite) =>
  isFavorite ? 'event__favorite-btn--active' : '';
const checkDatesRelativeToCurrent = (dateFrom, dateTo) =>
  dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs());
const isEventPlanned = (dateFrom, dateTo) =>
  dayjs(dateFrom).isAfter(dayjs()) ||
  checkDatesRelativeToCurrent(dateFrom, dateTo);
const isEventPassed = (dateFrom, dateTo) =>
  dayjs(dateTo).isBefore(dayjs()) ||
  checkDatesRelativeToCurrent(dateFrom, dateTo);
const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);
const isSubmitDisabledByDate = (dateTo, dateFrom) =>
  dayjs(dateTo).diff(dayjs(dateFrom)) <= 0;
const isSubmitDisabledByPrice = (price) =>
  Number(price) > 0 && Number.isInteger(Number(price));
const isSubmitDisabledByDestinationName = (name, allDestinations) => {
  const allDestinationNames = Array.from(allDestinations, (it) => it.name);
  return allDestinationNames.includes(name);
};

const filter = {
  [FILTER_TYPES.EVERYTHING]: (events) => events.map((event) => event),
  [FILTER_TYPES.FUTURE]: (events) =>
    events.filter((event) => isEventPlanned(event.startDate, event.endDate)),
  [FILTER_TYPES.PAST]: (events) =>
    events.filter((event) => isEventPassed(event.startDate, event.endDate)),
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;
const sortByDuration = (a, b) => {
  const durationA = Math.ceil(
    dayjs(a.endDate).diff(dayjs(a.startDate), 'minute', true)
  );
  const durationB = Math.ceil(
    dayjs(b.endDate).diff(dayjs(b.startDate), 'minute', true)
  );
  return durationB - durationA;
};
const sortByDate = (a, b) => dayjs(a.startDate) - dayjs(b.startDate);

export {
  convertEventDateIntoDay,
  convertEventDateIntoHour,
  convertEventDateForEditForm,
  subtractDates,
  isEventPlanned,
  isEventPassed,
  isSubmitDisabledByDate,
  isSubmitDisabledByPrice,
  isSubmitDisabledByDestinationName,
  isFavoriteOption,
  capitalizeFirstLetter,
  filter,
  sortByPrice,
  sortByDuration,
  sortByDate,
};
