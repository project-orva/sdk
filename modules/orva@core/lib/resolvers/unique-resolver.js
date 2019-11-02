import {calcConfidence} from '../../internal/helpers';

export default ({words: exampleWords}, {words: messageWords}) => {
  const score = [];
  exampleWords.forEach((word, idx) => {
    if (messageWords.includes(word)) {
      score.push(100 >> Math.abs(
          idx - messageWords.indexOf(word)
      ));
    } else {
      score.push(0);
    }
  });

  return calcConfidence(score);
};
