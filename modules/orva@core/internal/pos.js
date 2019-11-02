import pos from 'pos';

export const createTagged = (text) => {
  const words = new pos.Lexer().lex(text);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
};

export const createPOSMapping = (text) => {
  const ommited = ['CD', 'VBZ', 'PRP$'];

  const tagged = createTagged(text);

  const uniquePOS = [];
  for (const i in tagged) {
    if (Object.prototype.hasOwnProperty.call(tagged, i)) {
      const taggedWord = tagged[i];
      const word = taggedWord[0];
      const tag = taggedWord[1];

      if (!ommited.includes(tag)) {
        uniquePOS.push({word, tag});
      }
    }
  }

  return uniquePOS;
}
;
