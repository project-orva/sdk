export default ({words: exampleWords}, {words: messageWords}) => {
  let score = 0;
  exampleWords.forEach((word, idx) => {
    if (messageWords.includes(word)) {
      score += 100 >> Math.abs(idx - messageWords.indexOf(word));
    }
  });

  return score;
};
