import {RequestOptions, get as srcget, request} from 'node:http';

export function get(options: RequestOptions): any {

  const req = srcget(options, (res) => {
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
  
  console.log(req)
};

export function post(options: RequestOptions): any {
  let data = '';
  const req = request
}