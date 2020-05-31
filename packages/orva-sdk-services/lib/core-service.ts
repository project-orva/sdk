import { generateGRPCClient } from './internal';

const PROTO_PATH = __dirname + '/api/core-guide.proto';

export interface ProcessStatementArg {
  userId: string,
  deviceId: string,
  message: string,
}

export default class CoreHandler {
  private grpcClient: any;

  constructor(url: string) {
    this.grpcClient = generateGRPCClient(PROTO_PATH, url, 'grpcCore');
  }

  public async processStatement(args: ProcessStatementArg) {
    return new Promise((resolve, reject) => {
      this.grpcClient.ProcessStatement(
        {
          UserID: args.userId,
          DeviceID: args.deviceId,
          Message: args.message,
        },
        (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
        });
    });
  }
}
