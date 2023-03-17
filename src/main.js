// import "core-js"; //使用babel中预设去按需引入
import { add } from './js/index';
import './css/index.css';
import './less/index.less';

if(module.hot) {
    console.log(module.hot);
    module.hot.accept('./js/index');
}
new Promise((res) => {
    res(1);
})

//注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        //排除重复注册
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}