import {createTagged} from '../internal/pos';

export const extractValues = (req) => {
  const tagged = createTagged(req.Message);

  const values = [];
  for (const i in tagged) {
    if (Object.prototype.hasOwnProperty.call(tagged, i)) {
      const taggedWord = tagged[i];
      const tag = taggedWord[1];

      if (tag === 'CD') {
        values.push(taggedWord[0]);
      }
    }
  }

  return values;
};
