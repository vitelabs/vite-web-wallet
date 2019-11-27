import Vue from 'vue';

declare type bnStr = string
declare type tokenId = string
declare type tokenSymbol = string

export declare enum StatusMap {
    'LOCK' = 0,
    'UNLOCK' = 1
}

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
