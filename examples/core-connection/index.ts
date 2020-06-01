import { CoreService, types } from '../../packages/orva-sdk-services';


const app = async () => {
    const core = new CoreService('localhost:3005');

    const args = {
        userId: 'test123',
        deviceId: 'test123',
        message: 'are we working?',
    } as types.ProcessStatementArg;


    const response = await core.processStatement(args);
    console.log(response);
}


app();
