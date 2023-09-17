import {RequestOptions, get } from 'node:http';

export function ollamaGet(options: RequestOptions): any {

  const req = get(options, (res) => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(JSON.parse(data));
    });
  }).on('error', err => {
    console.log('Error: ' + err.message);
  }).end();
};