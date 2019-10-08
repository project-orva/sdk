import {generateGRPCClient} from '../../orva@utils';

const PROTO_PATH = __dirname + '/../api/profile-guide.proto';

/**
 * ProfileService
 * Provides an api to interact with the profile service.
 */
export default class ProfileService {
  /**
   * @param {string} url of the profile service
   */
  constructor(url) {
    this._grpcClient = generateGRPCClient(PROTO_PATH, url, 'grpcProfile');
  }

  /**
   * getUser
   * @param {String} id id of the user being queried
   */
  async getUser(id) {
    return await new Promise((resolve, reject) => {
      this._grpcClient.FindProfileByAccountID({ID: id}, // eslint-disable-line new-cap
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
    });
  }
}

