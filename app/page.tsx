"use client";

import styles from "../styles/page.module.css";
import { Sandpack } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

const code = `export default function App() {
  return <h1>Hello Sandpack</h1>
}`;

const sass = `body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
main {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@for $i from 1 to 6 {
  .paragraph-#{$i} {
    font-size: 10px*$i;
  }
}`;

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React playground</h1>
        <p className={styles.description}>Supports Tailwind CSS and Sass</p>
        <Sandpack
          theme={sandpackDark}
          template="react"
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
            ],
          }}
          customSetup={{
            dependencies: {
              sass: "^1.56.1",
            },
          }}
          files={{
            "/App.js": code,
            "/index.scss": sass,
          }}
        />
      </main>
    </div>
  );
}
