import { Ollama } from './ollama';

function durToSeconds(nanoseconds: number) {
  let seconds = nanoseconds / 1e9;  // Convert nanoseconds to seconds
  return parseFloat(seconds.toFixed(2));  // Format to two decimal points and return
}

async function test() {
  const ollama = new Ollama();
  await ollama.setModel("llama2")
  // const newmodel = await ollama.create("testmodel", "/Users/matt/projects/code/github/technovangelist/dockercondemo/Modelfile")
  // console.log(newmodel);
  // try {
  //   await ollama.setModel("stable-beluga:13b");
  // } catch (error) {
  //   console.log("Model not found");
  // }
  // ollama.setSystemPrompt(`You are a helpful AI assistant. Only respond in English.`);
  // const print = (word: string) => {
  //   process.stdout.write(word);
  // }

  const print = (status: string) => {
    process.stdout.write(status);
  }
  await ollama.streamingGenerate("why is the sky blue", print)
  // await ollama.streamingCreate("testmodel", "/Users/matt/projects/code/github/technovangelist/dockercondemo/Modelfile", printcreate);
  // try {
  //   await ollama.copy("testmodel", "test2model");
    
  // } catch (error) {
  //   console.log(error);
  // }
  // await ollama.delete("testmodel");
};

test();

