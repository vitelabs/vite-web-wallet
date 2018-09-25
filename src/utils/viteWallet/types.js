class Types {
    constructor(utils) {
        this.utils = utils;
    }

    isValidHexAddr(addr) {
        return $ViteJS.Vite.Types.isValidHexAddr(addr);
    }
    isValidMessage(message) {
        if (/\s+/g.test(message)) {
            return 0;
        }
        let hexStr = message ? this.utils.strToHex(message) : '';
        if (hexStr.length > 180) {
            return 1;
        }
        return -1;
    }
}

export default Types;