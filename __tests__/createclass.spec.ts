import { Ollama } from '../src/ollama';

describe("New Ollama", () => {
  it("creates the new client", () => {
    const ollama = new Ollama();
    expect(ollama.showHost()).toBe("127.0.0.1");
  })

  it("creates a client that connects to 192.168.0.1", () => {
    const ollama = new Ollama("192.168.0.1")
    expect(ollama.showHost()).toBe("192.168.0.1")
  })

  it('creates a client that connects to localhost', () => {
    const ollama = new Ollama("localhost");
    expect(ollama.showHost()).toBe("127.0.0.1");
  })

  it("sets the model", async () => {

    const ollama = new Ollama();
    await ollama.setModel("llama2");
    const model = ollama.showModel();

    expect(model).toBe("llama2");
  })

  it('sets the template', async () => {
    const ollama = new Ollama();
    await ollama.setModel("llama2");
    ollama.setTemplate('"""this is the template"""');
    const template = ollama.showTemplate();
    expect(template).toBe('"""this is the template"""');
  })

  it('sets a parameter', async () => {
    const ollama = new Ollama();
    await ollama.setModel("llama2");
    ollama.deleteAllParameters();
    ollama.addParameter("seed", 1234);
    const parameters = ollama.showParameters();
    expect(parameters).toStrictEqual({ seed: 1234 });
  })

  it('sets a stop parameter', async () => {
    const ollama = new Ollama();
    await ollama.setModel("llama2");
    ollama.deleteAllParameters();
    ollama.addParameter("stop", 'blah');
    const parameters = ollama.showParameters();
    expect(parameters).toStrictEqual({ stop: ["blah"] });
  })

  it('deletes a stop parameter', async () => {
    const ollama = new Ollama();
    await ollama.setModel("llama2");
    ollama.deleteAllParameters();
    ollama.addParameter("stop", 'blah');
    const parameters = ollama.showParameters();
    ollama.deleteParameter("stop", "blah")
    expect(parameters).toStrictEqual({ stop: [] });
  })
})