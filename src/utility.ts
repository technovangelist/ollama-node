import { RequestOptions, get as srcget, request as httprequest } from 'http';
import { resolve } from 'path';

type GenerateMessage = {
  model: string,
  created_at: string,
  response: string,
  done: boolean
}
export type GenerateComplete = {
  model: string,
  created_at: string,
  done: boolean,
  context: number[],
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number
}



export function requestList(options: RequestOptions) {
  return new Promise((resolve, reject) => {
    const req = httprequest(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: string[] = [];

      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        const joined = body.join('');
        const parsed = JSON.parse(joined);
        resolve(parsed)
      });
    });

    req.on('error', reject);
    req.end();
  });
};

export function requestShowInfo(options: RequestOptions, model: string) {
  return new Promise((resolve, reject) => {
    const req = httprequest(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: string[] = [];

      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {

        const joined = body.join('');
        const parsed = JSON.parse(joined);
        resolve(parsed)
      });
    });
    req.write(JSON.stringify({ "name": model }));
    req.on('error', reject);
    req.end();
  })

}

export function requestGenerate(options: RequestOptions, model: string, prompt: string, system: string, template: string): any {
  return new Promise((resolve, reject) => {
    const req = httprequest(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: GenerateMessage[] = [];

      response.on('data', (chunk) => body.push(JSON.parse(chunk)));
      response.on('end', () => {
        const stats: GenerateComplete = body[body.length - 1] as unknown as GenerateComplete;
        const response = body.slice(0, body.length - 1).map(m => m.response).join('').trim();
        resolve({ response, stats })
      });
    });
    req.write(JSON.stringify({ "prompt": prompt, "model": model, "system": system, "template": template }));
    req.on('error', reject);
    req.end()

  });
};