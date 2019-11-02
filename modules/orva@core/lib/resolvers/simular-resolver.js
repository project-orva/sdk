import {determineFuncationalLabel} from '../../internal/helpers';

export default async (dictionaryApi, {
  words: exampleWords,
  tags: exampleTags,
}, {
    words: messageWords,
  }) => {
  let score = 0;

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

    console.log(topFL.meta.syns[0]);

    topFL.meta.syns[0].forEach((syn) => {
      if (messageWords.includes(syn)) {
        score += 90;
      }
    });
  }

  return score;
}
;
