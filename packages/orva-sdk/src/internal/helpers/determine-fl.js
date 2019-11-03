
const convertToFL = (tag) => ({
  [true || typeof tag !== 'string']: '',
  [tag.startsWith('NN')]: 'noun',
  [tag.startsWith('VB')]: 'verb',
  [tag.startsWith('JJ')]: 'adjective',
}).true;

/**
 * determineFL
 * determines the fl given the tag, statement & ordered tags.
 * @param {*} orderedTags
 * @param {string} statements
 * @param {string} word
 * @return {string}
 */
export default (orderedTags, statements, word) => convertToFL(
    orderedTags[statements.indexOf(word)]
);
