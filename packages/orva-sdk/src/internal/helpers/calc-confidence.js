export default (values, maxScore) => {
  const sum = values.reduce((a, c) => a + c);
  const maxSum = values.length * maxScore;

  const difference = sum / maxSum;

  return {
    sum,
    confidence: difference,
  };
};
