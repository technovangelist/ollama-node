import { RequestOptions, get as srcget, request, IncomingMessage } from 'http';
export type FinalOutput = {
  messages: {}[],
  final: {}
}
export type GenerateMessage = {
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
interface Options {
  seed?: number;
  numa?: boolean;

  // Backend options
  useNUMA?: boolean;

  // Model options
  numCtx?: number;
  numKeep?: number;
  numBatch?: number;
  numGQA?: number;
  numGPU?: number;
  mainGPU?: number;
  lowVRAM?: boolean;
  f16KV?: boolean;
  logitsAll?: boolean;
  vocabOnly?: boolean;
  useMMap?: boolean;
  useMLock?: boolean;
  embeddingOnly?: boolean;
  ropeFrequencyBase?: number;
  ropeFrequencyScale?: number;

  // Predict options
  numPredict?: number;
  topK?: number;
  topP?: number;
  tfsZ?: number;
  typicalP?: number;
  repeatLastN?: number;
  temperature?: number;
  repeatPenalty?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  mirostat?: number;
  mirostatTau?: number;
  mirostatEta?: number;
  penalizeNewline?: boolean;
  stop?: string[];

  numThread?: number;
}

type PostTarget = 'generate' | 'create' | 'delete' | 'pull' | 'push' | 'copy' | 'embed'; // | 'show';

type PostInput<T> =
  T extends 'generate' ? { model: string, prompt: string, system: string, template: string, options: Options, context: number[] } :
  T extends 'create' ? { name: string, path: string } :
  T extends 'delete' ? { name: string } :
  T extends 'pull' ? { name: string } :
  T extends 'push' ? { name: string } :
  T extends 'copy' ? { source: string, destination: string } :
  T extends 'embed' ? { model: string, prompt: string } :
  never;


export function requestList(options: RequestOptions) {
  return new Promise((resolve, reject) => {
    const req = request(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: string[] = [];

      response.on('data', (chunk: string) => body.push(chunk));
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
    const req = request(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: string[] = [];


      response.on('data', (chunk: string) => body.push(chunk));
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

export function requestDelete(options: RequestOptions, model: string) {
  return new Promise((resolve, reject) => {

    const req = request(options, (response) => {
      // console.log(response);
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body: string[] = [];

      response.on('data', (chunk: string) => body.push(chunk));
      response.on('end', () => {
        const joined = body.join('');
        const parsed = JSON.parse(joined);
        resolve(parsed)
      });
    });
    req.write('{"name": "' + model + '"}');
    req.on('error', reject);
    req.end();
  })

}

export function requestPost<P extends PostTarget>(target: P, options: RequestOptions, databody: PostInput<P>): Promise<FinalOutput> {
  let body: {}[] = [];
  return new Promise((resolve, reject) => {
    const req = request(options, (response) => {
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode > 299) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      response.on('data', (chunk) => {
        if (target === 'embed') {
          // console.log('hi');
          body.push(chunk.toString('utf8'))
        } else {
          body.push(JSON.parse(chunk));
        }
      });
      response.on('end', () => {
        if (target === 'embed') {
          resolve({ messages: [], final: JSON.parse(body.join('')) })
        } else {
          const final = body[body.length - 1];
          const messages = body.splice(0, body.length - 1);
          resolve({ messages, final });
        }
      });
    });
    req.write(JSON.stringify(databody));
    req.on('error', reject);
    req.end();
  });
}

export function streamingPost<P extends PostTarget>(target: P, options: RequestOptions, databody: PostInput<P>, callback: (chunk: any) => void) {
  const req = request(options, (res) => {
    res.on('data', (chunk: string) => {
      // console.log('in streamingPost');
      // console.log(chunk);
      const chunkStr = chunk.toString();
      const items = chunkStr.split('\n').filter(Boolean);

      for (const item of items) {
        callback(item);
        if (item.includes('error')) {
          console.log(`Error: ${JSON.parse(item).error}`)
        }
      }
    });
    res.on('error', (error) => {
      console.error(`Response error: ${error.message}`);
    })
    res.on('end', () => {

    });
  });

  req.on('error', (error) => {
    console.error(`Request error: ${error.message}`);
  });

  // Send the POST data
  req.write(JSON.stringify(databody));
  req.end();
}


// export async function* streamingGenerate(options: RequestOptions, model: string, prompt: string, system: string, template: string, parameters: string): AsyncGenerator<any, any, unknown> {
//   const body: GenerateMessage[] = [];

//   const req = request(options);
//   req.write(JSON.stringify({ "prompt": prompt, "model": model, "system": system, "template": template, "parameters": parameters }));
//   const response: IncomingMessage = await new Promise((resolve, reject) => {
//     req.on('response', resolve);
//     req.on('error', reject);
//     req.end();
//   });
//   for await (const chunk of response) {
//     body.push(JSON.parse(chunk));
//     yield JSON.parse(chunk);
//   }

// }
