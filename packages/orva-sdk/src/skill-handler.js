import HTTPServer from './web-server';
import ConsolidationResolver from './resolvers/consolidation-resolver';
import UniqueResolver from './resolvers/unique-resolver';
import SimilarResolver from './resolvers/similar-resolver';
import GrpcSkillService from './grpc-skill-service';

import { createPOSMapping } from './internal/pos';

import {
  shrinkMapping,
  getAverage,
  selectHighestRankedOperation,
  scoreResolvers,
} from './internal/helpers';

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
  SimilarResolver,
];

const flattenSkills = (skills) => {
  const readableSkills = [];
  for(let i = 0; i < skills.length; i++) {
    for(let j = 0; j < skills[i].examples.length; j++) {
      readableSkills.push(skills[i].examples[j]);
    }
  }

  return readableSkills;
}

export default class SkillHandler {
  constructor({
    server = HTTPServer,
    resolvers = defaultResovlers,
    skillHostURL,
    skillID,
  }) {
    this.skills = [];
    this.server = server;
    this.resolvers = resolvers;

    if (skillHostURL === undefined) {
      throw Error("skill host url is required for usage");
    }
    this.skillClient = new GrpcSkillService(skillHostURL);

    if (skillID === undefined) {
      throw Error("skill id is required, to get skill id please register your skill")
    }
    this.skillID = skillID;
  }

  async _determineSkill(request, errHandler) {
    const requestMapping = shrinkMapping(
      createPOSMapping(request.Message)
    );

    try {
      const rankedOperations = await Promise.all(this.skills
        .map(async ({ examples, handlerCB }) => {
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

      const { score, confidence } = await bestOperation;

      if (typeof handlerResponse === 'string') {
        return {
          ...defaultResponse,
          Score: score,
          Statement: handlerResponse,
          Confidence: confidence,
        };
      }
      return {
        ...defaultResponse,
        TypeOf: typeof handlerResponse,
        ...handlerResponse,
      };
    } catch (err) {
      return {
        ...defaultResponse,
        Error: err.message,
      };
    }
  }

  async _serveSkillInformation() {
    return {
      skillID: this.skillID,
      exampleInfo: flattenSkills(this.skills),
    }
  }

  async start(port, onStart) {
    const resp = await this.skillClient.registerCurrentInstance({
      skillID: this.skillID,
      exampleInfo: flattenSkills(this.skills),
    });
    
    if(!resp.IsRegistered) {
      throw Error('skill cannot be successfully registed.')
    }

    onStart(); // ~

    this.server(port, async (...args) => {
      const { method } = args[2];
      if (method === 'GET') {
        return this._serveSkillInformation()
      } else if (method === 'POST') {
        return this._determineSkill(...args)
      }

      args[1]({ message: 'method not supported' });
    })
  }

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