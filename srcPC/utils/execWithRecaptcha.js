export function execWithRecaptcha(fn, ...args) {
    const ele = document.getElementById('g-recaptcha-1');
    ele.classList.add('show');
    const reset = () => {
        ele.classList.remove('show');
        grecaptcha.reset(id);
    };

    const id = grecaptcha.render(ele, {
        sitekey: process.env.recaptchaToken,
        callback: () => {
            reset();
            fn(...args);
        },
        'expired-callback': () => {
            reset();
            console.log('expireddddd');
        },
        'error-callback': () => {
            reset();
            console.log('errorrrr');
        }
    });
}
