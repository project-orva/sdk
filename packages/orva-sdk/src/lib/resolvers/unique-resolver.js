import {calcConfidence} from '../internal/helpers';

const MAX_SCORE = 100;

export default ({words: exampleWords}, {words: messageWords}) => {
  const score = [];
  exampleWords.forEach((word, idx) => {
    if (messageWords.includes(word)) {
      score.push(MAX_SCORE >> Math.abs(
          idx - messageWords.indexOf(word)
      ));
    } else {
      score.push(0);
    }
  });

  return calcConfidence(score, MAX_SCORE);
};
