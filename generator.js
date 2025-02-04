function sRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function sRandomInt(seed, max, min) {
  seed = seed || 0;
  min = min || 0;
  return min + Math.floor(sRandom(seed) * (max - min));
}

function draw(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class Trie {
  static insertNode(node, item) {
    if (node[item]) {
      node[item].C += 1;
    } else {
      node[item] = { C: 1 };
    }
    return node;
  }

  static removeNode(node, item) {
    if (node[item]) {
      node[item].C -= 1;
    }
    return node;
  }

  static addWord(node, word) {
    let currentNode = node;
    for (let i = 0; i < word.length; i++) {
      currentNode = Trie.insertNode(currentNode, word[i]);
      currentNode = currentNode[word[i]];
    }
    // Add the empty string to record word endings
    currentNode = Trie.insertNode(currentNode, "");
    return node;
  }

  static removeWord(node, word) {
    if (!Trie.contains(node, word)) {
      return false;
    }
    let currentNode = node;
    for (let i = 0; i < word.length; i++) {
      currentNode = Trie.removeNode(currentNode, word[i]);
      currentNode = currentNode[word[i]];
    }
    // Add the empty string to record word endings
    currentNode = Trie.removeNode(currentNode, "");
    return node;
  }

  static contains(node, word) {
    let currentNode = node;
    for (let i = 0; i < word.length; i++) {
      if (!currentNode[word[i]]) {
        return false;
      }
      currentNode = currentNode[word[i]];
    }
    // Require completed words
    if (!currentNode[""] || currentNode[""].C < 1) {
      return false;
    }
    return true;
  }

  static draw(node, seed) {
    const newSeed = seed || Math.floor(Math.random() * 10000000000);
    let total = 0;
    const keys = Object.keys(node).filter(key => key !== "C");
    for (let i = 0; i < keys.length; i++) {
      total += node[keys[i]].C;
    }
    let target = sRandomInt(newSeed, total + 1);
    let index = 0;
    target -= node[keys[0]].C;
    while (target > 0) {
      index += 1;
      target -= node[keys[index]].C;
    }
    return keys[index];
  }

  static randomWord(node, seed) {
    const newSeed = seed || Math.floor(Math.random() * 10000000000);
    const next = Trie.draw(node, newSeed);
    if (next !== "") {
      return next + Trie.randomWord(node[next], seed + 1);
    } else {
      return next;
    }
  }
}

/* eslint-disable */
function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
/* eslint-enable */

function capitalizeName(name) {
    const lower = name.toLowerCase();
    if (lower[0] === "m" && lower[1] === "c") {
      return "Mc" + lower.charAt(2).toUpperCase() + lower.slice(3);
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/***************/

const SLICE_LENGTH = 5;

function process(list) {
  const prefixes = {};
  const suffixes = {};
  for (let i = 0; i < list.length; i++) {
    list[i] = list[i].toLowerCase();
  }
  
  for (let i = 0; i < list.length; i++) {
    Trie.addWord(prefixes, list[i].toLowerCase().slice(0, SLICE_LENGTH));
  }
  
  for (let i = 0; i < list.length; i++) {
    for (let j = 1; j < list[i].length; j++) {
      Trie.addWord(suffixes, list[i].toLowerCase().slice(j, j + SLICE_LENGTH));
    }
  }
  return {
    prefixes: prefixes,
    suffixes: suffixes
  };
}

const androgynousTries = process(femaleNames.concat(maleNames));
const femaleTries = process(femaleNames);
const maleTries = process(maleNames);
const lastTries = process(lastNames);
const femaleTries100 = process(femaleNames.slice(0,100));
const maleTries100 = process(maleNames.slice(0,100));
const lastTries100 = process(lastNames.slice(0,100));

document.getElementById('clicker').onclick = function() {
  let fSource = document.getElementById('fsource').value;
  let lSource = document.getElementById('lsource').value;
  let fname = "";
  let lname = "";

  if (fSource === "All Fantasy Names") {
    let roll = Math.random();
    if (roll < 0.33) {
      fname = newName(femaleTries, 1);
    } else if (roll < 0.66) {
      fname = newName(maleTries, 1);
    } else {
      fname = newName(androgynousTries, 1);
    }
  } else if (fSource === "Androgynous Fantasy Names") {
    fname = newName(androgynousTries, 1);
  } else if (fSource === "Feminine Fantasy Names") {
    fname = newName(femaleTries, 1);
  } else if (fSource === "Masculine Fantasy Names") {
    fname = newName(maleTries, 1);
  } else if (fSource === "Feminine Fantasy Names (Top 100)") {
    fname = newName(femaleTries100, 1);
  } else if (fSource === "Masculine Fantasy Names (Top 100)") {
    fname = newName(maleTries100, 1);
  } else if (fSource === "Popular Real Names") {
    fname = anyName();
  } else if (fSource === "Popular Androgynous Real Names") {
    fname = androgynousName();
  } else if (fSource === "Popular Feminine Real Names") {
    fname = femaleName();
  } else if (fSource === "Popular Masculine Real Names") {
    fname = maleName();
  } else if (fSource === "Unpopular Real Names") {
    if (Math.random() > 0.5) {
      fname = draw(femaleNames);
    } else {
      fname = draw(maleNames);
    }
  } else if (fSource === "Unpopular Androgynous Real Names") {
    fname = draw(androgynousNames);
  } else if (fSource === "Unpopular Feminine Real Names") {
    fname = draw(femaleNames);
  } else if (fSource === "Unpopular Masculine Real Names") {
    fname = draw(maleNames);
  }

  if (lSource === "All Fantasy Names") {
    lname = newName(lastTries, 1);
  } else if (lSource === "Top 100 Fantasy Names") {
    lname = newName(lastTries100, 1);
  } else if (lSource === "Popular Real Names") {
    lname = lastName();
  } else if (lSource === "Unpopular Real Names") {
    lname = draw(lastNames);
  }


  fname = capitalizeName(fname);
  lname = capitalizeName(lname);
  document.getElementById('trie').innerHTML = fname + " " + lname;
}

function newName(nameTries, minLength) {
  let name = Trie.randomWord(nameTries.prefixes);
  do {
    name += Trie.randomWord(nameTries.suffixes[name.slice(-1)]);
  } while (name.length < minLength);
  return name;
}


// Name selectors
function anyName() {
  if (Math.random() > 0.5) {
    return femaleName();
  } else {
    return maleName();
  }
}

function androgynousName() {
  let total = Math.floor(Math.random() * androgynousNameTotal);
  let i = 0;
  while (total > 0) {
      total -= androgynousWeights[i];
      i++;
  }
  return androgynousNames[i];
}

function femaleName() {
  let total = Math.floor(Math.random() * femaleNameTotal);
  let i = 0;
  while (total > 0) {
      total -= femaleWeights[i];
      i++;
  }
  return femaleNames[i];
}

function maleName() {
    let total = Math.floor(Math.random() * maleNameTotal);
    let i = 0;
    while (total > 0) {
        total -= maleWeights[i];
        i++;
    }
    return maleNames[i];
}

function lastName() {
    let total = Math.floor(Math.random() * lastNameTotal);
    let i = 0;
    while (total > 0) {
        total -= lastWeights[i];
        i++;
    }
    return lastNames[i];
}

function calculateAndrogynous() {
  let androgynousTotal = 0;
  let androgynousNames = [];
  let androgynousWeights = [];
  let androgynousData = [];
  for (let i = 0; i < femaleNames.length; i++) {
    let mPosition = maleNames.indexOf(femaleNames[i]);
    if (mPosition !== -1) {
      androgynousData.push(
        {
          name: femaleNames[i],
          weight: Math.min(femaleWeights[i], maleWeights[mPosition])
        }
      );
    }
  }
  androgynousData.sort(function(a, b) {
    return ((a.weight > b.weight) ? -1 : ((a.weight == b.weight) ? 0 : 1));
});
  for (let i = 0; i < androgynousData.length; i++) {
    const element = androgynousData[i];
    androgynousNames.push(element.name);
    androgynousWeights.push(element.weight);
    androgynousTotal += element.weight;
  }
  return androgynousTotal;
}

// download(JSON.stringify(calculateAndrogynous()), 'androgynousData.txt', 'text/plain');