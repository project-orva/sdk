import {createPOSMapping} from '../internal/pos';

import HTTPServer from './web-server';
import ConsolidationResolver from '../lib/resolvers/consolidation-resolver';
import UniqueResolver from '../lib/resolvers/unique-resolver';

import {
  shrinkMapping,
  getAverage,
  selectHighestRankedOperation,
  scoreResolvers,
} from '../internal/helpers';

const defaultResponse = {
  Statement: '',
  AssignedFrom: '',
  GraphicURL: '',
  GraphicType: '',
  Error: '',
};

const defaultResovlers = [
  ConsolidationResolver,
  UniqueResolver,
];

/**
 * SkillHandler
 * handles the skill service management
 */
export class SkillHandler {
  /**
     * constructor
     * @param {*} server
     * @param {*} resolvers
     */
  constructor(server = HTTPServer, resolvers = defaultResovlers) {
    this.skills = [];
    this.server = server;
    this.resolvers = resolvers;
  }

  /**
   * _determineSkill
   * determines/ invokes a skill
   * @param {*} request
   * @param {*} errHandler
   * @return {Object} the response from the found operation
   */
  async _determineSkill(request, errHandler) {
    const requestMapping = shrinkMapping(
        createPOSMapping(request.Message)
    );

    try {
      const rankedOperations = await Promise.all(this.skills
          .map(async ({examples, handlerCB}) => {
            const scores = [];

            // calculate score for each of the examples
            for (let idx = 0; idx < examples.length; idx++) {
              const score = await scoreResolvers(this.resolvers, {
                exampleMapping: examples[idx].posMapping,
                requestMapping,
              });

              scores.push(...score);
            }

            return {
              score: getAverage(scores.map((x) => x.sum)),
              confidence: getAverage(scores.map((x) => x.confidence)),
              handlerCB,
            };
          }));

      // determine which of the examples best fit the input message
      // then use the handler that belongs to that set of examples

      const bestOperation = await selectHighestRankedOperation(
          rankedOperations
      );

      const handlerResponse = await bestOperation.handlerCB(
          request,
          errHandler
      );

      if (typeof handlerResponse === 'string') {
        return {
          ...defaultResponse,
          Score: JSON.stringify(await bestOperation.score),
          Statement: handlerResponse,
        };
      }
      return {
        ...defaultResponse,
        TypeOf: typeof handlerResponse,
        ...handlerResponse,
      };
    } catch (err) {
      throw err;
      return {
        ...defaultResponse,
        Error: err.message,
      };
    }
  }

  /**
   * Start
   * starts the skill handler server
   * @param {*} port
   */
  async start(port) {
    this.server(port, async (...args) => this._determineSkill(...args));
  }

  /**
   * HandleSkill
   * Registers a skill with the internal handler.
   * @param {*} examples
   * @param {*} handlerCB
   */
  async handleSkill(examples, handlerCB) {
    const updatedExamples = examples.map((example) => ({
      exampleText: example,
      posMapping: shrinkMapping(
          createPOSMapping(example)
      ),
    }));

    this.skills.push({
      examples: updatedExamples,
      handlerCB,
    });
  }
}

export default new SkillHandler();
