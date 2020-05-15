function parsePath(path: string): string[] {
  return path.split("/").slice(1);
}

export interface ISimpleTrieGetResult<T> {
  node?: Trie<T>;

  value?: T;

  /** the matched wildcards in order of when matched */
  params: string[];
}

export interface ISimpleTrieParams {
  /** the function to use when splitting the path into parts */
  pathParser: (path: string) => string[];
  wild: string;
}

export class Trie<V> {
  kids: Map<string, Trie<V>> = new Map();
  leaf = false;
  opts: ISimpleTrieParams;
  value?: V;

  constructor(
    { pathParser = parsePath, wild = "*" }: Partial<ISimpleTrieParams> = {},
    public path: string[] = [],
  ) {
    this.opts = { pathParser, wild: wild };
  }

  get(path: string): ISimpleTrieGetResult<V> {
    const keys = this.opts.pathParser(path);
    let node: Trie<V> | undefined = this;
    let last: Trie<V> | undefined = this.leaf ? this : undefined;
    let params = [];
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let lastNode: Trie<V> = node;
      node = node.kids.get(key);
      if (typeof node === "undefined") {
        node = lastNode.kids.get(lastNode.opts.wild);
        params.push(key);
      }
      if (node !== undefined) {
        if (node.leaf) {
          last = node;
        }
      } else {
        break;
      }
    }
    return {
      value: node?.value,
      params: node ? params : [],
      node: node,
    };
  }

  add(path: string, value: V) {
    const keys = this.opts.pathParser(path);
    let node: Trie<V> = this;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let child = node.kids.get(key);
      if (typeof child === "undefined") {
        child = new Trie(this.opts, keys.slice(0, i + 1));
        node.kids.set(key, child);
      }
      node = child;
    }
    node.leaf = true;
    node.value = value;
    return node;
  }
}

export default Trie;
