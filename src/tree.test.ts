import { describe, it, expect } from "vitest";
import { toTree, eachTree, findTree } from "./tree";

interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  nodes?: TreeNode[];
  parentId?: number | null;
}

describe("tree utilities", () => {
  // 测试数据
  const flatData: Array<{
    id: number;
    parentId: number | null;
    name: string;
  }> = [
    { id: 1, parentId: null, name: "Root" },
    { id: 2, parentId: 1, name: "Child 1" },
    { id: 3, parentId: 1, name: "Child 2" },
    { id: 4, parentId: 2, name: "Grandchild 1" },
    { id: 5, parentId: 2, name: "Grandchild 2" },
  ];

  const treeData: TreeNode[] = [
    {
      id: 1,
      name: "Root",
      parentId: null,
      children: [
        {
          id: 2,
          name: "Child 1",
          parentId: 1,
          children: [
            { id: 4, name: "Grandchild 1", parentId: 2 },
            { id: 5, name: "Grandchild 2", parentId: 2 },
          ],
        },
        { id: 3, name: "Child 2", parentId: 1 },
      ],
    },
  ];

  describe("toTree", () => {
    it("should convert flat data to tree structure", () => {
      const result = toTree({
        data: flatData,
        idField: "id",
        parentIdField: "parentId",
      });

      expect(result).toEqual(treeData);
    });

    it("should handle empty data", () => {
      const result = toTree({ data: [] });
      expect(result).toEqual([]);
    });

    it("should handle custom children field name", () => {
      const result = toTree({
        data: flatData,
        idField: "id",
        parentIdField: "parentId",
        childrenField: "nodes",
      });

      expect((result[0] as TreeNode).nodes).toBeDefined();
    });
  });

  describe("eachTree", () => {
    it("should traverse all nodes", () => {
      const visited: string[] = [];
      eachTree(treeData, (node) => {
        visited.push(node.name);
      });

      expect(visited).toEqual([
        "Root",
        "Child 1",
        "Grandchild 1",
        "Grandchild 2",
        "Child 2",
      ]);
    });

    it("can stop traversal by returning false", () => {
      const visited: string[] = [];
      eachTree(treeData, (node) => {
        visited.push(node.name);
        if (node.name === "Child 1") return false;
      });

      expect(visited).toEqual(["Root", "Child 1"]);
    });
  });

  describe("findTree", () => {
    it("should find node by condition", () => {
      const node = findTree(treeData, (n) => n.id === 4);
      expect(node?.name).toBe("Grandchild 1");
    });

    it("should return undefined when not found", () => {
      const node = findTree(treeData, (n) => n.id === 99);
      expect(node).toBeUndefined();
    });

    it("should handle empty data", () => {
      const node = findTree<TreeNode>([], (n) => n.id === 1);
      expect(node).toBeUndefined();
    });
  });
});
