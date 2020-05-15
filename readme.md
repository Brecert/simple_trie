# Simple Trie

This module provides a very simple trie datastructure, primarily made to be used for routing tools.

# Example

```ts
import Trie from 'https://raw.githubusercontent.com/brecert/simple_trie/master/trie.ts'

const trie = new Trie<string>()

trie.add("/index.html", "Hello World!")
trie.add("/lib/cat.js", "cat cat cat!")
trie.add("/lib/dog.js", "dog dog dog!")
trie.add("/test/*", "test!")
trie.add("/test/*/yes", "yes")
trie.add("/test/bree", "bree")

trie.get("/index.html")
// => returns { value: "Hello World!", params: [], node: Trie }

trie.get("/lib/cat.js")
// => returns { value: "cat cat cat!", params: [], node: Trie }

trie.get("/lib/dog.js")
// => returns { value: "dog dog dog!", params: [], node: Trie }

trie.get("/test/hi")
// => returns { value: "test!", params: ["hi"], node: Trie }

trie.get("/test/hi/yes")
// => returns { value: "yes", params: ["hi"], node: Trie }

trie.get("/test/bree")
// => returns { value: "bree", params: [], node: Trie }

trie.get("/test/e/f")
// => returns { value: undefined, params: [], node: undefined } 
```