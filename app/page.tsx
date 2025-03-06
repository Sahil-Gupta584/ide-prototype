'use client'
import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";
import { files } from "./files";

export default function Home() {
  const webcontainerRef = useRef<WebContainer | null>(null);
  const [output, setOutput] = useState<string>("");

  window.addEventListener('load', async () => {
    const textareaEl = document.querySelector('textarea')
    async function initWbc() {
      const iframeEl = document.querySelector('iframe')
      if (webcontainerRef.current || !iframeEl || !textareaEl) return;

      
      const webcontainer = await WebContainer.boot();
      await webcontainer.mount(files)
      textareaEl.value = files['index.js'].file.contents;

      webcontainer.on('server-ready', (port, url) => {
        iframeEl.src = url;
      });

      webcontainerRef.current = webcontainer;
      runCommand('node', ['-v']);
    }

    initWbc();

    textareaEl?.addEventListener('input', async () => {
      if (!webcontainerRef.current) return
      await webcontainerRef.current.fs.writeFile('/index.js', textareaEl.value);

    })


  })

  function reportOutput(output: string) {
    setOutput((prev) => prev + "\n" + output);
    console.log(output);
  }

  async function runCommand(cmd: string, args: string[]) {
    if (!webcontainerRef.current) return;
    const process = await webcontainerRef.current.spawn(cmd, args);

    process.output.pipeTo(new WritableStream({
      write(chunk) {
        reportOutput(chunk);
      }
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("cmd") as string;
    const cmdArgs = input.split(" ");
    const cmd = cmdArgs[0];
    const args = cmdArgs.slice(1);

    console.log(cmd, args);
    runCommand(cmd, args);
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-5">
      <div className="flex  justify-center gap-4">
        <textarea className="h-[400px] w-[400px] bg-black text-white overflow-y-scroll p-2 rounded-md resize-none">

        </textarea>

        <iframe className="h-[400px] border"></iframe>
      </div>
      <pre>
        <code id="outputPanel" className="flex flex-col-reverse h-[200px] w-[700px] bg-black text-white overflow-y-scroll">
          {output}
        </code>
        <form onSubmit={handleSubmit}>
          <input name="cmd" id="cmd" className="border-2 bg-gray-800 p-2 text-white grow" />
          <button type="submit">Submit</button>
        </form>
      </pre>
    </div>
  );
}
