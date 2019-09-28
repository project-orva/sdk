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
   * @param {String} id of the object being searched for
   * @return {Object} object (if found) from the store.
   */
  getItem(id) {
    return this.store[id];
  }

  /**
   * setItem sets an item to the store
   * @param {*} id id of the object being set
   * @param {*} item item assigned to the id in the store
   */
  setItem(id, item) {
    this.store[id] = item;
  }
}


export default new Store();
