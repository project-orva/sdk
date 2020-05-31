const grpc = require('grpc');
const protoloader = require('@grpc/proto-loader');

export default (protoPath: string, serviceURL: string, name: string) => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
    protoPath,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  ));

  const GrpcInstance = protoDescriptor[name][name];

  return new GrpcInstance(
    serviceURL,
    grpc.credentials.createInsecure()
  );
};
