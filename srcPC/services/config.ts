import { ConfigClient } from '@pc/services/apiServer';

interface IUiController {
  inviteAddrList: string[];
  allShowInvite:boolean
}
export function getUiConfig(): Promise<IUiController> {
    return ConfigClient.request({
        method: 'GET',
        path: '/uiController/main.json',
        params: { t: Date.now() }
    });
}
