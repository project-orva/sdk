import {isShapeValid} from './helpers/is_shape_valid';

export const apiShape = [
  'get',
];


/**
 * Profile
 */
class Profile {
  /**
  * constructor
  * @param {Object} service inverse depency for the service.
  */
  constructor(service) {
    if (isShapeValid(service, apiShape) ) {
      throw new Error('Error: Profile: Invalid API Inversion');
    }

    this.service = service;
  }

  /**
   * Get a user given the userID
   * @param {String} userID id of the user profile being pulled.
   */
  Get(userID) {
    this.service.get(userID);
  }
}


export default Profile;
