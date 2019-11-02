export default async (
  resolvers,
  {
    exampleMapping,
    requestMapping,
  }
) => {
  const resolverResp = await Promise.all(resolvers
      .map(async (resolver) => await resolver(
          exampleMapping,
          requestMapping),
      ));

  return await resolverResp.reduce((a, c) => c + a);
};
