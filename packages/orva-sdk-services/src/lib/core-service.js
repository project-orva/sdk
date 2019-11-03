import {generateGRPCClient} from '../internal';

const PROTO_PATH = __dirname + '/../api/core-guide.proto';

/**
 * CoreHandler
 * Resolves/ Interacts with the core orva grpc service.
 */
export default class CoreHandler {
  /**
   * @param {string} url of the profile service
   */
  constructor(url) {
    this._grpcClient = generateGRPCClient(PROTO_PATH, url, 'grpcCore');
  }

  /**
   * processStatement
   * @param {object} args statement args
   * @param {string} args.userID userID making the request
   * @param {string} args.deviceID deviceID making the request
   * @param {string} args.message requested statement
   */
  async processStatement(args) {
    const r = {
      UserID: args.userID,
      DeviceID: args.deviceID,
      Message: args.Message,
    };

    return await new Promise((resolve, reject) => {
      this._grpcClient.ProcessStatement(r, (err, res) => { // eslint-disable-line new-cap
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}
