import viteIcon from 'assets/imgs/vite.png';
import vxIcon from 'assets/imgs/vx.png';
// import vcpIcon from 'assets/imgs/VCC.svg';
// import vttIcon from 'assets/imgs/vtt.svg';
export const defaultTokenMap = process.env.NODE_ENV === 'production' ? {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    },
    'tti_564954455820434f494e69b5': {
        'tokenSymbol': 'VX',
        icon: vxIcon
    }
} : {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    },
    'tti_564954455820434f494e69b5': {
        'tokenSymbol': 'VX',
        icon: vxIcon
    }
    // 'tti_6ac4abf1b4e855ba31620f0a': {
    //     'tokenSymbol': 'VTT',
    //     icon: vttIcon
    // }
};

export const VITE_TOKENID = 'tti_5649544520544f4b454e6e40';
export const OFFICAL_GATE_NAME = 'Vite Official Gateway';

