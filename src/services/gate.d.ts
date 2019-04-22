import { TokenId } from '@vite/vitejs';

type responseWrapper = {
    code: number, msg: string, data: object, error?: string, subCode?: number
}
type GateTokenInfo = {
    "tokenId": TokenId
    "gataway": string
    "mappedNet": string
    "mappedTokenId": string

}
type GateInfos = {
    "name": string, //网关名称
    "url": string,//网关host，后面的请求为该网关host与url拼接而成
    "tokens": Array<GateTokenInfo>
}
type client = () => Promise<any, responseWrapper>
type getGateInfos = () => Promise<Array<GateInfo>>