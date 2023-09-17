import {Ollama} from './ollama';

async function o() {
  const ollama = new Ollama();
  const modellist = await ollama.list('models');
  console.log(modellist);
  // const models = await ollama.list();
  // console.log(models.body);
  
}
o();
