# Simple JS library to work with Ollama
typescript
[api](ollama-node/docs/api.md)
[api2](./docs/api.md)

The simplest JavaScript library for the easiest way to run LLMs.

This is not the official library (we don't have one), but I am one of the maintainers of Ollama.

## Get started

```typescript
import { Ollama } from 'ollama-node';

const ollama = new Ollama();
await ollama.setModel("llama2");

// callback to print each word 
const print = (word: string) => {
  process.stdout.write(word);
}
await ollama.streamingGenerate("why is the sky blue", print);
```

## Create the Ollama Object

```typescript
const ollama = new Ollama();
```

Creates the Ollama object. All methods are called from this object.

### Optional Parameter

Hostname - defaults to 127.0.0.1

## Set Model

```typescript
await ollama.setModel("llama2";)
```

Sets the model to use for Generation. Unless you override anything, it will use the template, parameters, and system prompt from the Modelfile.


## Working with the Model

### Set System Prompt

```typescript
ollama.setSystemPrompt("You are an AI assistant.");
```

Sets the system prompt to use with this model. Overrides anything set in the Modelfile.

### Set Template

```typescript
ollama.setTemplate("this is a template")
```

### Add a Parameter

```typescript
ollama.addParameter("stop", "User:")
```

### Delete a Parameter

```typescript
ollama.deleteParameter("stop", "User:")
```

### Delete a Parameter by Name

```typescript
ollama.deleteParameterByName("stop");
```

Deletes all parameters with that name.

### Delete All Parameters

```typescript
ollama.deleteAllParameters();
```

### Show All Parameters

```typescript
const params = ollama.showParameters();
```

### Show System Prompt

```typescript
const sprompt = await ollama.showSystemPrompt()
```

Useful if you want to update the system prompt based on the existing one.

### Show Template

```typescript
const template = ollama.showTemplate();
```

### Show Model

```typescript
const model = ollama.showModel();
```

Shows the current model name

### Show Model Info

```typescript
const info = await ollama.showModelInfo();
```

Returns parameters, template, system prompt for the current model.

## List All the Models Already Pulled

```typescript
const models = await ollama.listModels();
```

Lists all local models already downloaded.

## Generate (Ask a question and get an answer back)

```typescript
const output = await ollama.generate("Why is the sky blue?");
```

This will run the generate command and return the output all at once. The output is an object with the output and the stats.

If you want the streaming version, see below.

## Streaming Generate

This is a streaming version of generate, but you don't need to know anything about streaming. Just write a callback function that does what you want to happen.

```typescript
const printword = (word: string) => {
  process.stdout.write(word);
}

const printline = (line: string)

await ollama.streamingGenerate("why is the sky blue", printword, null, printline)
```

There are four potential callbacks, all of which are optional, though their positions matter. Use null if you want a later one and not an earlier one.

The Callbacks are:

- responseOutput: outputs just the token in the response.
- contextOutput: outputs the context at the end.
- fullResponseOutput: outputs the full response object.
- statsOutput: outputs the stats object at the {% endif %}


---

Other functions I need to document

- create
- streamingCreate
- streamingPull
- streamingPush
- copy
- 



This is not in a finished state. It is absolutely a work in progress. I started putting this together and then later saw someone put out another library on npm. bummer. but cool that it's exciting for other folks.

I just want an easy way to consume this in some examples.

I'll flesh it out soon.
