export default function(opts: Options = {}): void {
  const img = new Image();
  img.src = opts.url || 'http://img.alicdn.com/tps/i2/TB1bNE7LFXXXXaOXFXXwFSA1XXX-292-116.png';

  document.body.appendChild(img);
}

interface Options {
  url?: string
}