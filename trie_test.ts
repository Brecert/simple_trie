import { assertEquals } from "https://deno.land/std@v0.50.0/testing/asserts.ts";
import SimpleTrie from "./trie.ts";

Deno.test("testing example", () => {
  const trie = new SimpleTrie<string>();

  const index = trie.add("/index.html", "Hello World!");
  const cat = trie.add("/lib/cat.js", "cat cat cat!");
  const dog = trie.add("/lib/dog.js", "dog dog dog!");
  const test = trie.add("/test/*", "test");
  const test_yes = trie.add("/test/*/yes", "yes");
  const testBree = trie.add("/test/bree", "bree");

  assertEquals(
    trie.get("/index.html"),
    { value: "Hello World!", params: [], node: index },
  );

  assertEquals(
    trie.get("/lib/cat.js"),
    { value: "cat cat cat!", params: [], node: cat },
  );

  assertEquals(
    trie.get("/lib/dog.js"),
    { value: "dog dog dog!", params: [], node: dog },
  );

  assertEquals(
    trie.get("/test/hi"),
    { value: "test", params: ["hi"], node: test },
  );

  assertEquals(
    trie.get("/test/hi/yes"),
    { value: "yes", params: ["hi"], node: test_yes },
  );

  assertEquals(
    trie.get("/test/bree"),
    { value: "bree", params: [], node: testBree },
  );

  assertEquals(
    trie.get("/test/a/b/c"),
    { value: undefined, params: [], node: undefined },
  );
});

const trie: SimpleTrie<string> = new SimpleTrie();

Deno.test("add wildcard and get wildcard", () => {
  let child = trie.add("/get/*/*", "wild wild");
  assertEquals(child.leaf, true);
  assertEquals(child.value, "wild wild");
  assertEquals(child.path, ["get", "*", "*"]);

  let output = trie.get("/get/cat");
  assertEquals(output.value, undefined);
  assertEquals(output.params, ["cat"]);
  assertEquals(output.node?.leaf, false);
  assertEquals(
    output,
    { value: undefined, params: ["cat"], node: output.node },
  );
  assertEquals(
    trie.get("/get/cat/sb"),
    { value: "wild wild", params: ["cat", "sb"], node: child },
  );
  assertEquals(trie.leaf, false);
  assertEquals(trie.path, []);
});

// adding a named, non-wildcard node to the trie should take precedence when matching
Deno.test("add single and getting single has precedence over wildcard", () => {
  let child = trie.add("/get/cat", "cat");
  assertEquals(child.leaf, true);
  assertEquals(child.value, "cat");
  assertEquals(child.path, ["get", "cat"]);

  assertEquals(
    trie.get("/get/cat"),
    { value: "cat", params: [], node: child },
  );
});

Deno.test("add single and wildcard together", () => {
  let child = trie.add("/get/*/cat", "wild cat");
  assertEquals(
    trie.get("/get/test/cat"),
    { value: "wild cat", params: ["test"], node: child },
  );
});
