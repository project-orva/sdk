export default (mapping) => ({
  words: mapping.map((m) => m.word),
  tags: mapping.map((m) => m.tag),
});
