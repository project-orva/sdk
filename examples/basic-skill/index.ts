import { skillHandler } from '../../packages/orva-sdk';

const settings = {
    hostServiceUrl: 'localhost:50051',
    id: 'some-example-id',
    name: 'test-thing',
    originAddress: 'http://localhost:5021',
};
const skill = new skillHandler(settings);
skill.handleSkill([
    'this is a test',
    'some test thing',
    'test test',
], (req, err) => {
    if (req.userAccessLevel > 0) {
        return {
            statement: 'it is greater than!',
        }
    }

    return {
        statement: 'it is zero!',
    }
})

skill.start(5021, () => {
    console.log('she started successfully!')
});