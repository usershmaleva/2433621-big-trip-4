import ApiService from '../framework/api-service.js';
import {
  Endpoint,
  API_HOST,
  AUTH_TOKEN,
  HttpMethod,
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

  async createPoint(point) {
    const response = await this._load({
      url: Endpoint.POINTS,
      method: HttpMethod.POST,
      body: JSON.stringify(point),
      headers: this._defaultHeaders,
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${Endpoint.POINTS}/${point.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(point),
      headers: this._defaultHeaders,
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    await this._load({
      url: `${Endpoint.POINTS}/${point.id}`,
      method: HttpMethod.DELETE,
    });

    return Promise.resolve();
  }
}
