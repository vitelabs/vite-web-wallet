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
        let utf8Bytes = this.utils.strToUtf8Bytes(message);
        let hexStr = utf8Bytes ? this.utils.bytesToHex(utf8Bytes) : '';
        if (hexStr.length > 180) {
            return 1;
        }
        return -1;
    }
}

export default Types;