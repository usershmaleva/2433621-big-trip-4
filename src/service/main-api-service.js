import ApiService from '../framework/api-service.js';
import {
  Endpoint,
  API_HOST,
  AUTH_TOKEN,
} from '../const.js';

export default class MainApiService extends ApiService {
  _defaultHeaders = new Headers({'Content-Type': 'application/json'});

  constructor() {
    super(API_HOST, AUTH_TOKEN);
  }

  get points() {
    return this._load({url: Endpoint.POINTS})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: Endpoint.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: Endpoint.OFFERS})
      .then(ApiService.parseResponse);
  }
}
