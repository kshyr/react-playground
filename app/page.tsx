"use client";

import styles from "../styles/page.module.css";
import { Sandpack } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

const code = `export default function App() {
  return <h1>Hello Sandpack</h1>
}`;


export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React playground</h1>
        <Sandpack
          theme={sandpackDark}
          template="react"
          files={{
            "/App.js": code,
          }}
        />
      </main>
    </div>
  );
}
