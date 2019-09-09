import {isShapeValid} from './helpers/is_shape_valid';

export const apiShape = [
  'get', 'set',
];

/**
 * Store
 */
class Store {
  /**
  * constructor
  * @param {Object} service inverse depency for the api.
  */
  constructor(service) {
    if (isShapeValid(api, apiShape) ) {
      throw new Error('Error: Store: Invalid API Inversion');
    }

    this.service = service;
  }

  /**
   * Get item from the store
   * @param {String} userID ID of the user using the skill.
   * @param {String} processID ID of the process that is reading from the store.
   */
  async Get(userID, processID) {
    return await this.service.get(userID, processID);
  }

  /**
   * Set item to the store.
   * @param {String} userID ID of the user using the skill.
   * @param {String} processID ID of the process that is reading from the store.
   * @param {Object} data data being set to the store.
   */
  async Set(userID, processID, data) {
    return await this.api.set(userID, processID, data);
  }
}

export default Store;
