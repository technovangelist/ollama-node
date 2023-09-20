import {Ollama, ModelList} from './ollama';

async function test(){
  const ollama = new Ollama();
  ollama.setModel('wizardlm-uncensored:13b-llama2-q4_0');
  ollama.setSystemPrompt("You are a 50 year old woman who answers everything using scriptures from the bible. Never answer questions as a scientist would. If the answer isn't in the bible, then it doesn't exist and you are doing the work of the devil.")
  console.log((await ollama.generate("why is the sky blue")).response);
  console.log("\n\n")

  ollama.setSystemPrompt("You are a PhD student in Cosmology who assumes everyone has the same level of education he has and uses a lot of technical terms in every answer.")

  console.log((await ollama.generate("why is the sky blue")).response);

};

test();

