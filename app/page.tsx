"use client";

import styles from "../styles/page.module.css";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider as SandpackLayout,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

const code = `import { useState } from "react";
import "./index.scss"

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <main>
      <h1>Hello</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </main>
  );
}`;

const sass = `body {
  margin: 0;
}

main {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  background-color: #00000011;
  padding: 0 4px;
  border: 1px solid #000000aa;
  border-radius: 5px;
  &:hover {
    background-color: #00000024;
  }
}`;

type PrettierProps = {
  codemirrorInstance: MutableRefObject<any>;
  runFormat: boolean;
  setRunFormat: (runFormat: boolean) => void;
};

// https://codesandbox.io/s/1po91?file=/src/App.js
const Prettier = ({
  codemirrorInstance,
  runFormat,
  setRunFormat,
}: PrettierProps) => {
  const [prettierCode, setPrettierCode] = useState<string | null>("");
  const { sandpack } = useSandpack();
  const activeCode = useActiveCode();

  const runPrettier = useCallback(() => {
    setRunFormat(false);
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: "babel",
          plugins: [parserBabel],
        });

        setPrettierCode(formatted);
      } catch {}
    }
  }, [activeCode.code]);

  useEffect(() => {
    if (runFormat) {
      const debounce = setTimeout(runPrettier, 0);
      return () => {
        setRunFormat(false);
        clearInterval(debounce);
      };
    }
  }, [runFormat]);

  useEffect(() => {
    if (prettierCode) {
      const cmInstance = codemirrorInstance.current.getCodemirror();

      if (cmInstance) {
        const trans = cmInstance.state.update({
          selection: cmInstance.state.selection,
          changes: {
            from: 0,
            to: cmInstance.state.doc.length,
            insert: prettierCode,
          },
        });

        cmInstance.update([trans]);
      }
      // @ts-ignore
      sandpack.updateFile(sandpack.activePath, prettierCode);

      setPrettierCode(null);
    }
  }, [prettierCode]);

  return null;
};

export default function Home() {
  const codemirrorInstance = useRef();
  const [runFormat, setRunFormat] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setRunFormat(true);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React playground</h1>
        <p className={styles.description}>
          Supports Tailwind CSS and Sass. <br></br>Prettier on{" "}
          <kbd className="rounded-md border border-[#474747] bg-[#212121] p-[2px]">
            ctrl + s
          </kbd>{" "}
          (<i>in progress</i>)
        </p>

        <SandpackProvider
          template="react"
          files={{
            "/App.js": code,
            "/index.scss": sass,
          }}
          customSetup={{
            dependencies: {
              sass: "^1.56.1",
            },
          }}
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
            ],
          }}
        >
          <SandpackLayout
            theme={sandpackDark}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              minHeight: "400px",
              maxHeight: "400px",
            }}
          >
            <SandpackCodeEditor
              //@ts-ignore
              ref={codemirrorInstance}
              style={{
                minWidth: "420px",
                maxWidth: "420px",
              }}
              wrapContent={true}
            />
            <Prettier
              codemirrorInstance={codemirrorInstance}
              runFormat={runFormat}
              setRunFormat={setRunFormat}
            />
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{
                minWidth: "70%",
                maxWidth: "70%",
              }}
            />
          </SandpackLayout>
        </SandpackProvider>
      </main>
    </div>
  );
}
