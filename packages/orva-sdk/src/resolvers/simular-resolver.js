import {
  determineFuncationalLabel,
  calcConfidence,
} from '../internal/helpers';

const MAX_SCORE = 90;

export default async (dictionaryApi, {
  words: exampleWords,
  tags: exampleTags,
}, {
    words: messageWords,
  }) => {
  const scores = [];

  for (let idx = 0; idx < exampleWords.length; idx++) {
    const unique = exampleWords[idx];

    // check to see if a synonym of the unique word is being used.
    const fl = determineFuncationalLabel(exampleTags, exampleWords, unique);
    const {data: wordData} = await dictionaryApi
        .getInfo(unique);

    const topFL = wordData.filter((w) => w.fl === fl)[0];
    if (topFL === undefined) {
      continue;
    }

    topFL.meta.syns[0].forEach((syn) => {
      if (messageWords.includes(syn)) {
        scores.push(MAX_SCORE);
      } else {
        scores.push(0);
      }
    });
  }

  return calcConfidence(scores);
};
