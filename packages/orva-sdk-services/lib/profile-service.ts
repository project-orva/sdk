import { generateGRPCClient } from './internal';

const PROTO_PATH = __dirname + '/api/profile-guide.proto';

export default class ProfileService {
  private grpcClient: any;

  constructor(url: string) {
    this.grpcClient = generateGRPCClient(PROTO_PATH, url, 'grpcProfile');
  }

  public async getUser(id: string) {
    return new Promise((resolve, reject) => {
      this.grpcClient.FindProfileByAccountID({
        ID: id,
      },
        (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
        });
    });
  }
}

