import { get, post  } from "./utility";
import { RequestOptions } from "node:http"


type ListOutputType = 'models' | 'complete';
type ModelList = {
  name: string,
  modified_at: string,
  size: number,
  digest: string
}
export class Ollama {
  ollamaHost: string;

  constructor(); 
  constructor(ollamaHost: string);
  constructor(...args: any[]) {
    if (args.length === 0) {
      this.ollamaHost = '127.0.0.1';
    } else {
      if (args[0] === 'localhost'){
        this.ollamaHost = "127.0.0.1";
      } else {
        this.ollamaHost = args[0];
      }
      
    }
    
  }

  listModels(outputType: ListOutputType = 'models'): string[] | ModelList[] {
    const options: RequestOptions = {
      hostname: this.ollamaHost,
      port: 11434,
      path: '/api/tags',
    }
    const models: ModelList[] = get(options).models;
    if (outputType === 'models') {
      return models.map(m => m.name);
    } else {
      return models
    }
  }
  
  
  // pullmodel
  // pushmodel
  // generate
  // createmodel
  // showmodelinfo
  // copymodel
  // deletemodel
}