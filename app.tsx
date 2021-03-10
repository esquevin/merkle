import { h, render } from "https://cdn.skypack.dev/preact@10.5.6?dts";
import { useState } from "https://cdn.skypack.dev/preact@10.5.6/hooks?dts";
import { createMerkleTreeSha256 } from "./merkle.ts";
import type { MerkleNode } from "./merkle.ts";

function Node({ node }: { node: MerkleNode | undefined }) {
  if (node === undefined) {
    return null;
  }
  return (
    <div class="text-center spacer-y">
      <code
        class="padding  inline-block m-auto ellipsis overflow-hidden appear rounded shadow-light"
        style={{ fontSize: "10px", maxWidth: "100px" }}
        title={node.hash}
        key={node.hash}
      >
        {node.hash}
      </code>
      <div class="flex flex-equals spacer-x">
        <Node node={node.leftChild} />
        <Node node={node.rightChild} />
      </div>
    </div>
  );
}

function App() {
  const [rawData, setRawData] = useState("1\n2\n3\n4");

  const data = rawData.split(/\r?\n/).filter(Boolean);

  const merkelTree = createMerkleTreeSha256(...data);
  return (
    <div class="flex" style={{ height: "100vh" }}>
      <div class="padding  flex flex-column">
        <h1 class="flex-none">Merkle Tree</h1>
        <label class="flex-1 flex flex-column">
          <div class="flex-none">
            Enter your data, one entry per line, empty lines are discarded.
          </div>
          <textarea
            class="flex-1"
            value={rawData}
            onInput={e => setRawData(e.currentTarget.value)}
          />
        </label>
      </div>

      <div
        class="padding flex-1"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)"
        }}
      >
        <Node node={merkelTree} />
      </div>
    </div>
  );
}

render(<App />, window.document.getElementById("app")!);
