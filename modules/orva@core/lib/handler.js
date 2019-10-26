import HTTPServer from '../internal/web-server';

/**
 * SkillHandler
 * handles the skill service management
 */
export class SkillHandler {
  /**
     * constructor
     * @param {*} server
     */
  constructor(server = HTTPServer) {
    this.skills = [];
    this.server = server;
  }

  /**
   * _determineSkill
   * determines/ invokes a skill
   * @param {*} request
   * @param {*} errHandler
   * @return {Object} the response from the found operation
   */
  _determineSkill(request, errHandler) {
    return this.skills[0].handlerCB(request, errHandler);
  }

  /**
   * Start
   * starts the skill handler server
   * @param {*} port
   */
  start(port) {
    this.server(port, (...args) => this._determineSkill(...args));
  }

  /**
   * HandleSkill
   * Registers a skill with the internal handler.
   * @param {*} examples
   * @param {*} handlerCB
   */
  handleSkill(examples, handlerCB) {
    this.skills.push({examples, handlerCB});
  }
}


export default new SkillHandler();
