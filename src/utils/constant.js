import { constant } from '@vite/vitejs';
import viteIcon from 'assets/imgs/vite.png';
import vxIcon from 'assets/imgs/vx.png';


export const defaultTokenMap = {
    'tti_5649544520544f4b454e6e40': {
        tokenSymbol: 'VITE',
        icon: viteIcon,
        index: 0,
        ...constant.Vite_Token_Info
    },
    'tti_564954455820434f494e69b5': {
        tokenSymbol: 'VX',
        icon: vxIcon,
        index: 0
    }
};

export const VITE_TOKENID = 'tti_5649544520544f4b454e6e40';
export const OFFICAL_GATE_NAME = 'Vite Official Gateway';

