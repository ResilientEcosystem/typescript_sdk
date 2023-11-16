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

    test("Calls a wrong endpoint - SHOULD RESULT IN ERROR", async() => {
        const url = 'https://randomuser.me/';
        const adapter = new Connection(url);

        const [res, err] = await adapter.request('GET', '/WRONG_API');

        expect(res).toEqual(null);
        expect(err).toBeInstanceOf(Error)
    })
});
