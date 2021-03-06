import { Sha256 } from "https://deno.land/std@0.90.0/hash/sha256.ts";

export type HashMethod = (v: string) => string;

export type MerkleLeaf = {
  hash: string;
  leftChild: undefined;
  rightChild: undefined;
};

export type MerkleNode =
  | {
      hash: string;
      leftChild: MerkleNode;
      rightChild?: MerkleNode;
    }
  | MerkleLeaf;

function mergeNode(
  hashMethod: HashMethod,
  leftChild: MerkleNode,
  rightChild?: MerkleNode
): MerkleNode {
  return {
    hash:
      rightChild === undefined
        ? leftChild.hash
        : hashMethod(leftChild.hash + rightChild.hash),
    leftChild,
    rightChild
  };
}

function computeLevel(
  hashMethod: HashMethod,
  nodes: MerkleNode[]
): MerkleNode[] {
  const level = [];
  for (let i = 0; i < nodes.length; i += 2) {
    const leftChild = nodes[i];
    const rightChild = nodes[i + 1] ?? undefined;
    level.push(mergeNode(hashMethod, leftChild, rightChild));
  }
  return level;
}

function hashSha256(value: string) {
  const hash = new Sha256();
  hash.update(value);
  return hash.toString();
}

export function getCreateMerkleTreeForHashMethod(hashMethod: HashMethod) {
  return <T>(...args: T[]): MerkleNode => {
    // iterate over args to create array of MerkleLeaf
    const leaves = args.map<MerkleLeaf>(arg => ({
      hash: hashMethod(JSON.stringify(arg)),
      leftChild: undefined,
      rightChild: undefined
    }));

    let currentLevel: MerkleNode[] = leaves;
    while (currentLevel.length > 1) {
      currentLevel = computeLevel(hashMethod, currentLevel);
    }
    return currentLevel[0];
  };
}

export function getMerkleTreeHeight(root: MerkleNode) {
  // Can also be computed as Log2(data.length) if you know the data

  if (!root) {
    return 0;
  }
  let height = 1;
  let currentNode = root;
  while (currentNode.leftChild !== undefined) {
    height += 1;
    currentNode = currentNode.leftChild;
  }
  return height;
}

export function getMerkleTreeLevel(
  root: MerkleNode | undefined,
  level: number
): string[] {
  if (root === undefined) {
    return [];
  }

  if (level === 0) {
    return [root.hash];
  }

  return [
    getMerkleTreeLevel(root.leftChild, level - 1),
    getMerkleTreeLevel(root.rightChild, level - 1)
  ].flat();
}

export const createMerkleTreeSha256 = getCreateMerkleTreeForHashMethod(
  hashSha256
);

class MerkleTree<T> {
  root: MerkleNode;

  constructor(...args: T[]) {
    this.root = createMerkleTreeSha256(...args);
  }
  height() {
    return getMerkleTreeHeight(this.root);
  }

  level(level: number) {
    return getMerkleTreeLevel(this.root, level);
  }
}

export function createMerkleTree<T>(...args: T[]) {
  return new MerkleTree<T>(...args);
}
