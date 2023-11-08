const { Connection } = require('../lib');

describe('Connection Instance Works', () => {
    test('Calls the random person api and returns the correct value', async () => {
        const url = 'https://randomuser.me/';
        const adapter = new Connection(url);

        const [res, err] = await adapter.request('GET', '/api');

        const user = res.data;
        expect(res.status).toEqual(200);
        expect(user).toBeDefined();
    });
});
