import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts";
import {
  getCreateMerkleTreeForHashMethod,
} from "./merkle.ts";

const createMerkleTreeWithNoHash = getCreateMerkleTreeForHashMethod(
  (v: string) => v
);

Deno.test("createEmptyMerkleTree", () => {
  assertEquals(createMerkleTreeWithNoHash(), undefined);
});

Deno.test("createMerkleTree", () => {
  assertEquals(createMerkleTreeWithNoHash(1), {
    hash: "1",
    leftChild: undefined,
    rightChild: undefined
  });
});

Deno.test("createMerkleTree 2", () => {
  assertEquals(createMerkleTreeWithNoHash(1, 2, 3, 4), {
    hash: "1234",
    leftChild: {
      hash: "12",
      leftChild: {
        hash: "1",
        leftChild: undefined,
        rightChild: undefined
      },
      rightChild: {
        hash: "2",
        leftChild: undefined,
        rightChild: undefined
      }
    },
    rightChild: {
      hash: "34",
      leftChild: {
        hash: "3",
        leftChild: undefined,
        rightChild: undefined
      },
      rightChild: {
        hash: "4",
        leftChild: undefined,
        rightChild: undefined
      }
    }
  });
});

Deno.test("not a power of 2", () => {
  assertEquals(createMerkleTreeWithNoHash(1, 2, 3, 4, 5), {
    hash: "12345",
    leftChild: {
      hash: "1234",
      leftChild: {
        hash: "12",
        leftChild: {
          hash: "1",
          leftChild: undefined,
          rightChild: undefined
        },
        rightChild: {
          hash: "2",
          leftChild: undefined,
          rightChild: undefined
        }
      },
      rightChild: {
        hash: "34",
        leftChild: {
          hash: "3",
          leftChild: undefined,
          rightChild: undefined
        },
        rightChild: {
          hash: "4",
          leftChild: undefined,
          rightChild: undefined
        }
      }
    },
    rightChild: {
      hash: "5",
      leftChild: {
        hash: "5",
        leftChild: {
          hash: "5",
          leftChild: undefined,
          rightChild: undefined
        },
        rightChild: undefined
      },
      rightChild: undefined
    }
  });
});
