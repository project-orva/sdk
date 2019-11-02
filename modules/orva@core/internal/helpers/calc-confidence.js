export default (values) => {
  const sum = values.reduce((a, c) => a + c);
  const mean = sum / values.length;
  const difs = values.map((value) => value - mean);
  const sqdif = difs.map((dif) => Math.pow(dif, 2));
  const sumOfDif = sqdif.reduce((a, c) => a + c);
  const variance = sumOfDif / values.length;
  const s = Math.sqrt(variance);

  return {
    sum,
    confidence: mean + 3.291 * s / Math.sqrt(values.length),
  };
};
