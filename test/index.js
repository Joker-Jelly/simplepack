import pageX from './src/page.ts';
import './index.less';

console.log(pageX);

setTimeout(() => {
  import('./src/page').then(page => {
    page.default();
  });
}, 1000);