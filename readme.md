# Simple JS library to work with Ollama

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

## Set System Prompt

```typescript
ollama.setSystemPrompt("You are an AI assistant.");
```

Sets the system prompt to use with this model. Overrides anything set in the Modelfile.

## Set Template

```typescript
ollama.setTemplate("this is a template")
```

## Add a Parameter

```typescript
ollama.addParameter("stop", "User:")
```

## Delete a Parameter

```typescript
ollama.deleteParameter("stop", "User:")
```

## Delete a Parameter by Name

```typescript
ollama.deleteParameterByName("stop");
```

Deletes all parameters with that name.

## Delete All Parameters

```typescript
ollama.deleteAllParameters();
```

## Show All Parameters

```typescript
const params = ollama.showParameters();
```

## Show System Prompt

```typescript
const sprompt = await ollama.showSystemPrompt()
```

Useful if you want to update the system prompt based on the existing one.

## Show Template

```typescript
const template = ollama.showTemplate();
```

## Show Model

```typescript
const model = ollama.showModel();
```

Shows the current model name

## Show Model Info

```typescript
const info = await ollama.showModelInfo();
```

Returns parameters, template, system prompt for the current model.

## List Models

```typescript
const models = await ollama.listModels();
```

Lists all local models already downloaded.

## Generate

```typescript
const output = await ollama.generate("Why is the sky blue?");
```


##


This is not in a finished state. It is absolutely a work in progress. I started putting this together and then later saw someone put out another library on npm. bummer. but cool that it's exciting for other folks.

I just want an easy way to consume this in some examples.

I'll flesh it out soon.
