import request from 'utils/request';
class TestToken {
    constructor() {
    }
    get(accountAddress) {
        return request({
            method: 'POST',
            url: '/api/account/newtesttoken',
            params: {
                accountAddress
            }
        });
    }
}

export default TestToken;