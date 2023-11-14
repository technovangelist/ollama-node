import { Ollama } from './ollama';

// function durToSeconds(nanoseconds: number) {
//   let seconds = nanoseconds / 1e9;  // Convert nanoseconds to seconds
//   return parseFloat(seconds.toFixed(2));  // Format to two decimal points and return
// }

async function test() {
  const ollama = new Ollama();
  // const models = await ollama.listModels(); 
  // console.log(models); 
  // const mod = await ollama.setModel("llama2");

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
  const printlog = (status: string) => {
    console.log(status);
  }

  const printline = (status: string) => {
    process.stdout.moveCursor(0, -1) // up one line
    process.stdout.clearLine(1)
    // process.stdout.write("\r" + status)
    console.log(status);
  }
  // const params = olla/ma.showParameters();

  // const pull = await ollama.streamingPull("codellama:7b-instruct", printline)
  // console.log(params["temperature"]);
  let now = Date.now();
  // const test = await ollama.generate("why is the sky blue");
  // await ollama.generateEmbed("saikatkumardey/tinyllama", "Once upon a time, there were three little pigs named Porky, Percy, and Peter. They lived in a smallvillage near a beautiful river that flowed gently through the landscape.One sunny day, the pigsdecided to skip and jump over the river to see what was on the other side.    Porky, the first little pig, was very excited about the adventure and skipped and jumped with greatenthusiasm.He jumped so high that he almost reached the opposite bank of the river.However, as he  landed, he realized that he had forgotten his towel, and now he was wet and cold. Percy, the second little pig, was not as excited about the adventure, but he still wanted to join in  on the fun.He skipped and jumped with caution, making sure not to get too close to the river's edge.As he reached the other side, he found a delicious looking fruit tree and decided to take a break andenjoy his snack. Peter, the third little pig, was the most cautious of them all.He had heard stories about crocodilesand other dangerous creatures that lived in the river, so he wanted to be extra careful.He skippedand jumped slowly and carefully, looking for any potential dangers along the way.When he reached theother side, he was amazed by what he saw  a beautiful meadow filled with colorful flowers and buzzing  bees.As the pigs continued their journey, they encountered many obstacles, such as steep cliffs, deep  valleys, and thick forests.But no matter how difficult the terrain became, they always found a way toskip and jump over it.And with each new challenge, they grew stronger and more determined.After many hours of skipping and jumping, the pigs finally reached their destination  a beautiful sandy beach on the other side of the river.They were exhausted but exhilarated by their adventure andcouldn't wait to tell everyone about their incredible journey. And so, they sat down on the beach andshared stories of their exciting trip with anyone who would listen.From that day forward, the three little pigs became known as the most adventurous and determined  creatures in the land.They proved that with a little bit of courage and determination, anything is  possible even skipping and jumping over a mighty river.And whenever they looked out at the water,    they couldn't help but smile at the memories of their incredible journey.");
  // console.log(Date.now() - now);
  // console.log(test);

  const models = (await ollama.listModels()).models;

  const setandgen = async (model: string) => {

  }
  // console.log(models)
  models.forEach(async model => {
    setTimeout(() => {
      console.log(model)

    }, 50);
    const ollama2 = new Ollama();
    // await Promise.all([
    await ollama2.setModel(model)
    await ollama2.streamingGenerate("Why is the sky blue?", print)
    // ])
  })
  // for (let index = 0; index < models.length; index++) {
  //   const element = models[index];
  //   promises.push(ollama.setModel(element));
  //   console.log(element);
  //   // try {
  //   promises.push(ollama.streamingGenerate("Why is the sky blue?", print))

  //   // } catch (error) {
  //   //   console.log(error);
  //   // }

  // }
  // // console.log(promises)
  // await Promise.all(promises);


  // await ollama.streamingGenerate("write a funny story about why the sky is blue. the story should be 5000 words at least", print);  // const first = await ollama.generate("why is the sky blue")
  // console.log(first.output);

  // const second = await ollama.generate("is it ever green");
  // console.log(second.output);

  // // ollama.setContext([]);

  // const third = await ollama.generate("how about red");
  // console.log(third.output);

  // await ollama.streamingCreate("testmodel", "/Users/matt/projects/code/github/technovangelist/dockercondemo/Modelfile", printcreate);
  // try {
  //   await ollama.copy("testmodel", "test2model");

  // } catch (error) {
  //   console.log(error);
  // }
  // await ollama.delete("testmodel");
};

test();

