class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
  if (!word || typeof word !== "string") return; // skip invalid words
  let node = this.root;
  for (let char of word.toLowerCase()) {
    if (!node.children[char]) {
      node.children[char] = new TrieNode();
    }
    node = node.children[char];
  }
  node.isEndOfWord = true;
}


  search(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this._collect(node, prefix.toLowerCase());
  }

  _collect(node, prefix) {
    let results = [];
    if (node.isEndOfWord) results.push(prefix);

    for (let char in node.children) {
      results = results.concat(this._collect(node.children[char], prefix + char));
    }
    return results;
  }
}

module.exports = Trie;
