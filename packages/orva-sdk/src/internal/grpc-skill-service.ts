import grpc from 'grpc';
import protoloader from '@grpc/proto-loader';

export interface ClientConfig {
  protoPath: string,
  serviceUrl: string,
  serviceName: string,
}

export const createClient = (config: ClientConfig): any => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
    config.protoPath,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  )) as { [id: string]: { [id: string]: any }};

  const { serviceName } = config;
  const GrpcInstance = protoDescriptor[serviceName][serviceName];

  return new GrpcInstance(
    config.serviceUrl,
    grpc.credentials.createInsecure(),
  );
};


export const registerSkill = async (
  client: any,
  args: any,
) => await new Promise((
  res,
  rej,
) => {
  client.RegisterSkill(args,
    (err: any, resp: any) => (err) ? rej(err) : res(resp))
})