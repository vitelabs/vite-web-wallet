class TestToken {
    constructor(provider) {
        this.provider = provider;
    }

    get(addr) {
        return this.provider.request('testapi_getTestToken', [addr]);
    }
}

export default TestToken;
