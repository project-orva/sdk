const consolidateTags = (tagged) => {
  const tags = {};
  for (const i in tagged) {
    if (Object.prototype.hasOwnProperty.call(tagged, i)) {
      const taggedWord = tagged[i];
      const tag = taggedWord[1];

      if (typeof tags[tag] === 'undefined') {
        tags[tag] = 0;
      }

      tags[tag] += 1;
    }
  }

  return tags;
}; // dis should go in a helper.

export default ({tags: exampleTags}, {tags: messageTags}) => {
  const conExampleTags = consolidateTags(exampleTags);
  const conMessageTags = consolidateTags(messageTags);

  const exampleKeys = Object.keys(conExampleTags);

  let score = 0;
  exampleKeys.forEach((key) => {
    if (!(key in conMessageTags)) {
      return;
    }
    const dist = conExampleTags[key] - conMessageTags[key]; // best case -> 0
    score += 80 >> Math.abs(dist);
  });

  return score; // todo: score + confidence
};

