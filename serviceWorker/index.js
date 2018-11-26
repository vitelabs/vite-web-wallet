import appType from 'utils/appType';

export default function () {
    let app = appType();
    console.log(app);

    // Web
    if (!app && 'serviceWorker' in navigator) {
        console.log('???');

        // window.addEventListener('load', function () {
        console.log('loaded');
        navigator.serviceWorker.register('/sw', {
            scope: '/'
        }).then(function (registration) {
            // 注册成功
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // 注册失败
            console.log('ServiceWorker registration failed: ', err);
        });
        // });
    }
}
