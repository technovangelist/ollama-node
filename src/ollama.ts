import { requestList, requestShowInfo, requestPost, streamingPost, requestDelete } from "./utility";
import { RequestOptions } from "http";

interface Options {
  [key: string]: any;
}
type CallbackFunction = (chunk: any) => void;

type ListOutput = {
  models: string[],
  complete: ModelList[]
}
type ShowInfoOutput = {
  license?: string,
  modelfile?: string,
  parameters?: string,
  system?: string,
  template?: string
}

type GenerateBodyInput = {
  model: string,
  prompt: string,
  system: string,
  template: string,
  options: Options,
  context: number[]
}

type GenerateMessage = {
  model: string,
  created_at: string,
  response: string,
  done: boolean
}

type CreateMessage = {
  status: string
}

export type ModelList = {
  name: string,
  modified_at: string,
  size: number,
  digest: string
}

export type GenerateFinalOutput = {
  model: string,
  created_at: string,
  done: boolean,
  context: number[],
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number,
}

export class Ollama {
  protected Host: string;
  private Port: number = 11434;
  private Model: string = '';
  private SystemPrompt: string = '';
  private Template: string = '';
  private Parameters: Options = {};
  private Context: number[] = [];

  constructor();
  constructor(ollamaHost: string);
  constructor(...args: any[]) {
    if (args.length === 0) {
      this.Host = '127.0.0.1';
    } else {
      if (args[0] === 'localhost') {
        this.Host = "127.0.0.1";
      } else {
        this.Host = args[0];
      }
    }
  }

  private numberIfNumber(value: string): number | string {
    const isOnlyNumbers = /^\d+$/.test(value);
    if (isOnlyNumbers) {
      return parseInt(value, 10);
    }
    return value;
  }

  private async parseParams() {
    let options: Options = {};
    const info = await this.showModelInfo();
    const params = info.parameters?.split('\n').forEach(line => {
      const [name, value] = line.split(/\s+/).filter(Boolean);
      const parsedvalue = this.numberIfNumber(value);
      if (name === 'stop') {
        if (!options.stop) {
          options.stop = [];
        }
        options.stop.push(parsedvalue);
      } else {
        options[name] = parsedvalue;
      }
    });
    return options;
  }
  async localModelExists(model: string): Promise<boolean> {
    const localmodels = await this.listModels();
    if (model.includes(":")) {
      return localmodels.models.includes(model);
    } else {
      const basemodels = localmodels.models.map(m => m.split(":")[0]);
      return basemodels.includes(model);
    }
  }

  setContext(context: number[]) {
    this.Context = context;
  }

  showHost() {
    return this.Host;
  }

  async setModel(model: string) {
    // const localmodels = await this.listModels() //? 
    if (await this.localModelExists(model)) {
      this.Model = model;
      const info = await this.showModelInfo();
      this.Parameters = await this.parseParams();
      this.Template = info.template || '';
      this.SystemPrompt = info.system || '';
    } else {
      throw new Error(`Model ${model} not found.`);
    }
  }
  setTemplate(template: string) {
    this.Template = template;
  }

  setSystemPrompt(systemPrompt: string) {
    this.SystemPrompt = systemPrompt;
  }

  addParameter(name: string, value: any) {
    name = name.toLowerCase();
    if (name === 'stop') {
      if (!this.Parameters.stop) {
        this.Parameters.stop = [];
      }
      this.Parameters.stop.push(value);
    } else {
      this.Parameters[name] = value;
    }
  }

  deleteParameter(name: string, value: string) {
    if (name === 'stop') {
      const stops: string[] = this.Parameters.stop;
      if (stops.includes(value)) {
        stops.splice(stops.indexOf(value))
        this.Parameters.stop = stops
      }
    } else {
      this.Parameters[name] = undefined;
    }
  }


  deleteParameterByName(name: string) {
    this.Parameters[name] = undefined;
  }
  deleteAllParameters() {
    this.Parameters = {};
  }

  showParameters(): Options {
    return this.Parameters;
  }
  async showSystemPrompt() {
    return this.SystemPrompt;
  }
  showTemplate() {
    return this.Template;
  }
  showModel() {
    return this.Model;
  }

  private async showModelInfo(): Promise<ShowInfoOutput> {
    const options: RequestOptions = {
      hostname: this.Host,
      port: this.Port,
      method: 'POST',
      path: '/api/show'
    }

    return await requestShowInfo(options, this.Model) as ShowInfoOutput;
  }
  async listModels() {
    const options: RequestOptions = {
      hostname: this.Host,
      port: this.Port,
      path: '/api/tags',
      method: 'GET'
    }

    const getResponse = await requestList(options) as { 'models': ModelList[] };
    const complete = getResponse.models;
    const models = complete.map(m => m.name);
    return { models, complete }
  }

  async generate(prompt: string) {
    const generateOptions: RequestOptions = {
      hostname: this.Host,
      port: 11434,
      method: 'POST',
      path: '/api/generate',
    };
    const generateBody: GenerateBodyInput = {
      model: this.Model,
      prompt,
      system: this.SystemPrompt,
      template: this.Template,
      options: this.Parameters,
      context: this.Context
    }
    // console.log(generateBody.options);
    const genoutput = await requestPost('generate', generateOptions, generateBody);
    const final: GenerateFinalOutput = genoutput.final as GenerateFinalOutput;
    const messages: GenerateMessage[] = genoutput.messages as GenerateMessage[];
    this.Context = final.context as number[];

    const output = messages.map(m => m.response).join("")
    return { output, stats: final }

  };


  streamingGenerate(prompt: string, responseOutput: CallbackFunction | null = null, contextOutput: CallbackFunction | null = null, fullResponseOutput: CallbackFunction | null = null, statsOutput: CallbackFunction | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: RequestOptions = {
        hostname: this.Host,
        port: 11434,
        method: 'POST',
        path: '/api/generate',
      }
      const body: GenerateBodyInput = {
        model: this.Model,
        prompt,
        system: this.SystemPrompt,
        template: this.Template,
        options: this.Parameters,
        context: this.Context
      }

      streamingPost('generate', options, body, (chunk) => {
        const jchunk = JSON.parse(chunk);
        if (Object.hasOwn(jchunk, 'response')) {
          fullResponseOutput && fullResponseOutput(JSON.stringify(jchunk))
          responseOutput && responseOutput(jchunk.response)
        } else {
          if (Object.hasOwn(jchunk, 'context')) {
            // console.log(jchunk.context)
            statsOutput && statsOutput(JSON.stringify(jchunk))
            contextOutput && contextOutput(jchunk.context.toString());
            this.Context = jchunk.context;
            resolve();
          }
        }
      })
    });
  }

  // async delete(modelName: string) {
  //   const options: RequestOptions = {
  //     hostname: this.Host,
  //     port: 11434,
  //     method: 'DELETE',
  //     path: '/api/delete',
  //   }

  //   const genoutput = await requestDelete(options, modelName);
  //   console.log(genoutput);
  // }

  async create(modelName: string, modelPath: string) {
    const createOptions: RequestOptions = {
      hostname: this.Host,
      port: 11434,
      method: 'POST',
      path: '/api/create',
    };
    const createBody = {
      name: modelName,
      path: modelPath
    }
    const genoutput = await requestPost('create', createOptions, createBody);
    const messages: CreateMessage[] = genoutput.messages as CreateMessage[];
    return messages.map(m => m.status);
  };


  async generateEmbed(modelName: string, input: string) {
    const options: RequestOptions = {
      hostname: this.Host,
      port: 11434,
      method: 'POST',
      path: '/api/embeddings'
    };
    const body = {
      model: modelName,
      prompt: input
    };
    const genoutput = await requestPost('embed', options, body);
    return (genoutput.final as { embedding: number[] }).embedding
  };

  streamingCreate(modelName: string, modelPath: string, responseOutput: CallbackFunction | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: RequestOptions = {
        hostname: this.Host,
        port: 11434,
        method: 'POST',
        path: '/api/create',
      }
      const body = {
        name: modelName,
        path: modelPath
      }
      streamingPost('create', options, body, async (chunk) => {
        const jchunk = JSON.parse(chunk);
        if (Object.hasOwn(jchunk, 'status')) {
          responseOutput && responseOutput(jchunk.status)
          if (jchunk.status === "success") {
            resolve();
          }
        } else {
          responseOutput && responseOutput(jchunk)
        }
      })
    })
  }

  async streamingPull(modelName: string, responseOutput: CallbackFunction | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: RequestOptions = {
        hostname: this.Host,
        port: 11434,
        method: 'POST',
        path: '/api/pull',
      }
      const body = {
        name: modelName
      }
      streamingPost('pull', options, body, async (chunk) => {
        const jchunk = JSON.parse(chunk);
        let percent = "";
        if (Object.hasOwn(jchunk, 'completed')) {
          percent = `downloading - ${(100 * (jchunk.completed / jchunk.total)).toFixed(2)} % complete`
          responseOutput && responseOutput(`${percent}`)
        } else if (Object.hasOwn(jchunk, 'status')) {
          responseOutput && responseOutput(jchunk.status)
          // if (jchunk.status === "success") {
          //   resolve();
          // }
        } else {
          responseOutput && responseOutput(jchunk)
        }
        if (jchunk.status === "success") {
          resolve();
        }
      })
    })
  }

  async streamingPush(modelName: string, responseOutput: CallbackFunction | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: RequestOptions = {
        hostname: this.Host,
        port: 11434,
        method: 'POST',
        path: '/api/push',
      }
      const body = {
        name: modelName
      }
      streamingPost('push', options, body, async (chunk) => {
        const jchunk = JSON.parse(chunk);
        if (Object.hasOwn(jchunk, 'status')) {
          responseOutput && responseOutput(jchunk.status)
          // if (jchunk.status === "success") {
          //   resolve();
          // }
        } else {
          responseOutput && responseOutput(jchunk)
        }
      })
    })
  }

  async copy(sourceName: string, destinationName: string) {
    const options: RequestOptions = {
      hostname: this.Host,
      port: 11434,
      method: 'POST',
      path: '/api/copy',
    };
    const body = {
      source: sourceName,
      destination: destinationName
    }
    if (await this.localModelExists(sourceName)) {
      requestPost('copy', options, body);
    } else {
      return Promise.reject(new Error("Model not found"));
    }
  };
  cbPrintword(chunk: any) {
    process.stdout.write(chunk);
  }
  cbPrintLine(chunk: any) {
    console.log(chunk);
  }

}