import grpc from 'grpc';
const protoloader = require('@grpc/proto-loader');

export interface ClientConfig {
  serviceUrl: string,
}

export const createClient = (config: ClientConfig): any => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
    __dirname + '../../api/skill-service.proto',
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  )) as { [id: string]: { [id: string]: any }};

  const GrpcInstance = protoDescriptor['grpcSkill']['grpcSkill'];

  return new GrpcInstance(
    config.serviceUrl,
    grpc.credentials.createInsecure(),
  );
};