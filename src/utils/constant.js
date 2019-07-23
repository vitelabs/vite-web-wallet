import viteIcon from 'assets/imgs/vite.svg';
// import vcpIcon from 'assets/imgs/VCC.svg';
// import vttIcon from 'assets/imgs/vtt.svg';
export const defaultTokenMap = process.env.NODE_ENV === 'production' ? {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    }
    // 'tti_251a3e67a41b5ea2373936c8': {
    //     'tokenSymbol': 'VCP',
    //     icon: vcpIcon
    // },
    // 'tti_c55ec37a916b7f447575ae59': {
    //     'tokenSymbol': 'VTT',
    //     icon: vttIcon
    // }
} : {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    }
    // 'tti_c2695839043cf966f370ac84': {
    //     'tokenSymbol': 'VCP',
    //     icon: vcpIcon
    // },
    // 'tti_6ac4abf1b4e855ba31620f0a': {
    //     'tokenSymbol': 'VTT',
    //     icon: vttIcon
    // }
};

export const VITE_TOKENID = 'tti_5649544520544f4b454e6e40';
export const OFFICAL_GATE_NAME = 'Vite Official Gateway';

