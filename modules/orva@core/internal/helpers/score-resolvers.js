export default async (
  resolvers,
  {
    exampleMapping,
    requestMapping,
  }
) => await Promise.all(resolvers
    .map(async (resolver) => await resolver(
        exampleMapping,
        requestMapping),
    ));
