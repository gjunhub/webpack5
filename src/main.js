import { add } from './js/index';
import './css/index.css';
import './less/index.less';

if(module.hot) {
    console.log(module.hot);
    module.hot.accept('./js/index');
}