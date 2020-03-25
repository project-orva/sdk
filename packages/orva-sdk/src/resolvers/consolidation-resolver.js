import { calcConfidence, consolidateTags } from '../internal/helpers';

const MAX_SCORE = 80;

export default ({ tags: exampleTags }, { tags: messageTags }) => {
  const conExampleTags = consolidateTags(exampleTags);
  const conMessageTags = consolidateTags(messageTags);

  const exampleKeys = Object.keys(conExampleTags);

  const scores = [];
  exampleKeys.forEach((key) => {
    if (!(key in conMessageTags)) {
      return;
    }
    const dist = conExampleTags[key] - conMessageTags[key]; // best case -> 0
    scores.push(MAX_SCORE >> Math.abs(dist));
  });

  return calcConfidence(scores, MAX_SCORE);
};

