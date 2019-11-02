import axios from 'axios';

const API_URL = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json';

/**
 * DictionaryApi
 */
export default class DictionaryApi {
/**
 * constructor
 * @param {*} apiKey
 */
  constructor(apiKey) {
    this.key = apiKey;
  }

  /**
   * getInfo
   * get information of a word given a word
   * @param {*} word
   */
  async getInfo(word) {
    return await axios.get(`${API_URL}/${word}?key=${this.key}`);
  }
}
