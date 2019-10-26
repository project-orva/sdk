import pos from 'pos';

const createdTagged = (text) => {
  const words = new pos.Lexer().lex(text);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
};

export const consolidateTags = (text) => {
  const tagged = createdTagged(text);

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
};

/*
    PosType.WTF_TWO,
    PosType.VBP,
    PosType.WTF,
    PosType.DT,
    PosType.RB,
    PosType.IN,
    PosType.VBZ,
    PosType.TO,
    PosType.CC,
    PosType.VB,
    PosType.PRP,
    PosType.MD,
    PosType.VBD,
    PosType.PRPS
*/
export const extractUniquePOS = (text) => {
  const ommited = ['CD'];

  const tagged = createdTagged(text);

  const uniqueText = [];
  for (const i in tagged) {
    if (Object.prototype.hasOwnProperty.call(tagged, i)) {
      const taggedWord = tagged[i];
      const word = taggedWord[0];
      const tag = taggedWord[1];

      if (!ommited.includes(tag)) {
        uniqueText.push(word);
      }
    }
  }

  return uniqueText;
};

export const createPOSOrderedListFromTags = (text) => {
  const tagged = createdTagged(text);

  const ol = [];
  for (const i in tagged) {
    if (Object.prototype.hasOwnProperty.call(tagged, i)) {
      const taggedWord = tagged[i];
      const tag = taggedWord[1];

      ol.push(tag);
    }
  }

  return ol;
};
