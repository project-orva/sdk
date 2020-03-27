import generateGRPCClient from './internal/generate-grpc-client';

const PROTO_PATH = __dirname + '/api/skill-service.proto';

const formatObject = (object) => ({
    SkillID: object.skillID,
    ExampleInfo: object.exampleInfo.map(example => ({
        ExampleText: example.exampleText,
        POSMapping: {
            Words: example.posMapping.words,
            Tags: example.posMapping.tags,
        }
    })),
})

export default class SkillClient {
    constructor(url) {
        this._grpcClient = generateGRPCClient(PROTO_PATH, url, 'grpcSkill');
    }

    async registerCurrentInstance(args) {
        return await new Promise((resolve, reject) => {
            this._grpcClient['RegisterCurrentInstance'](
                formatObject(args),
                (err, res) => {
                    if (err) reject(err);

                    resolve(res);
                }
            )
        })

    }
}
