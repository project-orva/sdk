/**
 * Store entity to represent the stored data within the skill
 */
class Store {
  /**
   * cons
   */
  constructor() {
    this.store = {};
  }

  /**
   * getItem fetches an item from the store
   * @param {string} user user of the current store.
   * @param {string} id of the object being searched for
   * @return {object} object (if found) from the store.
   */
  getItem(user, id) {
    return this.store[user][id];
  }

  /**
   * setItem sets an item to the store
   * @param {string} user user of the object & id
   * @param {string} id id of the object being set
   * @param {object} item item assigned to the id in the store
   */
  setItem(user, id, item) {
    this.store[user] = {...this.store[user], [id]: item};
  }

  /**
   * resets the store
   */
  reset() {
    this.store= {};
  }
}

export default new Store();
