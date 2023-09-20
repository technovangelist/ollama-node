import { requestList, requestGenerate, requestShowInfo, GenerateComplete } from "./utility";
import { RequestOptions } from "http"

type GenerateOutput = {
  response: string,
  stats: GenerateComplete
}

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

// type ListOutputType = 'models' | 'complete';
// type ListOutput<T> =
//   T extends 'models' ? string[] :
//   T extends 'complete' ? ModelList[] :
//   never;

export type ModelList = {
  name: string,
  modified_at: string,
  size: number,
  digest: string
}
export class Ollama {
  Host: string;
  Port: number = 11434;
  Model: string = '';
  SystemPrompt: string = '';
  Template: string = '';

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

  async setModel(model: string) {
    this.Model = model;
    const info = await this.showModelInfo();
    this.Template = info.template || '';
    this.SystemPrompt = info.system || '';
  }
  setTemplate(template: string) {
    this.Template = template;
  }

  setSystemPrompt(systemPrompt: string) {
    this.SystemPrompt = systemPrompt;
  }

  verifyModel() {
    if (this.Model === '') {
      throw new Error('Model not set');
    } else {
      if (this.SystemPrompt === '') {
        throw new Error('System Prompt not set');
      }
    }
  }
  async showModelInfo(): Promise<ShowInfoOutput> {
    const options: RequestOptions = {
      hostname: this.Host,
      port: this.Port,
      method: 'POST',
      path: '/api/show',
    }

    return await requestShowInfo(options, this.Model) as ShowInfoOutput;
  }
  async listModels(): Promise<ListOutput> {
    const options: RequestOptions = {
      hostname: this.Host,
      port: this.Port,
      path: '/api/tags',
    }

    const getResponse = await requestList(options) as { 'models': ModelList[] };
    const complete = getResponse.models
    const models = complete.map(m => m.name);
    return { models, complete }
  }

  async generate(prompt: string): Promise<GenerateOutput> {
    const generateOptions: RequestOptions = {
      hostname: this.Host,
      port: 11434,
      method: 'POST',
      path: '/api/generate',
    }
    return await requestGenerate(generateOptions, this.Model, prompt, this.SystemPrompt, this.Template) as GenerateOutput;
  };


  // pullmodel
  // pushmodel
  // generate
  // createmodel
  // showmodelinfo
  // copymodel
  // deletemodel
}