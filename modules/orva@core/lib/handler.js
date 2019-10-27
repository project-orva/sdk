import HTTPServer from '../internal/web-server';
import {consolidateTags, extractUniquePOS} from '../internal/pos';

// comparseConsolidation
// compare the amount of tag values within each dictionary.
const compareConsolidation = (first, second) => {
  const firstKeys = Object.keys(first);

  let score = 0;
  firstKeys.forEach((key) => {
    if (!(key in second)) {
      return;
    }
    const dist = first[key] - second[key]; // best case -> 0
    score += 80 >> Math.abs(dist);
  });

  return score;
};

// TODO: synomizer.

const compareUnique = (first, second) => {
  let score = 0;
  first.forEach((unique, fidx) => {
    if (second.includes(unique)) {
      score += 100 >> Math.abs(fidx - second.indexOf(unique));
    }
  });

  return score;
};

const defaultResponse = {
  Statement: '',
  AssignedFrom: '',
  GraphicURL: '',
  GraphicType: '',
  Error: '',
};

/**
 * SkillHandler
 * handles the skill service management
 */
export class SkillHandler {
  /**
     * constructor
     * @param {*} server
     * @param {*} determinationMethod
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
    // generate a score from each
    // return handler with highest score
    const rankedOperations = this.skills
        .map(({examples, handlerCB}) => {
          const scores = [];
          examples.forEach((example) => {
            const c1Score = compareConsolidation(
                consolidateTags(request.Message),
                example.consilatedTags
            );
            const c2Score = compareUnique(
                extractUniquePOS(request.Message),
                example.unique
            );

            scores.push(c2Score + c1Score);
          });

          return {score: scores.sort((f, s) => s - f)[0], handlerCB};
        });

    const bestOperation = rankedOperations.sort((first, second) => {
      return second.score - first.score;
    })[0];

    try {
      const handlerResponse = bestOperation.handlerCB(request, errHandler);
      if (typeof handlerResponse === 'string') {
        return {
          ...defaultResponse,
          Statement: handlerResponse,
        };
      }
      return {
        ...defaultResponse,
        ...handlerResponse,
      };
    } catch (err) {
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
      consilatedTags: consolidateTags(example),
      unique: extractUniquePOS(example),
    }));

    this.skills.push({
      examples: updatedExamples,
      handlerCB,
    });
  }
}

export default new SkillHandler();
