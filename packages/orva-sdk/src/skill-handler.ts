import HTTPServer from './web-server';
import {
  registerSkill,
  createClient,
} from './internal/grpc-skill-service';
import uuid from 'uuid';

export default class SkillHandler {
  constructor({
    server = HTTPServer,
    skillHostURL,
    skillID,
  }) {
    this.skills = [];
    this.server = server;
    this.examples = [];

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
    if (!!this.skills[request.subsetId]) {
      this.skills[request.subsetId](request, errHandler);
    }
    errHandler('subsetId map does not exist');
  }

  async _serveSkillInformation() {
    return {
      skillId: this.skillId,
      examples: this.examples,
    }
  }

  async start(port, onStart) {
    const resp = await this.skillClient.registerCurrentInstance({
      skillName: this.skillName,
      skillID: this.skillId,
      forwardAddress: this.hostAddress,
      forwardType: 0, // 0 -> http, no other types currently supported.
    });

    if (!resp.IsRegistered) {
      throw Error('skill cannot be successfully registered')
    }

    await onStart(); // ~

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
    const id = uuid.v4();

    this.examples.concat(examples.map(x => ({
      GroupID: id,
      ExampleText: x,
    })));

    this.skills[id] = handlerCB;
  }
}