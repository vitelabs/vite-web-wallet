class Pledge {
    getPledgeList({
        addr, index, pageCount
    }) {
        return $ViteJS.pledge.getPledgeList(addr, index, pageCount);
    }

    getPledgeQuota(addr) {
        return $ViteJS.pledge.getPledgeQuota(addr);
    }
}

export default Pledge;
