// // import BigNumber from 'bignumber.js';

// ViteJS.BigNumber.config({ 
//     FORMAT: {
//         decimalSeparator: '.',
//         groupSeparator: '',
//         groupSize: 0,
//         secondaryGroupSize: 0,
//         fractionGroupSeparator: ' ',
//         fractionGroupSize: 0
//     }
// });

// module.exports = {
//     isEqual(num1, num2) {
//         num1 = new ViteJS.BigNumber(num1);
//         num2 = new ViteJS.BigNumber(num2);
//         return num1.isEqualTo(num2);
//     },
//     dividedToNumber(num1, num2) {
//         num1 = new ViteJS.BigNumber(num1);
//         num2 = new ViteJS.BigNumber(num2);
//         return num1.dividedBy(num2).integerValue(ViteJS.BigNumber.ROUND_CEIL).toNumber();
//     },
    
// };

// // import BigNumber from 'bignumber.js';

// // const VITE_MIN_UNIT = new BigNumber('1000000000000000000');
// // const DP = 8;

// // module.exports = {
// //     getViteMinUnit() {
// //         return VITE_MIN_UNIT;
// //     },
// //     toBasic(num, decimalPlaces = DP, minUnit = VITE_MIN_UNIT) {
// //         num = new BigNumber(num);
// //         if (num.c == null) {
// //             return '';
// //         }
// //         try {
// //             return num.dividedBy(minUnit).decimalPlaces(decimalPlaces).toFormat();
// //         } catch(err) {
// //             return '';
// //         }
// //     },
// //     toMin(num, minUnit = VITE_MIN_UNIT) {
// //         num = new BigNumber(num);
// //         if (num.c == null) {
// //             return '';
// //         }
// //         try {
// //             return num.multipliedBy(minUnit).toFormat();
// //         } catch(err) {
// //             return '';
// //         }
// //     }
// // };