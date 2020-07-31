export const WalletSpace = 'VITE_WEB_WALLET';

export const OldAccList = 'OLD_ACC_LIST';
export const KeystoreAccList = 'KEYSTORE_ACC_LIST';

export const LastKey = 'ACC_LAST';
export const AccListKey = 'ACC_LIST';

export const VersionKey = 'version';
export const FirstKey = 'firstVisit';
export const AutoLogoutKey = 'autoLogoutTime';
export const HoldPwdKey = 'isHoldPWD';
export const CurrencyKey = 'currency';
export const LangKey = 'lang';
export const GateKey = 'gate';
export const ThemeKey = 'theme';
export const ShowHoldPWDNumKey = 'showHoldPWDNum';
export const HideZeroAssets = 'hideZeroAssets';

export const SettingKeys = [ FirstKey, LangKey, AutoLogoutKey, CurrencyKey, HoldPwdKey, ShowHoldPWDNumKey, GateKey, ThemeKey ];
export const TradeKeys = [ 'favoriteTickers', 'beginnerGuide' ];

export const AccBaseKeys = [ 'name', 'addrNum', 'idx', 'addr' ];
export const AddrBaseKeys = [ 'name', 'id', 'idx' ];
export const VCSessionKey = 'vcSession';

// setting, trade
export const AccInfoKeys = [ ShowHoldPWDNumKey, HoldPwdKey ];
export const AddrInfoKeys = ['INDEX_COLLECT_TOKEN'];

// 1.7.0: XVite

// KEYSTORE_ACC_LIST:  [{ addr,  name?, keystore }]

// ACC_LAST: { id, addr, name, addrName }
// ACC_LIST: [{ id, lang, keystore }]

// ${id}: { name, addrNum, addr, idx }                           // storageKey: [ setting ]
// ${id}_${addr}: { name, idx }                                  // storageKey: [ INDEX_COLLECT_TOKEN ]

// ${id}_${key}: ???
// ${id}_setting: { showHoldPWDNum, isHoldPWD, autoLogoutTime }

// ${id}_${addr}_${key}: ???
// ${id}_${addr}_INDEX_COLLECT_TOKEN: []

// ${key}
// version: { currentCode, showList }
// const SettingKey = ['firstVisit', 'lang', 'autoLogoutTime', 'currency', 'isHoldPWD', 'showHoldPWDNum' ];
// const TradeKey = ['favoriteTickers', 'beginnerGuide'];
