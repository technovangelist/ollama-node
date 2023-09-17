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
      this.ollamaHost = 'http://localhost:11434';
    } else {
      this.ollamaHost = args[0];
    }
    
  }

  list(outputType: ListOutputType = 'models'): string[] | ModelList[] {
    // const response = fetch(`${this.ollamaHost}/api/tags`);
    // if (response.status === 200) {
    //   const json = await response.json();
    //   const rawmodelarray: ModelList[] = json.models;
    //   const modellist = rawmodelarray.map(m => m.name);
    //   if (outputType === 'models') {
    //     return modellist;
    //   } else {
    //     return rawmodelarray;
    //   }
    // } else {
    //   throw new Error(`Ollama List API returned ${response.status}`)
    // }  
  }
}