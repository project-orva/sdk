export default async (
  operations,
) => await operations.sort((first, second) => {
  return second.score - first.score;
})[0];
