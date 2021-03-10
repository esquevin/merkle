import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts";
import {
  getCreateMerkleTreeForHashMethod,
  getMerkleTreeHeight,
  getMerkleTreeLevel,
  createMerkleTree
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

Deno.test("getMerkleTreeHeight", () => {
  assertEquals(getMerkleTreeHeight(createMerkleTreeWithNoHash(1)), 1);
  assertEquals(getMerkleTreeHeight(createMerkleTreeWithNoHash(1, 2)), 2);
  assertEquals(getMerkleTreeHeight(createMerkleTreeWithNoHash(1, 2, 3)), 3);
  assertEquals(getMerkleTreeHeight(createMerkleTreeWithNoHash(1, 2, 3, 4)), 3);
  assertEquals(
    getMerkleTreeHeight(createMerkleTreeWithNoHash(1, 2, 3, 4, 5)),
    4
  );
});

Deno.test("getMerkleTreeLevel", () => {
  const MT = createMerkleTreeWithNoHash(1, 2, 3, 4);
  assertEquals(getMerkleTreeLevel(MT, 0), ["1234"]);
  assertEquals(getMerkleTreeLevel(MT, 1), ["12", "34"]);
  assertEquals(getMerkleTreeLevel(MT, 2), ["1", "2", "3", "4"]);
});

Deno.test("class wrapper", () => {
  const MT = createMerkleTree(1, 2, 3, 4);
  assertEquals(MT.height(), 3);
  assertEquals(MT.level(2), [
    "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
  ]);
});
