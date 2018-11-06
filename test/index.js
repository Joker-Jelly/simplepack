import pageX from './src/page.jsx';
import './index.less';

console.log(pageX);

setTimeout(() => {
  import('./src/page').then(page => {
    page.default();
  });
}, 1000);