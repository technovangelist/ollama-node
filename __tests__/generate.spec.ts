import { Ollama } from '../src/ollama';
import { jest } from '@jest/globals';

describe("Ollama Generate", () => {
  // const ollama = new Ollama();
  it("should be true", () => {
    expect(1).toBe(1);

  })
  // it("should generate", async () => {
  //   await ollama.setModel("llama2")
  //   ollama.addParameter("seed", 1234)
  //   const first = await ollama.generate("Tell me a color the opposite of blue in a single word. Do not answer in a sentence.")
  //   expect(first.output).toBeDefined();
  //   expect(first.output).toBe(" Orange" )
  //   expect(first.output.length).toBeGreaterThan(0);
  // })
})