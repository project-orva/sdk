import HTTPServer, {
  RequestError,
} from './web-server';
import {
  createClient,
  registerSkill,
} from './internal/grpc-skill-service';
import * as uuid from 'uuid';
import http from 'http';

interface SkillHandlerProps {
  hostServiceUrl: string,
  id: string,
  name: string,
  originAddress: string,
}

export interface ContextRequest {
  subsetId: string,
  userId: string,
  message: string,
  userAccessLevel: number,
  deviceAccessLevel: number,
}

export interface SkillResponse {
  statement?: string,
  graphicUrl?: string,
  graphicType?: number,
}

type SkillRequest = (
  resp: ContextRequest,
  handleErr: RequestError,
  req?: http.IncomingMessage) => SkillResponse

export default class SkillHandler {
  private skills: { [id: string]: SkillRequest } = {};
  private server = HTTPServer;
  private examples: Array<string> = []
  private skillClient: any;
  private id: string;
  private name: string;
  private originAddress: string;

  constructor({
    hostServiceUrl,
    id,
    name,
    originAddress,
  }: SkillHandlerProps) {
    this.skillClient = createClient({
      serviceUrl: hostServiceUrl,
    });

    this.id = id;
    this.name = name;
    this.originAddress = originAddress;
  }

  private async determineSkill(
    request: ContextRequest,
    errHandler: RequestError,
    httpRequest: http.IncomingMessage,
  ) {
    if (!!this.skills[request.subsetId]) {
      this.skills[request.subsetId](request, errHandler, httpRequest);
      return
    }
    errHandler('subsetId map does not exist');
  }

  private serveSkillInformation = () => ({
    skillId: this.id,
    examples: this.examples,
  })

  public async start(
    port: number,
    onStart: () => void = () => {},
  ) {

    try {
      const resp = await registerSkill(this.skillClient, {
        SkillName: this.name,
        SkillID: this.id,
        ForwardAddress: this.originAddress,
        ForwardType: 0, // 0 -> http, no other types currently supported.
        Examples: this.examples,
      }) as { IsRegistered: boolean };

      if (!resp.IsRegistered) {
        throw new Error('skill cannot be successfully registered')
      }
    } catch (err) {
      console.log(err)
      throw new Error('failed to connect to host service')
    }

    await onStart();

    this.server(port, async (...args) => {
      const { method } = args[2];
      if (method === 'GET') {
        return this.serveSkillInformation()
      } else if (method === 'POST') {
        return this.determineSkill(...args)
      }

      args[1]('method not supported');
    })
  }

  async handleSkill(examples: any, handlerCB: SkillRequest) {
    const id = uuid.v4();

    this.examples = this.examples.concat(examples.map((example: string) => ({
      GroupID: id,
      ExampleText: example,
    })));

    this.skills[id] = handlerCB;
  }
}