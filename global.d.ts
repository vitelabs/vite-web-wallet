import Vue from 'vue';
import 'vite/client';

declare global {
	interface Window {
    VITE_NODE_API: string;
    touchID: any;
	}
}

declare type bnStr = string
declare type tokenId = string
declare type tokenSymbol = string

declare interface HDAccount {
    id: string;
    lang: string;
    name: string;
    address: string;
    status: number;
    addrList: Array<{
        address: string,
        id: string,
        idx: number
    }>
    addrNum: number
    activeAccount

    constructor({ id, lang, name, activeAddr, keystore, addrNum, activeIdx }: {
        id: string,
        keystore: string,
        lang?: string,
        name?: string,
        activeAddr: string,
        addrNum?: number,
        activeIdx?: number
    })

    save();
    saveAcc();
    activate();
    freeze();
    saveOnAcc(key: string, info: any)
    getAccInfo()
    lock()
    setActiveAcc(index?: number, address?: string)
    unlock(params: any)
}

declare module '*.vue' {
    export default Vue;
}

declare module '*.png'
declare module '*.svg'

type Network = {
	name: string;
	rpcUrl: string;
	explorerUrl?: string;
};

type injectedScriptEvents = 'accountChange' | 'networkChange';
type VitePassport = {
	// These methods are relayed from contentScript.ts => injectedScript.ts
	getConnectedAddress: () => Promise<undefined | string>;
	disconnectWallet: () => Promise<undefined>;
	getNetwork: () => Promise<Network>;

	// These methods are relayed from contentScript.ts => background.ts => popup => contentScript.ts => injectedScript.ts
	connectWallet: () => Promise<{ domain: string }>;
	writeAccountBlock: (type: string, params: object) => Promise<{ block: AccountBlockBlock }>;

	// `on` subscribes to `event` and returns an unsubscribe function
	on: (
		event: injectedScriptEvents,
		callback: (payload: { activeAddress?: string; activeNetwork: Network }) => void
	) => () => void;
};
declare global {
	interface Window {
		vitePassport?: VitePassport;
	}
}