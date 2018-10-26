
class Pledge {
    getPledgeList({
        addr, index, pageCount
    }) {
        return $ViteJS.Vite['pledge_getPledgeList'](addr, index, pageCount);
    }

    getPledgeQuota(addr) {
        return $ViteJS.Vite['pledge_getPledgeQuota'](addr);
    }
}

export default Pledge;
