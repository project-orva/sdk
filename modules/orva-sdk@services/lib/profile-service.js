const grpc = require('grpc');
const protoloader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/../api/profile-guide.proto';

const generateClient = (serviceURL) => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
      PROTO_PATH,
      {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
  ));

  const {grpcProfile: GrpcProfile} = protoDescriptor.grpcProfile;

  return new GrpcProfile(
      serviceURL,
      grpc.credentials.createInsecure()
  );
};

/**
 * ProfileService
 * Provides an api to interact with the profile service.
 */
export default class ProfileService {
  /**
   * @param {string} url of the profile service
   */
  constructor(url) {
    this._grpcClient = generateClient(url);
  }

  /**
   * getUser
   * @param {String} id id of the user being queried
   */
  async getUser(id) {
    return await new Promise((resolve, reject) => {
      // type 1 : Account Type as User
      client.FindProfileByAccountID({ID: id}, // eslint-disable-line new-cap
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
    });
  }
}

