import type { Course } from "./types";

export const cryptoCourse: Course = {
  id: "crypto",
  title: "Cryptography",
  subtitle: "From Caesar's letters to the math that keeps the AI-era internet honest — learn to keep secrets.",
  icon: "key",
  color: "purple",
  chapters: [
    {
      id: "classic-ciphers",
      title: "Classic Ciphers",
      blurb: "The 2,000-year-old ideas that still power modern encryption.",
      lessons: [
        {
          id: "crp-secrecy-basics",
          title: "Codes vs. Ciphers",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You have a secret. Your friend is across the room, and between you sit a dozen people you don't trust. Welcome to cryptography: the art of scrambling a message so the wrong eyes see only gibberish. Before you scramble anything, you need one distinction that trips up even professional developers: encoding is not encryption.",
            },
            { type: "h", text: "Encoding: a translation, not a secret" },
            {
              type: "p",
              text: "Encoding is a public translation system. Base64 is the classic example: it rewrites data using a small alphabet so it can travel through systems that only like plain, safe characters. Anyone on Earth can run it backwards. No secret, no lock, no protection. It's like writing a note in pig latin and hoping the spies never went to school.",
            },
            {
              type: "code",
              caption: "Encoding anyone can undo",
              code: `const secret = "meet at dawn";
const encoded = btoa(secret); // Base64: just a translation

console.log(encoded); // bWVlZXQgYXQgZGF3bg==
console.log(atob(encoded)); // meet at dawn — no key needed`,
            },
            {
              type: "p",
              text: "Encryption is different. It uses a key: a piece of secret information that controls the scrambling. Without the key, the scrambled text — the ciphertext — is just noise. With the key, everything snaps back into place. The key is the whole game.",
            },
            { type: "h", text: "Kerckhoffs's principle: assume they know" },
            {
              type: "p",
              text: "In the 1880s, Auguste Kerckhoffs wrote down the rule that still runs this field: a cipher should stay secure even if everything about how it works is public knowledge. Only the key needs to stay secret. Hiding the method sounds clever, but methods leak. They get reverse-engineered, sold, and whispered about. When your security depends on nobody ever learning the recipe, one leak collapses the whole system at once.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "This is why AES, the cipher protecting much of the world's traffic, is completely public. Its design has been published and attacked by the best cryptographers for decades. It survives because the security lives in the key, never in the recipe.",
            },
            {
              type: "p",
              text: "So burn in the distinction: encoding translates, encryption locks, and the strength of the lock must live in the key. Every lesson from here is a variation on that sentence — better locks, better keys, and the people trying to pick them.",
            },
          ],
          quiz: [
            {
              q: "A friend encodes a secret note with Base64 and calls it encrypted. What's the problem?",
              options: [
                "Base64 can be reversed by anyone — no secret involved",
                "Base64 only works on numbers",
                "Base64 makes the message longer",
                "Computers cannot decode Base64",
              ],
              answer: 0,
              explain: "Encoding is a public translation — anyone can run it backwards without any secret. Encryption needs a key; Base64 has none.",
            },
            {
              q: "Kerckhoffs's principle says a cipher should stay secure even when...",
              options: [
                "the messages are short",
                "the key is published alongside it",
                "everyone knows exactly how the system works",
                "the attacker gives up",
              ],
              answer: 2,
              explain: "Only the key needs to stay secret. The method can be public — hiding the method is fragile, because methods leak.",
            },
            {
              q: "What is a key, in cryptography?",
              options: [
                "A physical lock on a server rack",
                "A piece of secret information that controls the scrambling",
                "A list of every possible password",
                "A program that removes encryption",
              ],
              answer: 1,
              explain: "The key is the secret input that locks and unlocks the cipher. Same method, different key, completely different output.",
            },
          ],
        },
        {
          id: "crp-caesar",
          title: "The Caesar Cipher",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Julius Caesar had a problem: battle orders had to travel through hostile hands. His fix, about two thousand years ago, was beautifully simple. Shift every letter of the message forward by three. A becomes D, B becomes E, and a courier who intercepts the scroll sees nothing but gibberish.",
            },
            { type: "h", text: "One number is the whole key" },
            {
              type: "p",
              text: "The shift amount is the key. Caesar favored 3, but any shift from 1 to 25 works. Your friend needs exactly one number to read the message: shift every letter back by that much. Watch HELLO go through a shift of 3: H becomes K, E becomes H, each L becomes O, and O becomes R. Out comes KHOOR.",
            },
            {
              type: "table",
              headers: ["Plaintext", "Ciphertext (shift 3)"],
              rows: [
                ["A B C D E F G H I J K L M", "D E F G H I J K L M N O P"],
                ["N O P Q R S T U V W X Y Z", "Q R S T U V W X Y Z A B C"],
                ["HELLO", "KHOOR"],
              ],
            },
            { type: "h", text: "Wrapping past Z" },
            {
              type: "p",
              text: "What happens when a shift runs off the end of the alphabet? It wraps around: after Z comes A again. Computers adore this trick, because it's exactly what the modulo operator does — the percent sign in JavaScript gives you the remainder after division, and remainders naturally loop.",
            },
            {
              type: "code",
              caption: "Wraparound with modulo",
              code: `// Shifting the letter Y forward by 3:
const code = "Y".charCodeAt(0) - 65; // 24 — Y is letter 25, index 24
const shifted = (code + 3) % 26;    // 27 % 26 = 1
console.log(String.fromCharCode(shifted + 65)); // "B"`,
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "When you build the exercise below, test the edges first: Z wrapping around to C, and spaces staying exactly where they are. Edge cases are where ciphers hide their bugs.",
            },
            {
              type: "p",
              text: "Caesar is simple enough to break in your head, and that's exactly why it's the perfect first cipher. It teaches the full anatomy — plaintext, key, ciphertext — and the wraparound arithmetic that every serious cipher still uses underneath. Two thousand years later, the shape survives; only the numbers got bigger.",
            },
          ],
          quiz: [
            {
              q: "In a Caesar cipher, what is the key?",
              options: [
                "The length of the message",
                "The shift number, like 3",
                "The font the message is written in",
                "The language of the plaintext",
              ],
              answer: 1,
              explain: "The shift amount is the entire secret. Know it and you decrypt; don't and you're staring at gibberish.",
            },
            {
              q: "Caesar shifts the word HELLO by 3. What comes out?",
              options: ["IFMMP", "LIPPS", "KHOOR", "JGNNQ"],
              answer: 2,
              explain: "H to K, E to H, L to O, L to O, O to R. IFMMP would be a shift of 1 and JGNNQ a shift of 2.",
            },
            {
              q: "A shift pushes a letter past Z. What happens?",
              options: [
                "The letter is dropped from the message",
                "It wraps around to A and keeps going",
                "It turns into a digit",
                "The cipher stops working",
              ],
              answer: 1,
              explain: "The alphabet acts like a circle. Modulo arithmetic — taking the remainder after dividing by 26 — is how computers do the wrap.",
            },
          ],
          exercise: {
            prompt: [
              "Time to build your first cipher.",
              "Shift every uppercase letter forward by shift, wrapping Z back around to A.",
              "Spaces and symbols pass through untouched — only A through Z moves.",
            ],
            starter: `function caesarEncrypt(text, shift) {
  // Shift each uppercase letter forward by 'shift'.
  // Wrap around: after Z comes A. Leave spaces and
  // punctuation alone. Return the new string.
  let result = "";
  // your code here
  return result;
}`,
            tests: [
              { name: "shift of 1", code: "return caesarEncrypt('ABC', 1) === 'BCD';" },
              { name: "classic HELLO by 3", code: "return caesarEncrypt('HELLO', 3) === 'KHOOR';" },
              { name: "wraps past Z", code: "return caesarEncrypt('XYZ', 3) === 'ABC';" },
              { name: "leaves spaces and symbols alone", code: "return caesarEncrypt('A B!', 1) === 'B C!';" },
            ],
            solution: `function caesarEncrypt(text, shift) {
  let result = "";
  for (const ch of text) {
    if (ch >= "A" && ch <= "Z") {
      const code = ch.charCodeAt(0) - 65; // A..Z becomes 0..25
      const moved = ((code + shift) % 26 + 26) % 26; // wrap safely
      result += String.fromCharCode(moved + 65);
    } else {
      result += ch; // not a letter: pass it through
    }
  }
  return result;
}`,
            hints: [
              "Turn each letter into 0..25 by subtracting 65 (the code of A).",
              "Add the shift, then use % 26 to wrap around.",
              "Add 65 back and use String.fromCharCode to get a letter again.",
            ],
          },
        },
        {
          id: "crp-breaking-caesar",
          title: "Breaking Caesar",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You just built Caesar's cipher. Now let's destroy it. By the end of this lesson, a Caesar ciphertext will fall apart in under a minute, and you'll own the two weapons that did it: brute force and frequency analysis.",
            },
            { type: "h", text: "Weapon one: brute force" },
            {
              type: "p",
              text: "A Caesar cipher has 25 possible keys. Shift 0 changes nothing, so it barely counts as a key. An attacker doesn't need to be clever — just thorough. Try every shift, read every result, and one line will be readable English. That line hands over both the message and the key in one move.",
            },
            {
              type: "code",
              caption: "Twenty-five guesses, done",
              code: `const secret = "KHOOR ZRUOG"; // intercepted ciphertext

for (let shift = 1; shift <= 25; shift++) {
  let guess = "";
  for (const ch of secret) {
    if (ch >= "A" && ch <= "Z") {
      const code = ch.charCodeAt(0) - 65;
      guess += String.fromCharCode((code + shift) % 26 + 65);
    } else {
      guess += ch; // keep the spaces
    }
  }
  console.log(shift + ": " + guess); // one line reads HELLO WORLD
}`,
            },
            { type: "h", text: "Weapon two: frequency analysis" },
            {
              type: "p",
              text: "You don't even need all 25 tries. English text has a fingerprint: E is the most common letter, then T, then A, down a well-studied list. Shifting renames the letters but keeps the pattern. Count which ciphertext letter shows up most, guess it's an E in disguise, and one subtraction hands you the key.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Any cipher whose keys can be tried one by one in an afternoon is a toy. Real ciphers have key spaces so large that trying them all is physically hopeless — that's the entire point of modern key sizes.",
            },
            {
              type: "p",
              text: "Here's the lasting lesson, bigger than Caesar: the first question to ask about any cipher is how many keys exist. Twenty-five is a party game. Twenty-five is why Caesar died. Every cipher you meet from now on will be judged by this exact measure.",
            },
          ],
          quiz: [
            {
              q: "Why is the Caesar cipher trivial to brute force?",
              options: [
                "There are only 25 possible shifts",
                "The letters never actually move",
                "Brute force requires a supercomputer",
                "Caesar always reused the same message",
              ],
              answer: 0,
              explain: "Shift 0 does nothing, so there are just 25 keys to try. An attacker simply reads every result until one line is English.",
            },
            {
              q: "Frequency analysis breaks Caesar because...",
              options: [
                "encrypted messages are always longer",
                "letters keep their relative commonness, just renamed",
                "computers cannot count letters",
                "every letter becomes E",
              ],
              answer: 1,
              explain: "English has a stable fingerprint — E on top, then T, then A. Shifting renames the letters but keeps the shape of the pattern.",
            },
            {
              q: "You try all 25 shifts on a ciphertext, and one line reads MEET ME AT DAWN. This is...",
              options: [
                "a hash collision",
                "encoding at work",
                "pure luck",
                "a successful brute force — that shift was the key",
              ],
              answer: 3,
              explain: "Trying every possible key is the definition of brute force. With 25 keys it's a minute of work; with AES-sized key spaces it's hopeless.",
            },
          ],
          exercise: {
            prompt: [
              "Caesar's cipher, run in reverse — and in both directions.",
              "rotate('KHOOR', -3) must return 'HELLO', so negative shifts decrypt.",
              "Wrapping must work backwards too: rotate('ABC', -1) gives 'ZAB'.",
            ],
            starter: `function rotate(text, shift) {
  // Same as a Caesar shift, but 'shift' can be
  // negative for decrypting. rotate('KHOOR', -3)
  // should give back 'HELLO'.
  let result = "";
  // your code here
  return result;
}`,
            tests: [
              { name: "decrypt HELLO", code: "return rotate('KHOOR', -3) === 'HELLO';" },
              { name: "wraps backwards past A", code: "return rotate('ABC', -1) === 'ZAB';" },
              { name: "encrypt then decrypt round trip", code: "return rotate(rotate('HELLO', 5), -5) === 'HELLO';" },
            ],
            solution: `function rotate(text, shift) {
  let result = "";
  for (const ch of text) {
    if (ch >= "A" && ch <= "Z") {
      const code = ch.charCodeAt(0) - 65;
      const moved = ((code + shift) % 26 + 26) % 26; // handles negatives
      result += String.fromCharCode(moved + 65);
    } else {
      result += ch;
    }
  }
  return result;
}`,
            hints: [
              "This is caesarEncrypt with one twist: shift may be negative.",
              "In JavaScript, -1 % 26 is -1, not 25 — you need to add 26 and take % again.",
              "Try your caesarEncrypt logic with ((code + shift) % 26 + 26) % 26.",
            ],
          },
        },
        {
          id: "crp-vigenere",
          title: "The Vigenère Cipher",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Caesar died of a small key space: one number, twenty-five choices. The fix took centuries to arrive, and when it did, people were so impressed they called it the indecipherable cipher. The idea: stop shifting by a single number. Start shifting by a word.",
            },
            { type: "h", text: "A keyword instead of a number" },
            {
              type: "p",
              text: "Pick a keyword, like LEMON. Write it above the message, repeating it for as long as the message runs. Each key letter becomes a shift: A means shift 0, B means 1, and Z means 25. Every position in the message now gets its own private shift amount.",
            },
            {
              type: "table",
              headers: ["Role", "The letters"],
              rows: [
                ["Plaintext", "A T T A C K A T D A W N"],
                ["Key, repeating", "L E M O N L E M O N L E"],
                ["Ciphertext", "L X F O P V E F R N H R"],
              ],
            },
            { type: "h", text: "Why frequency analysis choked" },
            {
              type: "p",
              text: "Remember counting the most common letter to expose Caesar's key? Vigenère smears that fingerprint. The same plaintext letter gets a different shift at each position, so one A in your message might become an L here and a W there. The tidy statistics of English dissolve into noise, and for centuries the cipher kept its indecipherable reputation.",
            },
            {
              type: "p",
              text: "It did fall, eventually. In the 1800s, the Prussian officer Friedrich Kasiski found the crack: work out the length of the key first. Once you know the keyword is, say, five letters long, you know every fifth letter was shifted the same way. The message collapses into five separate Caesar ciphers, and you already know how to kill those.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "The pattern repeats forever: someone builds a stronger cipher, someone else builds a better attack. This arms race is the engine of the whole field, and every cipher you'll meet in this course is a survivor of it.",
            },
            {
              type: "p",
              text: "Vigenère fell, but it taught the world something that stuck: strength lives in the key, not in the secrecy of the method. Longer, richer keys beat cleverer scrambling. Hold that thought — the rest of this course is the story of keys getting very, very large.",
            },
          ],
          quiz: [
            {
              q: "What is the key in a Vigenère cipher?",
              options: [
                "A keyword repeated against the message, like LEMON",
                "A single shift number",
                "A padlock and a notary",
                "The length of the ciphertext",
              ],
              answer: 0,
              explain: "Each key letter becomes a shift: A is 0, B is 1, and so on. The keyword repeats until the message ends.",
            },
            {
              q: "Why did Vigenère shrug off frequency analysis for centuries?",
              options: [
                "It used invisible ink",
                "The same plaintext letter can become different ciphertext letters",
                "It was illegal to analyze",
                "No one knew the alphabet back then",
              ],
              answer: 1,
              explain: "Polyalphabetic shifting smears the fingerprint of English: one plaintext letter maps to many ciphertext letters, and the tidy statistics dissolve.",
            },
            {
              q: "Once an attacker works out the key LENGTH, the Vigenère cipher...",
              options: [
                "locks forever",
                "turns into a hash",
                "collapses into separate Caesar ciphers you can solve one by one",
                "doubles its strength",
              ],
              answer: 2,
              explain: "Every nth letter was shifted the same way, so each group is a mini Caesar. That was the crack Kasiski found.",
            },
          ],
          exercise: {
            prompt: [
              "The indecipherable cipher, in your hands.",
              "Each key letter is a shift: 'A' is 0, 'B' is 1, and so on to 'Z' as 25.",
              "When the key runs out, start it again.",
              "Only real letters advance the key — spaces and symbols never eat key letters.",
            ],
            starter: `function vigenereEncrypt(text, key) {
  // Shift each letter by the corresponding key letter.
  // A key letter of 'A' shifts by 0, 'B' by 1, ... 'Z' by 25.
  // After the key runs out, start it again. Spaces and
  // symbols pass through and do NOT eat key letters.
  let result = "";
  let keyIndex = 0;
  // your code here
  return result;
}`,
            tests: [
              { name: "HELLO with KEY", code: "return vigenereEncrypt('HELLO', 'KEY') === 'RIJVS';" },
              { name: "short text, longer key", code: "return vigenereEncrypt('ABC', 'KEY') === 'KFA';" },
              { name: "the classic ATTACK example", code: "return vigenereEncrypt('ATTACKATDAWN', 'LEMON') === 'LXFOPVEFRNHR';" },
              { name: "spaces do not eat key letters", code: "return vigenereEncrypt('A B!', 'KEY') === 'K F!';" },
            ],
            solution: `function vigenereEncrypt(text, key) {
  let result = "";
  let keyIndex = 0;
  for (const ch of text) {
    if (ch >= "A" && ch <= "Z") {
      const k = key.charCodeAt(keyIndex % key.length) - 65;
      const code = ch.charCodeAt(0) - 65;
      const moved = ((code + k) % 26 + 26) % 26;
      result += String.fromCharCode(moved + 65);
      keyIndex++; // only real letters advance the key
    } else {
      result += ch;
    }
  }
  return result;
}`,
            hints: [
              "For each letter, find the key letter at keyIndex % key.length.",
              "Turn the key letter into a shift by subtracting 65.",
              "Advance keyIndex only when you actually encrypt a letter.",
            ],
          },
        },
        {
          id: "crp-boss-vault",
          title: "The Vigenère Vault",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "No new theory this time. The Vigenère Vault stands in front of you, its display flashing an intercepted ciphertext and a keypad that wants answers. Six tumblers, six questions, everything from this chapter.",
            },
            {
              type: "p",
              text: "You already hold every tool you need. Clear the desk, crack your knuckles, and open the door.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Vigenère Vault",
            intro: "An intercepted message guards the vault door. Six tumblers stand between you and what's inside. Answer them all and the door swings open.",
            art: `   +======================+
   |  ##  VAULT  DOOR  ## |
   |    .------------.    |
   |    | 7  8  9    |    |
   |    | 4  5  6    |    |
   |    | 1  2  3    |    |
   |    '------------'    |
   |     [  ENTER  ]      |
   +======================+`,
            stages: [
              {
                question: "The first tumbler displays a long Base64 string and a smug inscription: totally encrypted. What's wrong with that claim?",
                options: [
                  "Base64 is encryption, actually — the vault is fine",
                  "Base64 can be reversed by anyone; there's no secret anywhere in it",
                  "Base64 only works on numbers",
                  "Base64 strings are always uppercase",
                ],
                answer: 1,
                explain: "Encoding is a translation with no key. Anyone — including you, right now — can decode it. No secret, no encryption.",
              },
              {
                question: "The keypad flashes one word: RSHA. You recognize Caesar's favorite shift of 3. What's the word?",
                options: ["STAR", "OPEN", "LOCK", "DOOR"],
                answer: 1,
                explain: "Shift each letter back by 3: R becomes O, S becomes P, H becomes E, Q becomes N. The vault was waiting for OPEN all along.",
              },
              {
                question: "A plaque asks why the Vigenère cipher shrugged off frequency analysis for centuries.",
                options: [
                  "It encrypted every letter with a fresh random key",
                  "It only used rare letters",
                  "The same plaintext letter became different ciphertext letters, smearing the frequency profile",
                  "It hid the length of the message",
                ],
                answer: 2,
                explain: "Polyalphabetic shifting means one E might become an L here and a W there. The tidy statistics of English dissolve into noise.",
              },
              {
                question: "A rusty side door still uses Caesar. How many shifts must you try to be certain of breaking it?",
                options: ["256", "1", "25", "1000"],
                answer: 2,
                explain: "Shift 0 changes nothing, so 25 real keys exist. Try them all and one line reads like English. That's why nobody serious uses Caesar.",
              },
              {
                question: "The vault's blueprints hang publicly in the lobby — everyone knows exactly how the lock works. Kerckhoffs's principle says this is...",
                options: [
                  "a fatal mistake — the design must be hidden",
                  "irrelevant to security",
                  "fine, as long as the key stays secret",
                  "only acceptable for museums",
                ],
                answer: 2,
                explain: "Assume the attacker knows the system. All security must live in the key. It's exactly why AES can be public and still trusted.",
              },
              {
                question: "The intercepted ciphertext repeats the chunk XZQW twice, exactly 12 letters apart. What does that whisper?",
                options: [
                  "The key is 26 letters long",
                  "The key length probably divides 12 — likely 2, 3, 4, 6 or 12",
                  "The message is Base64 after all",
                  "The cipher is a one-time pad",
                ],
                answer: 1,
                explain: "Repeated chunks mean the key lined up with itself. The distance between repeats is a multiple of the key length — the first crack in any Vigenère.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "modern-blocks",
      title: "Modern Building Blocks",
      blurb: "The four primitives behind every lock on the internet: XOR, one-time pads, hashes and symmetric ciphers.",
      lessons: [
        {
          id: "crp-xor",
          title: "XOR: The Atom of Encryption",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Strip away the certificates, the key exchanges, the acronyms — deep inside nearly every cipher you will ever meet, one tiny operation does the heavy lifting. It's called XOR, you can learn it in about forty seconds, and by the end of this lesson you'll be encrypting with it.",
            },
            { type: "h", text: "One rule, four rows" },
            {
              type: "p",
              text: "XOR compares two bits — two individual digits, each 0 or 1. The rule is one line: same bits give 0, different bits give 1. Written as the caret symbol in JavaScript, it's the question 'are these different?' compressed into an operation.",
            },
            {
              type: "table",
              headers: ["A", "B", "A XOR B"],
              rows: [
                ["0", "0", "0"],
                ["0", "1", "1"],
                ["1", "0", "1"],
                ["1", "1", "0"],
              ],
            },
            { type: "h", text: "The magic trick" },
            {
              type: "p",
              text: "Here's the property that makes encryption possible. Take any value, XOR it with a key, and you get scrambled nonsense. XOR that nonsense with the same key again, and the original walks back out, unharmed. The operation is its own undoing — which means one key can lock and unlock.",
            },
            {
              type: "code",
              caption: "Encrypt, then decrypt, with the same move",
              code: `const message = 0b01001000; // the letter H, as bits
const key = 0b10101010;     // some key bits

const encrypted = message ^ key;   // 226 — meaningless noise
const decrypted = encrypted ^ key; // H's bits, back again

console.log(encrypted);             // 226
console.log(decrypted === message); // true`,
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Real ciphers don't XOR your data with the raw key once. They mix, shuffle, and re-XOR many times, so that flipping one key bit scrambles everything. The pattern of mixing is what cryptographers actually design and attack.",
            },
            {
              type: "p",
              text: "XOR alone isn't a cipher — repeat a short key over a long message and analysts will tear it apart, as the Caesar lessons should make you suspect. But as the atom of encryption, it sits inside everything from the toy you're about to build to AES itself. Next up: the one cipher that is provably, mathematically unbreakable.",
            },
          ],
          quiz: [
            {
              q: "What is 1 XOR 0?",
              options: ["0", "1", "2", "10"],
              answer: 1,
              explain: "XOR outputs 1 when the bits differ. Same bits give 0 — that's the whole rule.",
            },
            {
              q: "You XOR a byte with 42, then XOR the result with 42 again. What comes back?",
              options: [
                "The original byte",
                "Zero, always",
                "42",
                "A random byte",
              ],
              answer: 0,
              explain: "XOR is its own undoing: the second 42 cancels the first. That's why one key can both encrypt and decrypt.",
            },
            {
              q: "XOR outputs 1 when...",
              options: [
                "both inputs are 1",
                "both inputs are 0",
                "the two input bits are different",
                "the inputs are letters",
              ],
              answer: 2,
              explain: "Different inputs give 1; identical inputs give 0. Check the truth table — it never lies.",
            },
          ],
          exercise: {
            prompt: [
              "Two functions this time.",
              "xorByte(a, b) returns a XOR b using the caret operator.",
              "xorString(text, keyByte) XORs every character's code with keyByte and rebuilds the string.",
              "The last test is the magic trick: XOR twice with the same byte, get the original back.",
            ],
            starter: `function xorByte(a, b) {
  // XOR two numbers (each 0..255) and return the result.
  // your code here
}

function xorString(text, keyByte) {
  // XOR every character's code with keyByte,
  // and rebuild the text.
  // your code here
}`,
            tests: [
              { name: "5 XOR 3 is 6", code: "return xorByte(5, 3) === 6;" },
              { name: "XOR with zero changes nothing", code: "return xorByte(255, 0) === 255;" },
              { name: "xorString shifts characters", code: "return xorString('AAA', 2) === 'CCC';" },
              { name: "XOR twice restores the original", code: "return xorString(xorString('HELLO', 42), 42) === 'HELLO';" },
            ],
            solution: `function xorByte(a, b) {
  return a ^ b; // ^ is XOR in JavaScript
}

function xorString(text, keyByte) {
  let result = "";
  for (const ch of text) {
    const xored = ch.charCodeAt(0) ^ keyByte;
    result += String.fromCharCode(xored);
  }
  return result;
}`,
            hints: [
              "JavaScript's XOR operator is the caret: ^",
              "charCodeAt gives a number, String.fromCharCode turns one back.",
              "Because XOR undoes itself, encrypting twice with the same byte returns the original.",
            ],
          },
        },
        {
          id: "crp-one-time-pad",
          title: "The Only Perfect Cipher",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Here's a strange truth: exactly one cipher in existence carries a mathematical proof of unbreakability. Not 'very hard to break' — unbreakable, provably, even against an attacker with infinite time and infinite computing power. It's called the one-time pad, and its price tag explains why you've never used it.",
            },
            { type: "h", text: "The recipe for perfection" },
            {
              type: "list",
              items: [
                "The key is at least as long as the message",
                "The key is truly random",
                "The key is used exactly once, then destroyed",
              ],
            },
            {
              type: "p",
              text: "Follow all three rules and something remarkable happens: every possible plaintext of the right length fits the ciphertext equally well. The ciphertext contains zero information about what you sent. Cryptographers call this perfect secrecy, and nothing else in this course has it.",
            },
            {
              type: "code",
              caption: "A one-time pad is XOR with a perfect key",
              code: `function padCipher(message, key) {
  // key must be exactly as long as the message
  let out = "";
  for (let i = 0; i < message.length; i++) {
    out += String.fromCharCode(
      message.charCodeAt(i) ^ key.charCodeAt(i)
    );
  }
  return out;
}

const sealed = padCipher("HELLO", "XQJZM"); // burned after one use`,
            },
            {
              type: "p",
              text: "Now the price tag. Generating truly random numbers is genuinely hard — computers are deterministic machines that resent unpredictability. Worse, you must deliver a key as long as every message you'll ever send, and deliver it securely before any message travels. Two spies with a briefcase: fine. The internet: impossible.",
            },
            {
              type: "p",
              text: "And the third rule is where people bleed. Reuse a pad key on a second message and the proof dies: XOR the two ciphertexts together and the key cancels out completely, leaving the attacker holding the XOR of your two plaintexts, which crumbles under analysis. That mistake is called a two-time pad, and it has sunk real systems.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Reuse a one-time pad key and the secrecy evaporates. The proof of perfection covers exactly one message per key. Not two. Not almost two. One.",
            },
            {
              type: "p",
              text: "Perfect secrecy exists, and the internet can't afford it. That tension explains everything practical you'll ever meet: real systems aren't perfect, they're just hard enough to break that attacking the humans is cheaper. Keep that thought — it's the honest summary of modern security.",
            },
          ],
          quiz: [
            {
              q: "A one-time pad achieves perfect secrecy when the key is...",
              options: [
                "as long as the message, truly random, and used exactly once",
                "a short password you can remember",
                "reused across many messages for efficiency",
                "made only of vowels",
              ],
              answer: 0,
              explain: "All three conditions together. Break any one and the proof of unbreakability is off.",
            },
            {
              q: "Why doesn't the internet just use one-time pads for everything?",
              options: [
                "They were never actually invented",
                "Generating true randomness and safely delivering huge keys doesn't scale",
                "XOR is too slow to compute",
                "They only work on paper",
              ],
              answer: 1,
              explain: "You'd need to pre-deliver a stream of key material as long as every future message, securely, to everyone. The logistics are impossible at internet scale.",
            },
            {
              q: "Two messages get encrypted with the SAME one-time pad key. The attacker's best move is to...",
              options: [
                "give up and go home",
                "wait for the key to expire",
                "XOR the two ciphertexts together — the key cancels out",
                "count the vowels in each",
              ],
              answer: 2,
              explain: "Ciphertext one XOR ciphertext two equals plaintext one XOR plaintext two — the key vanishes from the equation. Reuse is fatal.",
            },
          ],
        },
        {
          id: "crp-hashing",
          title: "Digital Fingerprints",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "A hash is a one-way blender. Toss in a file of any size — a text, a movie, your entire photo library — and out comes a fixed-size fingerprint, the same length every time. Good luck putting the smoothie back into an apple.",
            },
            { type: "h", text: "Four promises of a good hash" },
            {
              type: "list",
              items: [
                "Same input, same output — every single time",
                "Any input size, same fixed output size",
                "One-way: the blender never runs in reverse",
                "Avalanche: flip one input bit, the whole fingerprint changes",
              ],
            },
            {
              type: "p",
              text: "That last one is the avalanche effect, and it's glorious. Change one comma in a ten-megabyte document and the hash doesn't change a little — it changes completely, like a landslide triggered by one pebble. Small input change, total output chaos, every time.",
            },
            {
              type: "code",
              caption: "The shape of every integrity check ever",
              code: `// 1. The sender publishes the file's hash
// 2. You hash what you received
// 3. Compare fingerprints

// simpleHash is the toy you'll build in this lesson's exercise
const published = simpleHash("report-final.pdf");
const received = simpleHash("report-final.pdf");

console.log(published === received); // true: bit-for-bit intact`,
            },
            {
              type: "p",
              text: "This is how integrity checks work all over computing. A site publishes the hash of a file it's offering; you download the file, hash it yourself, and compare. A match means your copy is bit-for-bit identical. A mismatch means something changed in transit — corruption, or tampering. Either way, don't run that file.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Real hashes like SHA-256 squeeze inputs of any size into 256-bit fingerprints. Your browser, your operating system, and your package manager quietly hash things all day long to detect exactly this kind of corruption.",
            },
            {
              type: "p",
              text: "One warning before you build your own: a hash is not encryption. There is no key, and there is no un-hashing — it's a fingerprint, not an envelope. Fingerprints can prove a file hasn't changed, but they can never carry a secret back and forth. In the next lesson, they get a job where that's exactly what you want.",
            },
          ],
          quiz: [
            {
              q: "Which is NOT a property of a cryptographic hash?",
              options: [
                "Same input always produces the same output",
                "Any input size produces a fixed-size output",
                "You can run it backwards to recover the input",
                "A tiny input change produces a completely different output",
              ],
              answer: 2,
              explain: "Hashes are one-way by design. The output is a fingerprint — nothing walks it back to the original.",
            },
            {
              q: "A site publishes a file's SHA-256 fingerprint. How do you verify your download?",
              options: [
                "Open the file and skim it for typos",
                "Hash your downloaded copy and compare it to the published fingerprint",
                "Email the site and ask",
                "XOR the file with the fingerprint",
              ],
              answer: 1,
              explain: "Matching fingerprints mean bit-for-bit identical data. A mismatch means corruption or tampering — either way, don't use the file.",
            },
            {
              q: "Why is a hash not encryption?",
              options: [
                "Hashes are too old to trust",
                "Hashes only work on text files",
                "There is no key and no way to reverse the output",
                "Encryption is always faster",
              ],
              answer: 2,
              explain: "Encryption is a two-way street with a key. A hash is a one-way blender: great for fingerprints, useless for secrets.",
            },
          ],
          exercise: {
            prompt: [
              "Build a toy hash — a one-way blender with a number for a fingerprint.",
              "Start at h = 7. For each character, mix with h = (h * 31 + charCode) % 1000003.",
              "The multiply-by-31 spreads tiny changes across the whole result.",
            ],
            starter: `function simpleHash(text) {
  // A toy hash: walk through the text, mixing each
  // character's code into a running value.
  let h = 7;
  // your code here
  return h;
}`,
            tests: [
              { name: "empty text keeps the seed", code: "return simpleHash('') === 7;" },
              { name: "single letter is predictable", code: "return simpleHash('A') === 282;" },
              { name: "same input, same fingerprint", code: "return simpleHash('hello') === simpleHash('hello');" },
              { name: "tiny change, different result", code: "return simpleHash('bat') !== simpleHash('cat');" },
            ],
            solution: `function simpleHash(text) {
  let h = 7;
  for (const ch of text) {
    h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  }
  return h;
}`,
            hints: [
              "Loop over every character with for...of.",
              "Mix with: h = (h * 31 + code) % 1000003.",
              "The multiply-by-31 trick spreads small changes across the whole result.",
            ],
          },
        },
        {
          id: "crp-password-hashing",
          title: "Why Sites Can't Email Your Password",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Click 'forgot password' on a well-run site and it never emails you the password. It makes you set a new one. That isn't rudeness — it's because the site doesn't have your password. It has a fingerprint of it, and fingerprints don't reverse.",
            },
            { type: "h", text: "Only the hash is stored" },
            {
              type: "p",
              text: "When you set a password, the site hashes it and stores only the hash. When you log in, it hashes what you typed and compares fingerprints. A leaked database is therefore a pile of hashes, not passwords — attackers have to crack each one, and hashes are one-way by design.",
            },
            {
              type: "p",
              text: "But a plain hash has a weakness. Attackers precompute rainbow tables: enormous lookup tables holding the hashes of every common password ever used. They look up your leaked hash and read off the password like a phone book in reverse. Hashing alone doesn't save you.",
            },
            {
              type: "p",
              text: "The fix is a salt: a random string, different for every user, mixed into the password before hashing. Same password, different salt, completely different hash. The rainbow table dies instantly, because it was built for unsalted hashes — the attacker now needs a fresh table for every single user, which is not a business model.",
            },
            {
              type: "code",
              caption: "Same password, different everything",
              code: `// Two users, same password, different salts:
const stored = [
  { user: "alice", salt: "q7x" }, // stores hash of "q7x" + "hunter2"
  { user: "bob",   salt: "m2p" }  // stores hash of "m2p" + "hunter2"
];

// The salts differ, so the stored hashes differ.
// A rainbow table built for plain "hunter2" matches neither.`,
            },
            {
              type: "p",
              text: "There's one more layer: deliberately slow hashes. Families like bcrypt and argon2 are engineered to take real time per hash. You log in once, so a fraction of a second is invisible to you. An attacker guessing billions of passwords pays that cost on every single try — you've turned their bulldozer into a teaspoon.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "A site that emails you your forgotten password stored it in plain text. Any leak hands attackers every password directly, in readable form. Run — and change that password everywhere you reused it.",
            },
            {
              type: "p",
              text: "This is the quiet deal every responsible site makes with you: it forgets your password on purpose and pays a small computing tax on every login, so that even a total leak forces attackers to grind it out, user by user, guess by guess. Now you know exactly why that reset email never contains the old password.",
            },
          ],
          quiz: [
            {
              q: "You click 'forgot password' and the site emails you your actual password. What does this reveal?",
              options: [
                "Nothing — that's normal",
                "The site hashes passwords correctly",
                "The site uses AES",
                "The site stored your password in plain text",
              ],
              answer: 3,
              explain: "A responsible site only has a hash and can't produce the original. If it can email your password, it kept the real thing — a disaster waiting to leak.",
            },
            {
              q: "What does adding a per-user salt defeat?",
              options: [
                "Frequency analysis",
                "Precomputed rainbow tables",
                "Man-in-the-middle attacks",
                "Certificate forgery",
              ],
              answer: 1,
              explain: "Rainbow tables are built for unsalted hashes. With a unique salt per user, the attacker would need a separate table for every single user — infeasible.",
            },
            {
              q: "Why do deliberately slow hashes like bcrypt make attackers miserable?",
              options: [
                "They are illegal to compute quickly",
                "Every guess takes real time, so billions of guesses become wildly expensive",
                "They delete wrong guesses automatically",
                "They change the password every second",
              ],
              answer: 1,
              explain: "You pay the cost once per login and never notice. An attacker pays it on every guess — the teaspoon-versus-bulldozer problem.",
            },
          ],
          exercise: {
            prompt: [
              "simpleHash is given — leave it alone.",
              "Write saltedHash so the salt is mixed into the password before hashing.",
              "The test says it plainly: saltedHash('hunter2', 'salt') must equal simpleHash('salthunter2').",
            ],
            starter: `function simpleHash(text) {
  // Given: our toy hash from the last lesson.
  let h = 7;
  for (const ch of text) {
    h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  }
  return h;
}

function saltedHash(password, salt) {
  // Return a hash of the password MIXED with the salt.
  // Same password + different salt = different result.
  // your code here
}`,
            tests: [
              { name: "returns a number", code: "return typeof saltedHash('pw', 'x') === 'number';" },
              { name: "deterministic", code: "return saltedHash('pw', 'x') === saltedHash('pw', 'x');" },
              { name: "different salts give different hashes", code: "return saltedHash('pw', 'x') !== saltedHash('pw', 'y');" },
              { name: "it really is salt plus password", code: "return saltedHash('hunter2', 'salt') === simpleHash('salthunter2');" },
            ],
            solution: `function simpleHash(text) {
  // Given: our toy hash from the last lesson.
  let h = 7;
  for (const ch of text) {
    h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  }
  return h;
}

function saltedHash(password, salt) {
  return simpleHash(salt + password);
}`,
            hints: [
              "A salt is just a random string glued to the password before hashing.",
              "simpleHash already exists — you only need to feed it salt + password.",
              "Order matters: salt first, then password.",
            ],
          },
        },
        {
          id: "crp-symmetric",
          title: "Symmetric Encryption",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You now have XOR, and you know what happened to ciphers with tiny key spaces. Time to meet the cipher that carries the modern world. Symmetric encryption: one secret key locks the data, and the very same key unlocks it — like the key to your front door, one key for both directions.",
            },
            { type: "h", text: "AES: the workhorse" },
            {
              type: "p",
              text: "AES — the Advanced Encryption Standard — is today's symmetric workhorse. Its design is completely public, in the finest Kerckhoffs tradition, and it takes keys of 128 or 256 bits. It's also fast: it encrypts entire disks and video streams without you ever noticing a slowdown.",
            },
            {
              type: "p",
              text: "Why can't someone brute force it? Count the keys. A 256-bit key means 2 to the power 256 possibilities — a number so vast that trying them all is hopeless, not just for your laptop but for any computing humanity knows how to build. The key space is the moat.",
            },
            {
              type: "code",
              caption: "One key, both directions",
              code: `// Symmetric means one key does both jobs.
// xorString is the one you built in the XOR lesson:
function lockAndUnlock(text, keyByte) {
  const locked = xorString(text, keyByte);   // encrypt
  const opened = xorString(locked, keyByte); // decrypt: same key
  return opened === text;                    // true, every time
}

// Real AES is this idea with world-class mixing.`,
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Your phone almost certainly encrypts its entire storage with AES while you use it. Every photo, every note, scrambled at rest and transparently unscrambled on demand — that's symmetric encryption doing its day job.",
            },
            {
              type: "p",
              text: "Symmetric crypto is the fast lane that actually protects data in bulk: disks, files, VPN tunnels, message contents. It's strong, it's fast, it's everywhere. It also has one crippling flaw — and it's so important it gets its own lesson, right now.",
            },
          ],
          quiz: [
            {
              q: "Symmetric encryption means...",
              options: [
                "the same key encrypts and decrypts",
                "only vowels get scrambled",
                "the key changes with every letter",
                "two strangers each hold half a key",
              ],
              answer: 0,
              explain: "One shared secret key does both jobs, like your front door key. AES is the modern workhorse of exactly this design.",
            },
            {
              q: "AES-256 has 2 to the power 256 possible keys. Brute forcing them all is...",
              options: [
                "a weekend project for a gaming PC",
                "hopeless — the number is astronomically beyond any computing we can build",
                "easy if you try the likely keys first",
                "only possible on cloud computers",
              ],
              answer: 1,
              explain: "The key space is the moat. Trying every key is so far beyond feasible that attackers go around the cipher, never through it.",
            },
            {
              q: "Which is typically protected by symmetric encryption?",
              options: [
                "Only email passwords",
                "Only websites' logos",
                "Disk encryption, VPN tunnels, and file encryption",
                "Nothing — it's theoretical",
              ],
              answer: 2,
              explain: "Symmetric crypto is the fast lane for bulk data: whole disks, files, and tunnels. You use it constantly without noticing.",
            },
          ],
        },
        {
          id: "crp-key-problem",
          title: "The Key Problem",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Symmetric encryption has one beautiful, fatal flaw, and it isn't the cipher. It's the meeting. Both sides need the same secret key, and in a world of strangers on open wires, arranging that meeting is a catastrophe.",
            },
            {
              type: "p",
              text: "Think about what the internet actually is: your packets hopping through routers owned by who-knows-whom. If you send your AES key across that wire, anyone listening on the path can copy it. From that moment, every message you 'encrypt' is being read in parallel by an uninvited guest.",
            },
            {
              type: "ascii",
              art: `  YOU ~~~ sends the key ~~~> FRIEND
              |
              v
       .------------.
      (  EARWIG_9000 )
       '------------'
        listening...`,
            },
            {
              type: "p",
              text: "The old answers don't scale. Spies exchanged key books by courier, in person, ahead of time — fine for two embassies, useless when every person on Earth might want to talk privately to every other person by lunchtime.",
            },
            {
              type: "list",
              items: [
                "Courier the key by hand — works for spies, not for the internet",
                "Pre-share a unique key with everyone you might ever contact — millions of pairs",
                "Send the key and hope nobody is listening — hope is not a protocol",
              ],
            },
            {
              type: "p",
              text: "Every piece is now on the table. Fast, strong symmetric encryption that needs a shared secret; strangers who can't safely share one; a wire where everything sent can be copied. The lock is perfect and the key can't travel. In the 1970s, a handful of mathematicians found the way out — and it's the plot twist of the next chapter.",
            },
          ],
          quiz: [
            {
              q: "Why can't you just email your AES key to a friend before the call?",
              options: [
                "Keys are too large for email",
                "Anyone listening on the way can copy it — and then reads everything",
                "AES keys cannot be written as text",
                "Email deletes attachments randomly",
              ],
              answer: 1,
              explain: "The wire is observable. A copied key means every past and future message encrypted with it is compromised.",
            },
            {
              q: "The key problem, in one sentence:",
              options: [
                "Ciphers are too slow to matter",
                "Keys physically wear out",
                "Two strangers need to share a secret over a public channel without anyone else learning it",
                "Passwords are always weak",
              ],
              answer: 2,
              explain: "Symmetric crypto is strong, but it assumes the secret was already shared safely. On an open network, that assumption collapses.",
            },
          ],
        },
        {
          id: "crp-boss-breach",
          title: "The Leaked Database",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "3 a.m. Your phone is ringing. A user database from your company just leaked, and you're the security engineer on call.",
            },
            {
              type: "p",
              text: "Six calls to make before sunrise. Each one decides how bad the morning gets.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Leaked Database",
            intro: "A user database just leaked and you're on call. Six decisions stand between your users and disaster. Make them all.",
            art: `     ____________
    /            \\
   /______________\\
   |  X        X  |
   |      __      |
   |     (__)     |
   |______________|
    \\ ||    || /
     \\_||__||_/`,
            stages: [
              {
                question: "First look at the leak. One stolen table holds passwords in plain text; another holds only salted hashes. Which is the catastrophe?",
                options: [
                  "The hashed table — hashes are unreadable anyway",
                  "Both are equally harmless",
                  "The plain text table — every password in it is usable immediately",
                  "Neither, as long as the file is zipped",
                ],
                answer: 2,
                explain: "Plain text passwords are ready-to-use loot. The salted hashes force the attacker into a slow, expensive grind for every single account.",
              },
              {
                question: "Each user row mixes a different random salt into its hash. What does that change for the attacker?",
                options: [
                  "Nothing — salts are public and harmless to them",
                  "They can no longer find the database",
                  "Every user must be attacked individually — no bulk shortcuts",
                  "It makes the database smaller",
                ],
                answer: 2,
                explain: "Identical passwords now hash differently, so one cracked password unlocks nothing else. The attack becomes user-by-user, forever.",
              },
              {
                question: "The attacker deploys a rainbow table: precomputed hashes of millions of common passwords. Why does it fail against this database?",
                options: [
                  "The table is in the wrong file format",
                  "Every password was hashed with a unique salt, so the precomputed entries match nothing",
                  "Rainbow tables only work on email servers",
                  "The table's colors clash",
                ],
                answer: 1,
                explain: "A rainbow table maps unsalted hash to password. With per-user salts, the attacker would need a brand new table for every single user — that's the entire defense.",
              },
              {
                question: "This site used a bcrypt-family hash, deliberately slow. Why does that matter tonight?",
                options: [
                  "Slow hashes are more readable",
                  "Each password guess costs real time, so billions of guesses become wildly expensive",
                  "Slow hashes cannot be cracked at all",
                  "It slows down the leak itself",
                ],
                answer: 1,
                explain: "A real user logs in once and never notices. An attacker making billions of guesses pays the delay on every attempt — their bulldozer becomes a teaspoon.",
              },
              {
                question: "Now triage the users. What should they do first?",
                options: [
                  "Change their password here — and everywhere they reused it",
                  "Post the leaked hashes online for help",
                  "Nothing — the hashes protect them forever",
                  "Delete their email accounts",
                ],
                answer: 0,
                explain: "Reused passwords are the real blast radius: a crack here endangers every account sharing that password. Change here first, then everywhere it was reused.",
              },
              {
                question: "Last decision: how does the site store passwords from tomorrow on?",
                options: [
                  "Plain text, but in a folder named do-not-leak",
                  "Encrypted with one master company key",
                  "Per-user salt plus a deliberately slow hash — and forced resets for leaked accounts",
                  "One shared password for everyone, rotated yearly",
                ],
                answer: 2,
                explain: "Salted and slow is the playbook. Anything reversible — plain text or one master key — is a time bomb with your logo on it.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "randomness-and-breaking",
      title: "Randomness & Cryptanalysis",
      blurb: "The ingredient every cipher depends on — and the toolbox that breaks the careless.",
      lessons: [
        {
          id: "crp-randomness",
          title: "Randomness: The Ingredient You Cannot Fake",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every secret you have built so far — one-time pads, encryption keys, salts — shares one hidden dependency: unpredictability. A cipher can be mathematically magnificent and still die instantly if its key is guessable. The strongest lock in the world is worthless if the key is under the doormat. This lesson is about doormats.",
            },
            { type: "h", text: "Humans are terrible dice" },
            {
              type: "p",
              text: "Ask a room of people to pick a random number from 1 to 100 and a third of them say 7. Ask for random PINs and you get 1234, 1111, and everyone's birthday. Our brains are pattern machines — magnificent at finding order, hopeless at producing its absence. Any 'random' value a human invents by thinking hard is a value an attacker can prioritize guessing.",
            },
            { type: "h", text: "Pseudorandom: a formula wearing a mask" },
            {
              type: "p",
              text: "Computers cannot draw randomness from thin air either, so they do something sneaky instead: they run a deterministic formula that produces output that looks random. That is a pseudorandom number generator, or PRNG. You give it a seed, and from that seed it produces an endless stream of numbers that pass every visual test of chaos. Same seed, same stream. Every time. It is a costume, not a coin flip.",
            },
            {
              type: "code",
              caption: "A tiny PRNG — the whole trick in six lines",
              code: `function makeRandom(seed) {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296; // looks random, is not
  };
}

const a = makeRandom(42);
const b = makeRandom(42);
a() === b(); // true — same seed, same "randomness"`,
            },
            {
              type: "p",
              text: "For game shuffles and silly animations, that is perfectly fine. For secrets, it is a catastrophe. If an attacker can guess the seed — the time of day you generated it, a counter, anything narrow — then every 'random' key you derived from it tumbles out of the formula like coins from a slot.",
            },
            { type: "h", text: "The real thing" },
            {
              type: "p",
              text: "Serious cryptography uses a stricter breed: cryptographically secure pseudorandom number generators, seeded by genuine physical unpredictability — timing jitter in your keystrokes and disk head movements, electrical noise, dedicated hardware entropy sources. Their outputs are not just pattern-free; they remain unpredictable even to an attacker who has already watched a million previous outputs. In the browser, that source is crypto.getRandomValues.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Math.random is a PRNG designed for speed, not secrecy. Its output can be predictable enough to matter. Using it for a token, a key, a password reset link or a session ID is a classic real-world vulnerability. For anything secret: crypto.getRandomValues, always.",
            },
            {
              type: "p",
              text: "Now build the slot machine yourself. The exercise has you implement that tiny PRNG and prove — in your own tests — that same seed means same stream. Watch how un-random randomness can be.",
            },
          ],
          quiz: [
            {
              q: "Two PRNGs are seeded with the same value. What do they output?",
              options: [
                "Completely different streams",
                "Identical streams, because a PRNG is a deterministic formula",
                "The same first number, then they diverge",
                "Random streams — that is what the R stands for",
              ],
              answer: 1,
              explain:
                "A pseudorandom generator is deterministic: the seed is the entire secret. Same seed, same sequence, forever. That is exactly why leaked seeds are so dangerous.",
            },
            {
              q: "Why is Math.random disqualified from generating secret keys?",
              options: [
                "It is too slow",
                "It only produces small numbers",
                "It is a speed-first PRNG whose output can be predictable",
                "It cannot run twice in the same program",
              ],
              answer: 2,
              explain:
                "Math.random is built for fast, good-enough chaos in games and visuals. Nothing about it guarantees unpredictability against an attacker, which is the entire job of a key.",
            },
            {
              q: "A CSPRNG like the one behind crypto.getRandomValues is special because...",
              options: [
                "it is seeded by physical entropy and stays unpredictable even after you observe many outputs",
                "it runs faster than Math.random",
                "it produces only prime numbers",
                "it never repeats a number in its lifetime",
              ],
              answer: 0,
              explain:
                "Cryptographic randomness has two demands: seeding from genuine unpredictability, and remaining unguessable even against attackers who have seen earlier outputs. Speed is not the point.",
            },
          ],
          exercise: {
            prompt: [
              "Build the tiny PRNG from the lesson and prove how deterministic 'randomness' really is.",
              "makeRandom(seed) returns a function. Each call advances the state with the formula and returns a number from 0 up to (but not including) 1.",
              "The formula: state = (state * 1664525 + 1013904223) % 4294967296, then divide by 4294967296.",
              "The tests will show you: same seed, same stream. Different seeds, different streams.",
            ],
            starter: `function makeRandom(seed) {
  // Keep a state that starts at the seed.
  // Each call: advance the state with the
  // formula, then return state / 4294967296.
  // your code here
}`,
            tests: [
              {
                name: "same seed, same first value",
                code: "return makeRandom(42)() === makeRandom(42)();",
              },
              {
                name: "same seed, same second value too",
                code: "const a = makeRandom(42); const b = makeRandom(42); a(); b(); return a() === b();",
              },
              {
                name: "successive values move",
                code: "const r = makeRandom(42); const first = r(); return r() !== first;",
              },
              {
                name: "always within [0, 1)",
                code:
                  "const r = makeRandom(7); let ok = true; for (let i = 0; i < 100; i++) { const v = r(); if (v < 0 || v >= 1) ok = false; } return ok;",
              },
              {
                name: "different seeds diverge",
                code: "return makeRandom(1)() !== makeRandom(2)();",
              },
            ],
            solution: `function makeRandom(seed) {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}`,
            hints: [
              "The outer function sets up the state; the inner function uses and updates it. This is a closure — the returned function remembers state.",
              "JavaScript numbers handle these values fine up to 2^53, so the multiply-add-mod arithmetic is safe.",
              "Return state / 4294967296 so the result lands in [0, 1) — zero included, one excluded.",
            ],
          },
        },
        {
          id: "crp-nonce",
          title: "Nonces: Numbers Used Once",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You have already met a nonce without hearing the word. The salt you added to passwords in the hashing lesson was one. A nonce — number used once — is any value included in a cryptographic operation precisely so that the result differs every time, even when the input is identical.",
            },
            { type: "h", text: "Why sameness is deadly" },
            {
              type: "p",
              text: "Without a nonce, encrypting the same message twice with the same key yields the same ciphertext twice. An eavesdropper does not need to break anything to exploit that: they see two identical envelopes and learn that two identical messages were sent, when, and to whom. Patterns leak. The nonce exists to shred the pattern.",
            },
            { type: "h", text: "What happens when nonces repeat" },
            {
              type: "p",
              text: "Reusing a nonce is worse than skipping it. With a one-time pad, reuse is mathematical suicide. If the same pad encrypts two messages, an attacker XORs the two ciphertexts together and the pad cancels out entirely — what remains is the XOR of the two plaintexts. The key has been algebraically deleted, and both messages bleed.",
            },
            {
              type: "code",
              caption: "The pad cancels itself",
              code: `c1 = m1 XOR pad
c2 = m2 XOR pad       // same pad — the fatal mistake

c1 XOR c2 = m1 XOR m2 // the pad vanishes!
// English XOR English is broken with pencil and paper.`,
            },
            {
              type: "callout",
              variant: "warn",
              title: "TRUE STORY",
              text: "This mistake has taken down giants. A famous game console's master signing key leaked because its code-signing system reused a nonce twice with the same key — researchers XORed the two signatures and the secret fell out. Entire ecosystems have been undone by one repeated number.",
            },
            { type: "h", text: "How systems stay unique" },
            {
              type: "list",
              items: [
                "Counters: message 1, message 2, message 3 — never look back, never repeat.",
                "Big random nonces: 96 bits or more of CSPRNG output, so collision odds are astronomically small.",
                "Combination: a fixed device prefix plus a counter, keeping two devices from ever colliding.",
              ],
            },
            {
              type: "p",
              text: "The lesson to carry forward: keys get the glory, but nonces do quiet, essential work. When you read about a real-world encryption failure, before long you will find a repeated nonce somewhere in the wreckage.",
            },
          ],
          quiz: [
            {
              q: "What is the job of a nonce?",
              options: [
                "To make the ciphertext shorter",
                "To make identical messages produce different ciphertexts each time",
                "To verify the sender's identity",
                "To compress the encryption key",
              ],
              answer: 1,
              explain:
                "A nonce exists to destroy patterns. With a fresh nonce, encrypting the same message twice under the same key gives two unrelated-looking ciphertexts.",
            },
            {
              q: "The same one-time pad encrypts two messages. An attacker XORs the two ciphertexts together. What do they get?",
              options: [
                "The pad itself, in the clear",
                "Nothing but random noise",
                "The XOR of the two plaintexts — the pad cancels out",
                "The length of both messages",
              ],
              answer: 2,
              explain:
                "XOR is self-canceling: pad XOR pad is zero. What survives is m1 XOR m2, and two human-language plaintexts XORed together are recoverable by hand.",
            },
            {
              q: "Which is a sound way for a system to avoid repeating nonces?",
              options: [
                "Use the timestamp with second precision",
                "Use a counter that only moves forward, or a large CSPRNG nonce",
                "Reuse the salt from password hashing",
                "Ask the user to type a number",
              ],
              answer: 1,
              explain:
                "Forward-only counters and large random nonces are the standard answers. Second-precision timestamps repeat across machines and bursts, and humans are terrible dice.",
            },
          ],
        },
        {
          id: "crp-frequency",
          title: "Frequency Analysis: Building the Machine",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You met frequency analysis as an idea while breaking Caesar: English letters have a fingerprint, and shifting renames the letters without changing the pattern. Now let's build the tool properly — the way an attacker with a keyboard actually does it — because the technique generalizes far beyond Caesar.",
            },
            { type: "h", text: "Scoring how English a string looks" },
            {
              type: "p",
              text: "The machine version is a scoring function. Take a candidate decryption and measure the fraction of its characters that land in the common set: e, t, a, o, i, n and the space. Real English is dense with these — typically half or more of all characters. Wrong decryptions are junk strings where common letters appear at random rates, closer to a third.",
            },
            {
              type: "code",
              caption: "The entire weapon, in nine lines",
              code: `function englishScore(text) {
  const common = "etaoin ";
  let hits = 0;
  for (const ch of text.toLowerCase()) {
    if (common.includes(ch)) hits++;
  }
  return hits / text.length; // 0.58 looks English. 0.17 does not.
}`,
            },
            { type: "h", text: "Point it at every key" },
            {
              type: "p",
              text: "Now brute force stops requiring eyes. Try all 25 shifts, score each candidate, keep the highest. The computer reads every line for you and reports the one that looks like language. Twenty-five keys fall in milliseconds; the same loop over billions of keys is exactly what modern key sizes are designed to survive.",
            },
            {
              type: "code",
              caption: "Guess-and-score, automated",
              code: `let best = { score: -1, shift: 0, text: "" };
for (let shift = 0; shift < 26; shift++) {
  const guess = rotate(ciphertext, -shift);
  const score = englishScore(guess);
  if (score > best.score) best = { score, shift, text: guess };
}
console.log(best.text); // the message, no human reading required`,
            },
            { type: "h", text: "Why Vigenère held out longer" },
            {
              type: "p",
              text: "Vigenère blends several shifted alphabets, so the single-letter fingerprint smears across the ciphertext — the simple score stops working. But the key repeats, and repetition is a pattern of its own. Find where the ciphertext agrees with itself, measure the spacing, and the key length falls out; slice the message into columns and each column is just a Caesar again. Vigenère fell to exactly this in the 1860s. The lasting rule: patterns are poison. Any cipher that lets structure survive into its ciphertext is already dead — it just does not know it yet.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "englishScore is a blunt instrument — count seven characters, divide. Modern language models score text with billions of learned parameters, which is the same idea taken to its extreme: judge how language-like a string is. Against that, classical ciphers are not merely weak, they are transparent. The only survivors are ciphers designed so the ciphertext carries no structure at all.",
            },
          ],
          quiz: [
            {
              q: "In one sentence: what does englishScore measure?",
              options: [
                "The length of the text divided by the key size",
                "The fraction of characters from the most common English letters and space",
                "How many words appear in a dictionary",
                "The number of vowels per sentence",
              ],
              answer: 1,
              explain:
                "It measures the density of common characters. Genuine English is packed with e, t, a, o, i, n and spaces; a wrong decryption reads like random noise and scores much lower.",
            },
            {
              q: "Why does Vigenère resist the simple single-letter score?",
              options: [
                "Its keys are too long to guess",
                "Multiple shifted alphabets smear the letter fingerprint across the ciphertext",
                "It removes spaces from the message",
                "It changes the letter frequencies to uniform",
              ],
              answer: 1,
              explain:
                "Blending several alphabets dilutes the clean E-is-most-common signal. It resists the naive attack — until key repetition leaks the period and each column falls to plain Caesar cracking.",
            },
            {
              q: "Automated cracking — try every key, score each result, keep the best — is dangerous to modern ciphers because...",
              options: [
                "it is not; modern ciphers survive it, which is the whole point of modern key sizes",
                "computers can try 2 to the 128 keys in a weekend",
                "scoring functions have learned to read any language",
                "modern ciphers hide their ciphertext length",
              ],
              answer: 0,
              explain:
                "The guess-and-score loop is exactly what huge key spaces defend against. Twenty-five keys die in milliseconds; a 128-bit space makes the same attack physically hopeless.",
            },
          ],
          exercise: {
            prompt: [
              "Build the attacker's tool: a function that scores how English-looking a string is.",
              "englishScore(text) returns the fraction of characters that are e, t, a, o, i, n or a space, ignoring case. 'hello world' scores 4 out of 11.",
              "Lowercase everything before counting. An empty string scores 0.",
              "Watch the final two tests: correct English beats its own Caesar encryption. That is frequency analysis working.",
            ],
            starter: `function englishScore(text) {
  // Count characters from the common set
  // "etaoin " (case-insensitive), then divide
  // by the total length.
  // your code here
}`,
            tests: [
              {
                name: "'hello world' scores 4/11",
                code: "return Math.abs(englishScore('hello world') - 4 / 11) < 0.000001;",
              },
              {
                name: "empty text scores 0",
                code: "return englishScore('') === 0;",
              },
              {
                name: "case is ignored",
                code: "return englishScore('E T A O I N') === 1;",
              },
              {
                name: "real English beats its Caesar shift",
                code:
                  "return englishScore('this is a secret message') > englishScore('wklv lv d vhfuhw phvvdjh');",
              },
              {
                name: "common letters beat rare ones",
                code: "return englishScore('eeee') > englishScore('qqqq');",
              },
            ],
            solution: `function englishScore(text) {
  if (text.length === 0) return 0;
  const common = "etaoin ";
  let hits = 0;
  for (const ch of text.toLowerCase()) {
    if (common.includes(ch)) hits++;
  }
  return hits / text.length;
}`,
            hints: [
              "text.toLowerCase() first, then count — the common set is all lowercase.",
              "A simple loop with common.includes(ch) is all the counting you need.",
              "Guard against dividing by zero when the text is empty.",
            ],
          },
        },
        {
          id: "crp-cryptanalysis",
          title: "How Ciphers Fall",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You now own the attacker's basic toolkit: brute force, frequency scoring, and the knowledge that reused randomness is fatal. Time to organize it into the full menu professionals use, and then answer the most important question in this course: why does all of it bounce off modern encryption?",
            },
            { type: "h", text: "The attack menu" },
            {
              type: "list",
              items: [
                "Brute force — try every key. Works when the key space is small, hopeless when it is 128 bits.",
                "Frequency analysis — hunt the statistical fingerprints of language surviving in the ciphertext.",
                "Known-plaintext — you already possess a piece of the original message, and even that sliver helps unwind the key. Wartime codebreakers hunted for predictable phrases in enemy traffic — daily weather reports and standard greetings — for exactly this reason.",
                "Chosen-plaintext — trick the encryption machine into processing text you designed, and study the output. The classic: feed it a message made of one repeated character and read the structure straight out of the result.",
              ],
            },
            { type: "h", text: "Why modern crypto shrugs" },
            {
              type: "p",
              text: "Here is the part beginners find strange: AES has been public since 2001. Its complete design, every step, is published for anyone to read. Twenty-five years of the world's best cryptanalysts poking at it, and the best known practical attack still costs more work than trying every key. Modern ciphers are not safe because they are secret. They are safe because the mathematics of attacking them is expensive — and because generations of experts have failed to make it cheap.",
            },
            {
              type: "p",
              text: "So attackers do not attack the math. They attack everything around it: keys stored in world-readable files, randomness seeded from the clock, nonces that repeat under load, users phished out of their credentials, code that leaks secrets through how long it takes to run. The cipher is the hardened steel door in a house whose windows are propped open.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "THE GOLDEN RULE",
              text: "Never invent your own cipher. Every hobbyist cipher in history has fallen within months, often to techniques you just learned. Use standard, vetted libraries with standard, vetted algorithms. Originality is a virtue everywhere in computing except cryptography.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "Attackers now automate the hunt: bots scan the internet for vulnerable systems in minutes, and AI assists in finding sloppy patterns in leaked code. The defense is the same as it ever was — standard crypto, managed randomness, unique nonces — executed at machine speed too. Update fast, because the attack side certainly does.",
            },
          ],
          quiz: [
            {
              q: "What is a known-plaintext attack?",
              options: [
                "An attack where you know the cipher's source code",
                "An attack where you possess part of the original message and use it to help unwind the key",
                "An attack that only works on plaintexts you chose yourself",
                "An attack that requires knowing the hash of the message",
              ],
              answer: 1,
              explain:
                "A sliver of original text plus its ciphertext gives the attacker a foothold. Predictable phrases — greetings, weather formats — handed codebreakers exactly that, repeatedly.",
            },
            {
              q: "Why has nobody broken AES despite its design being public for decades?",
              options: [
                "The design is a closely guarded secret",
                "It is illegal to research",
                "The best known attacks still cost more work than brute force — the math holds",
                "It changes its algorithm every year",
              ],
              answer: 2,
              explain:
                "Openness is the point: decades of public scrutiny with no cheap attack found is the strongest endorsement cryptography knows. Secrecy, by contrast, is where weak ciphers hide.",
            },
            {
              q: "Real-world breaches of systems using strong crypto usually happen because...",
              options: [
                "the math finally failed",
                "attackers attacked the implementation, the randomness, or the humans around it",
                "computers got faster than expected",
                "the ciphertext was compressed first",
              ],
              answer: 1,
              explain:
                "The cipher is rarely the broken link. Keys leak from storage and memory, randomness is seeded predictably, nonces repeat, people are phished. Attack the house, not the steel door.",
            },
          ],
        },
        {
          id: "crp-boss-randomness",
          title: "The Chaos Warden",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Between you and the Public-Key Revolution stands the Chaos Warden — guardian of randomness, punisher of repeated nonces. It was born from the entropy of a thousand dice rolls and it can smell a predictable seed at forty paces.",
            },
            {
              type: "p",
              text: "Multiple-choice combat, as always. Every stage correct, or the Warden reshuffles reality and you begin again.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Chaos Warden",
            intro:
              "The room fills with swirling digits that never repeat. The Chaos Warden coalesces from the noise, flipping a coin that has never once landed. 'Order is easy,' it whispers. 'Show me you understand chaos.'",
            art: `        ,-------.
       /  x   x  \\
      |  \\___/   |
      |  [=====] |
       \\  ~~~~~ /
    .---\\______/---.
   | 1210011020010 |
    '=============='
      ||  ||  ||
      ==  ==  ==`,
            stages: [
              {
                question: "The Warden flickers: 'Two PRNGs, same seed. Their outputs?'",
                options: [
                  "Identical — a PRNG is a deterministic formula in a costume",
                  "Different — randomness is randomness",
                  "Identical for numbers, different for strings",
                  "Undefined behavior",
                ],
                answer: 0,
                explain:
                  "The seed is the entire secret of a PRNG. Same seed, same stream, forever — which is why guessed seeds sink cryptosystems.",
              },
              {
                question: "It conjures a key: 'Which tool may generate this?'",
                options: [
                  "Math.random — fast and battle-tested",
                  "Date.now — every millisecond differs",
                  "crypto.getRandomValues — seeded by real entropy, built for secrets",
                  "A human choosing digits with great effort",
                ],
                answer: 2,
                explain:
                  "Speed-first PRNGs, clocks, and human-chosen digits are all predictable enough to attack. CSPRNGs exist precisely to be the only acceptable source for keys.",
              },
              {
                question: "The Warden shows two ciphertexts made with one repeated one-time pad. 'XOR them together. What remains?'",
                options: [
                  "The pad, plainly visible",
                  "Pure noise",
                  "The XOR of the two plaintexts — the key has canceled out",
                  "The length of the key",
                ],
                answer: 2,
                explain:
                  "pad XOR pad is zero. What survives is plaintext XOR plaintext, and that is recoverable by hand. One repeated nonce deletes the entire key.",
              },
              {
                question: "'My scoring function,' it hisses, 'counts common letters and divides. What is it?'",
                options: [
                  "A checksum",
                  "Frequency analysis — hunting language's fingerprint in the ciphertext",
                  "A pseudorandom generator",
                  "Key stretching",
                ],
                answer: 1,
                explain:
                  "Measuring how English-like a candidate decryption is: the machine version of the attack that killed Caesar and, eventually, Vigenère.",
              },
              {
                question: "Final challenge: 'Strong cipher, published design, still breached in the real world. What broke?'",
                options: [
                  "The math — someone finally solved it",
                  "Nothing — the story is fake",
                  "The implementation, the randomness, or the humans around it",
                  "The publication of the design",
                ],
                answer: 2,
                explain:
                  "The cipher was the steel door; the attackers came through the windows. Keys leak, seeds are guessed, nonces repeat, people get phished. The math held.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "public-key",
      title: "Public-Key Revolution",
      blurb: "The 1970s breakthrough that lets strangers keep secrets in the open.",
      lessons: [
        {
          id: "crp-asymmetric",
          title: "Two Keys Are Better Than One",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Here's the 1970s breakthrough that made the internet possible. Take one key and split it into a pair: a key that locks, and a different key that unlocks. Give the locking one away to the entire world. Keep the unlocking one in your pocket, forever.",
            },
            { type: "h", text: "A padlock you can hand out" },
            {
              type: "p",
              text: "Think of your public key as an open padlock. You manufacture thousands of them and hand them to anyone who wants one — publish them on billboards if you like. Anyone can snap your padlock shut on a box and send it to you. But once it's closed, only one key on Earth opens it: your private key, which never leaves your pocket.",
            },
            {
              type: "code",
              caption: "The shape of public-key encryption",
              code: `// publicKey  = open padlocks, handed out to anyone
// privateKey = the only key that opens them

const message = "meet at dawn";
const locked = encrypt(alicePublicKey, message);  // anyone can lock
const opened = decrypt(alicePrivateKey, locked);  // only Alice opens`,
            },
            {
              type: "p",
              text: "Notice what just died: the key distribution problem. Nobody needs to share a secret with you in advance. Strangers can lock messages for you the moment they find your padlock, and interception gains nothing — the thief ends up holding a locked box with no key.",
            },
            {
              type: "p",
              text: "This is asymmetric encryption, also called public-key cryptography: two keys, different jobs, one public and one private. Its cost is speed — it's far slower than AES. So real systems use it like a match: struck once to light the fire, then fast symmetric encryption keeps it burning.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "The padlock analogy isn't just decoration — it's structurally exact. Public key: anyone can close the lock. Private key: only you can open it. Everything in the next three lessons is that sentence wearing different clothes.",
            },
            {
              type: "p",
              text: "Public-key crypto turns the key problem inside out: instead of sneaking a shared secret across a hostile wire, you publish a way for the world to lock things for you. The next lesson shows the strange arithmetic that makes it real.",
            },
          ],
          quiz: [
            {
              q: "In public-key cryptography, what do you hand out freely to the world?",
              options: [
                "Your public key, like an open padlock",
                "Your private key",
                "Your password",
                "Copies of your decrypted messages",
              ],
              answer: 0,
              explain: "The public key is meant to be published. It can lock messages for you, but only your private key — which stays secret — can open them.",
            },
            {
              q: "A message locked with your PUBLIC key can be unlocked by...",
              options: [
                "anyone who has the public key",
                "you alone, with your private key",
                "the sender, with a duplicate",
                "nobody — it's lost forever",
              ],
              answer: 1,
              explain: "That's the whole design: everyone can lock, only you can open. The sender couldn't even unsend their own message.",
            },
            {
              q: "Why do real systems switch to symmetric encryption after the handshake?",
              options: [
                "Public-key crypto is slow, so it's used briefly to agree on a fast session key",
                "Symmetric keys never expire",
                "Public-key crypto is illegal for long messages",
                "Browsers can't do math for long",
              ],
              answer: 0,
              explain: "The match lights the fire: a moment of slow public-key work to agree on a key, then fast symmetric encryption carries the conversation.",
            },
          ],
        },
        {
          id: "crp-rsa-idea",
          title: "RSA in Plain English",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "RSA ran the public-key world for decades, and its entire empire stands on one strange fact of arithmetic: some things are easy to do and brutally hard to undo. No formulas today — just the idea, which is genuinely enough.",
            },
            { type: "h", text: "The one-way street" },
            {
              type: "p",
              text: "Multiplying two big prime numbers is easy — any computer does it instantly. Now take the result and ask which two primes were multiplied to build it. That's factoring, and as the numbers grow it becomes cruel. There is no known shortcut. This gap — easy forward, brutal backward — is called a trapdoor.",
            },
            {
              type: "code",
              caption: "Easy one way, brutal the other",
              code: `// The one-way street at the heart of RSA:
const p = 61; // a prime
const q = 53; // another prime
const n = p * q; // 3233 — computed instantly

// Now reverse it: which two primes make 3233?
// Findable by hand. But for a 2048-bit n, no
// computer on Earth knows how — as far as anyone knows.`,
            },
            {
              type: "p",
              text: "RSA builds on that gap. The public key is derived from the product of two huge primes; the private key is derived from the primes themselves. Building the pair is easy. Taking the public key and factoring it back to steal the private one is believed hopeless. A stunning amount of the internet's history has rested on that belief.",
            },
            {
              type: "p",
              text: "Beliefs get stress-tested. As computers grew faster and factoring algorithms smarter, RSA keys had to grow too — from hundreds of bits in the early days to 2048 or more today. The math held, but the arms race never paused, and you'll meet its newest challenger in the final chapter.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "RSA's security is the assumption that factoring is hard — an assumption, not a law of nature. Chapter 4 introduces a kind of machine built to break exactly this.",
            },
            {
              type: "p",
              text: "You now understand RSA the way a locksmith understands a lock: not every gear, but exactly why it holds. Multiplication runs free; factoring hits a wall. Keep that wall in your pocket — the whole final chapter is about what happens if it ever falls.",
            },
          ],
          quiz: [
            {
              q: "RSA's security rests on which hard problem?",
              options: [
                "Multiplying two large primes together",
                "Factoring a huge number back into its two primes",
                "Sorting a list of numbers",
                "Counting letters in a message",
              ],
              answer: 1,
              explain: "Multiplication runs free; factoring the result back is brutally hard as numbers grow. RSA lives in that gap.",
            },
            {
              q: "Which direction is the EASY side of RSA's trapdoor?",
              options: [
                "Factoring the public number",
                "Guessing someone's private key",
                "Multiplying two big primes together",
                "Decrypting without any key",
              ],
              answer: 2,
              explain: "Building keys by multiplying primes is instant. Reversing — factoring the product — is the believed-hopeless side that protects everyone.",
            },
            {
              q: "Why have RSA key sizes grown over the decades?",
              options: [
                "Fashion — bigger numbers look impressive",
                "Computers and algorithms got better at factoring, so keys had to grow",
                "Keys shrink slightly every time they're used",
                "Smaller keys became more expensive",
              ],
              answer: 1,
              explain: "The arms race never stops: as factoring gets cheaper, the keys must get longer to keep the trapdoor shut.",
            },
          ],
        },
        {
          id: "crp-diffie-hellman",
          title: "Paint-Mixing Secrets",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Public-key encryption lets strangers send you sealed messages. But the 1970s had a second, sneakier problem: how do two people agree on a shared secret while an eavesdropper hears every single word they say? The answer, delightfully, involves paint.",
            },
            { type: "h", text: "The paint trick" },
            {
              type: "list",
              items: [
                "Everyone agrees on a public paint color — say, yellow",
                "Alice picks a secret color nobody else knows",
                "Bob picks a different secret color",
                "Each mixes their secret into the yellow and sends the mixture across the room, in the open",
                "Each pours their own secret color into the mixture they just received",
                "Both end up holding yellow plus both secrets — the identical final color",
              ],
            },
            {
              type: "p",
              text: "Follow what the eavesdropper saw: the yellow, and two mixed cans. From those she cannot un-mix the paint and recover either secret — mixing is easy, un-mixing is impossible. Yet Alice and Bob now hold the same color that nobody else on Earth can produce.",
            },
            {
              type: "code",
              caption: "The paint trick, translated to math",
              code: `// Diffie-Hellman, in outline:
// public:      a big prime p and a base g  (the shared yellow)
// Alice sends: g^a mod p                   (yellow + her secret)
// Bob sends:   g^b mod p                   (yellow + his secret)
// Both compute the same final secret: g^(a*b) mod p
// Mixing the math is easy. Un-mixing it, for a big p,
// is believed hopeless. That's the entire trick.`,
            },
            {
              type: "p",
              text: "Diffie-Hellman does exactly this with numbers instead of paint. Two parties who never shared anything secret end up holding the same number, agreed entirely in public — and that number is typically used immediately as a key for fast symmetric encryption. The key problem, solved.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "When a protocol brags about 'key agreement' or 'key exchange', this paint trick is usually what's underneath. It's one of the most elegant ideas in the field, and it arrived in the 1970s alongside public-key encryption itself.",
            },
            {
              type: "p",
              text: "One warning, and it matters: Diffie-Hellman agrees on a secret with whoever happens to be on the other end of the wire. It never checks who that is. Hold that thought — it's the exact crack a certain kind of attacker slides through, and you'll face them at the end of this chapter.",
            },
          ],
          quiz: [
            {
              q: "In the paint analogy, what does the eavesdropper actually see?",
              options: [
                "Both secret colors",
                "The public yellow and the two public mixtures — never a secret color",
                "Nothing at all",
                "Only the final shared color",
              ],
              answer: 1,
              explain: "Everything sent is public. But paint can't be un-mixed, so the secrets never leave the two heads that hold them.",
            },
            {
              q: "After a Diffie-Hellman exchange, the two parties...",
              options: [
                "hold the same shared secret, agreed entirely in public",
                "each hold half of a useless key",
                "must meet in person to finish",
                "know each other's private keys",
              ],
              answer: 0,
              explain: "Both sides combine what they received with their own secret and land on the identical value — no secret ever traveled.",
            },
            {
              q: "That shared value is typically used as...",
              options: [
                "decoration for the connection details",
                "the key for fast symmetric encryption of the session",
                "a certificate signature",
                "the site's password",
              ],
              answer: 1,
              explain: "The heavy public-key math runs once to produce a session key; fast symmetric encryption then does the actual work.",
            },
          ],
        },
        {
          id: "crp-signatures",
          title: "Signatures & Certificates",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Encryption keeps a message secret. But secrecy isn't the only thing worth proving. When your browser talks to your bank, two other questions matter enormously: is this really the bank, and has anyone tampered with the message on the way?",
            },
            { type: "h", text: "Sign with the private key" },
            {
              type: "p",
              text: "Public-key crypto has a beautiful second act: run it backwards. A digital signature is made with your private key, and anyone on Earth can check it with your public key. A valid signature proves two things at once: the message came from the holder of that private key, and it hasn't changed by even one bit since it was signed.",
            },
            {
              type: "code",
              caption: "Private key signs, public key verifies",
              code: `// Sign with the private key, verify with the public one:
const signature = sign(alicePrivateKey, hash(message));

// Anyone on Earth can run this check:
const ok = verify(alicePublicKey, hash(message), signature);

// ok === true means Alice's key signed this exact message.
// Flip one comma in the message, and ok becomes false.`,
            },
            {
              type: "p",
              text: "Notice the hash hiding in that code: signatures are computed over a message's fingerprint, not the whole message. Your two favorite primitives, working together — hashes supply the fingerprint, public-key math stamps it.",
            },
            { type: "h", text: "Certificates: vouching for keys" },
            {
              type: "p",
              text: "One loose end remains. A public key is just a long number — it says nothing about who owns it. A certificate fixes that: a public key plus an identity, like a domain name, wrapped together and signed by a certificate authority — a notary whose own key your browser already trusts. Browsers ship with a built-in list of these authorities, and every legitimate certificate chains back to one of them.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Think of a certificate as a wax seal stamped by a notary everyone already trusts. The seal doesn't make the letter's contents true — it proves the letter really came from the name on the outside.",
            },
            {
              type: "p",
              text: "Signatures and certificates close the last gap: not just 'is this secret?' but 'is this really them, untouched?'. Everything assembles in the next lesson, under a padlock you already click every day.",
            },
          ],
          quiz: [
            {
              q: "A digital signature is created with which key?",
              options: [
                "The recipient's private key",
                "A session key",
                "The sender's public key",
                "The sender's private key",
              ],
              answer: 3,
              explain: "Sign with the private key, verify with the public one. Only the holder of the private key could have produced the signature.",
            },
            {
              q: "Someone alters one word of a signed message. Verification now...",
              options: [
                "passes — signatures ignore content",
                "fails — the tampering is detected",
                "updates the signature automatically",
                "emails the sender for permission",
              ],
              answer: 1,
              explain: "The signature covers a fingerprint of the exact message. Change one bit and the fingerprint no longer matches, so verification fails.",
            },
            {
              q: "What does a certificate bind together?",
              options: [
                "A public key and an identity, vouched for by a certificate authority",
                "Your password and your username",
                "The server's private key and its IP address",
                "Every message ever sent to the site",
              ],
              answer: 0,
              explain: "A certificate is an identity card for a public key, stamped by an authority your browser already trusts. It answers: who does this key belong to?",
            },
          ],
        },
        {
          id: "crp-https",
          title: "What the Padlock Means",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You click the padlock a hundred times a day. Here's what actually happens in that first fraction of a second when your browser connects to a secure site — every piece you've learned, working as one machine.",
            },
            { type: "h", text: "The handshake, in three moves" },
            {
              type: "list",
              items: [
                "The browser checks the site's certificate — signed by an authority it trusts, matching the domain it's visiting",
                "Browser and server run a key agreement, Diffie-Hellman style, and both land on the same fresh session key",
                "The whole conversation switches to fast symmetric encryption with that key",
              ],
            },
            {
              type: "p",
              text: "That's the division of labor. Slow, heavyweight public-key crypto works for one moment to agree on a secret safely; then fast symmetric encryption, usually AES, carries the actual conversation. Ceremonial match, then firewood.",
            },
            {
              type: "p",
              text: "So what does the padlock actually promise? Two things: everything you exchange is encrypted, and any tampering in transit would be detected. It does not promise the site is honest — a scam site can hold a perfectly valid certificate. And the site itself sees everything you send it: you're having a private conversation with the site, not hiding from it.",
            },
            {
              type: "ascii",
              art: `      ____
     /    \\
    |      |
  __|      |__
 |  \\______/  |
 |            |
 |   (====)   |
 |____________|`,
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Never click through a certificate warning. The warning is the one alarm that detects impersonation in progress. Stop, double-check the URL, and come back later if it persists.",
            },
            {
              type: "p",
              text: "You now know what that little padlock means: certificates vouched, keys agreed in the open, symmetric fire burning, tampering detected. You also know what it doesn't mean — and that's the part most people never learn.",
            },
          ],
          quiz: [
            {
              q: "In the TLS handshake, what happens right after the certificate checks out?",
              options: [
                "Both sides agree on a fresh session key, then switch to fast symmetric encryption",
                "The site begins reading your files",
                "Traffic continues in plain text for speed",
                "The browser downloads a new certificate for every page",
              ],
              answer: 0,
              explain: "Certificate verified, keys agreed, then the fast lane opens. Public-key crypto does the ceremony; AES does the carrying.",
            },
            {
              q: "The padlock on a site means the connection is encrypted. What does it NOT mean?",
              options: [
                "Your data is protected in transit",
                "Tampering would be detected",
                "The site itself is honest and safe",
                "The certificate was verified",
              ],
              answer: 2,
              explain: "TLS protects the pipe, not the person at the other end. A perfectly valid certificate can belong to a scam site.",
            },
            {
              q: "Your browser shows a certificate warning. The right reaction is...",
              options: [
                "click through — warnings are usually false alarms",
                "stop and investigate — the chain of trust failed, possibly an impersonation",
                "refresh until the warning disappears",
                "turn off your antivirus",
              ],
              answer: 1,
              explain: "The warning means the identity proof failed. Sometimes it's a server mistake — and sometimes it's an attacker in the middle, right now.",
            },
          ],
        },
        {
          id: "crp-boss-mitm",
          title: "The Man in the Middle",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Something is wrong with this network. Every byte between you and the outside world is passing through a stranger's hands, and the stranger is patient.",
            },
            {
              type: "p",
              text: "Six moves to cut them out. Miss one, and they stay in the middle.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Man in the Middle",
            intro: "Someone is relaying your traffic — reading it, maybe rewriting it. Six moves to cut them out of the conversation.",
            art: `   YOU                        BANK
  .---.                      .---.
  | o |~~~~~~~~~~~~~~~~~~~~~~| o |
  '---'                      '---'
       \\                    /
        \\    .--------.    /
         \\__(  O O   )__/
              \\__^__/
           THE MIDDLEMAN`,
            stages: [
              {
                question: "You're on open cafe wifi with no encryption. What can the relay between you and the internet see?",
                options: [
                  "Only which sites you visit, not the content",
                  "Everything — URLs, logins, messages, all in the clear",
                  "Nothing — wifi is private by design",
                  "Only the images",
                ],
                answer: 1,
                explain: "Unencrypted traffic is a postcard. Anyone in the middle reads every word, including the password you just typed.",
              },
              {
                question: "You switch to Diffie-Hellman key agreement. The relay simply runs DH with you and with the real site, passing bytes through. What went wrong?",
                options: [
                  "DH is too old to trust",
                  "DH agrees on a secret with whoever answers — it never checks WHO that is",
                  "DH only works on wired networks",
                  "You chose a bad prime number",
                ],
                answer: 1,
                explain: "Key agreement without authentication is a phone call with no caller ID. You now share secrets with the relay, happily.",
              },
              {
                question: "What does the site's certificate actually prove?",
                options: [
                  "That the site never goes down",
                  "That this public key belongs to this domain, vouched for by a certificate authority",
                  "That the site is popular and well-run",
                  "That your wifi is clean",
                ],
                answer: 1,
                explain: "A certificate binds an identity to a key, signed by an authority your browser already trusts. That's the caller ID you were missing.",
              },
              {
                question: "The padlock is lit. What does it guarantee — and what does it not?",
                options: [
                  "It guarantees encryption in transit; it does not vouch for the site's honesty",
                  "It guarantees the site is honest and its owner is kind",
                  "It guarantees your passwords are strong",
                  "It hides your traffic from the site you're visiting",
                ],
                answer: 0,
                explain: "TLS protects the pipe, not the person at the far end. A scam site can wear a perfectly valid padlock.",
              },
              {
                question: "Mid-handshake, the browser flags the certificate as invalid. What does that mean?",
                options: [
                  "The site is under maintenance",
                  "The chain of vouching failed — expired, mismatched, or someone is impersonating the site right now",
                  "Your battery is low",
                  "TLS has been retired worldwide",
                ],
                answer: 1,
                explain: "The identity proof didn't check out. Sometimes it's sloppy server admin — and sometimes it's the person in the middle, this exact second.",
              },
              {
                question: "Final move. A coworker waves it off: it worked yesterday, just click through. What do you do?",
                options: [
                  "Click through — yesterday is good enough",
                  "Email the password to the site instead",
                  "Stop, report it, and return only when the certificate checks out",
                  "Keep refreshing until the warning gets bored",
                ],
                answer: 2,
                explain: "Clicking through trains everyone to ignore the one alarm that detects impersonation. The correct response to a TLS error is stop and verify.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ai-age",
      title: "Crypto in the AI Age",
      blurb: "What holds when machines get smart — and what breaks.",
      lessons: [
        {
          id: "crp-ai-vs-crypto",
          title: "Can AI Crack Encryption?",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Headlines love this one: AI is coming for your encryption. Time for an honest answer, because the truth is more interesting than the headline — and much more useful to you.",
            },
            { type: "h", text: "The math holds" },
            {
              type: "p",
              text: "AI does not break the mathematics. Brute forcing a 256-bit key is hopeless because the key space is astronomically large, and being clever doesn't conjure a shortcut — none is known, for any machine or any mind. The cipher stands exactly where it stood.",
            },
            { type: "h", text: "Where AI actually helps attackers" },
            {
              type: "list",
              items: [
                "Phishing that is more convincing, more personal, and better spelled than ever",
                "Hunting for buggy crypto implementations in real code",
                "Guessing weak passwords and keys faster than yesterday's tools",
              ],
            },
            {
              type: "p",
              text: "Notice the pattern: every single item attacks the humans and the implementation, not the cipher. Encryption rarely falls to a frontal assault. It falls to a reused key, a bad random number, a fooled user, a sloppy configuration.",
            },
            {
              type: "p",
              text: "The honest long-term threat isn't AI at all — it's quantum computers. Shor's algorithm, run on a large enough quantum machine, would break the factoring-based systems like RSA from the last chapter. Symmetric crypto survives that era by growing bigger keys. The final lessons pick up that story.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "In practice, the weakest link in encryption is almost never the cipher — it's the human holding the key and the code implementing the math. AI makes attacking those links cheaper, which makes getting them right matter more.",
            },
          ],
          quiz: [
            {
              q: "Can today's AI brute-force an AES-256 key?",
              options: [
                "Yes — any modern laptop can",
                "No — the key space is astronomically large and no shortcut is known",
                "Yes, but only overnight",
                "Only if the AI trains for a week",
              ],
              answer: 1,
              explain: "The math doesn't care how smart the attacker is: there's no known clever way to try 2 to the power 256 keys. The cipher stands.",
            },
            {
              q: "Where does AI genuinely make attackers more dangerous?",
              options: [
                "Instantly reversing SHA-256",
                "Factoring RSA keys by intuition",
                "Better phishing, and faster discovery of weak passwords and buggy implementations",
                "Deleting certificates remotely",
              ],
              answer: 2,
              explain: "AI attacks the humans and the code around the crypto, not the crypto itself. Those links were always the softest anyway.",
            },
            {
              q: "Which systems does Shor's algorithm threaten?",
              options: [
                "Public-key systems built on factoring, like RSA",
                "XOR operations",
                "One-time pads",
                "Salted password hashes",
              ],
              answer: 0,
              explain: "A large quantum computer running Shor's algorithm would factor big numbers — exactly the wall RSA stands on. Symmetric crypto survives with bigger keys.",
            },
          ],
        },
        {
          id: "crp-e2ee",
          title: "End-to-End Encryption",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Your chat app's servers relay billions of messages a day. With end-to-end encryption — E2EE — they do it while understanding none of them. The server becomes a postal service that cannot read the postcards it delivers.",
            },
            { type: "h", text: "The keys never leave your devices" },
            {
              type: "p",
              text: "In E2EE, the keys live only on the endpoints: your phone and your friend's phone. Your message is locked on your device, travels as gibberish, and is unlocked on theirs. The server relays ciphertext and nothing else — not with a warrant, not with a court order. The provider genuinely cannot read the content, because the keys to unscramble it are never in its hands.",
            },
            {
              type: "p",
              text: "What E2EE does not hide is the envelope. Who you talk to, when, how often, how much you send — that metadata stays visible to the provider, and in various ways to the network. The letter is sealed; the address book is not.",
            },
            { type: "h", text: "The backdoor question" },
            {
              type: "p",
              text: "Some governments argue providers should keep an exceptional-access backdoor for lawful investigations. Cryptographers answer that a backdoor built for anyone is a backdoor findable by everyone — it rebuilds the single point of failure that E2EE exists to remove. That is the entire debate, honestly stated.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "The same logic reaches your AI habits. Paste a secret into a chat that isn't end-to-end encrypted, and you've handed plaintext to whoever runs it — plus whoever records the wire. Encryption protects the pipe; you decide what goes into it.",
            },
          ],
          quiz: [
            {
              q: "In an end-to-end encrypted chat, who can read a message's content?",
              options: [
                "Anyone monitoring the wifi",
                "The app's servers, since they relay it",
                "Your internet provider",
                "Only the devices holding the keys — the endpoints",
              ],
              answer: 3,
              explain: "Keys live on your device and the recipient's device. The server relays sealed envelopes it cannot open.",
            },
            {
              q: "What can an E2EE provider still learn about you?",
              options: [
                "Message contents, if asked politely",
                "Metadata — who you message, when, and how much",
                "Your password",
                "Nothing whatsoever, not even addresses",
              ],
              answer: 1,
              explain: "The letter is sealed but the envelope is readable. Metadata survives end-to-end encryption, and metadata tells stories.",
            },
            {
              q: "The backdoor debate, stated fairly:",
              options: [
                "Backdoors are always harmless",
                "Backdoors are physically impossible",
                "Law enforcement wants exceptional access; cryptographers answer that a backdoor for anyone is a backdoor for everyone",
                "Backdoors only affect email servers",
              ],
              answer: 2,
              explain: "That's the honest standoff: investigative power versus the fact that hidden access can be found by any party, not just the intended one.",
            },
          ],
        },
        {
          id: "crp-zero-knowledge",
          title: "Prove Without Showing",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Prove you know a secret without revealing one bit of it. It sounds impossible — like proving there's money in your pocket without showing the amount. It's real mathematics, decades old, and it runs quietly inside systems you use.",
            },
            { type: "h", text: "The Ali Baba cave" },
            {
              type: "p",
              text: "Picture a circular cave with two entrances, left and right, meeting at the back behind a magic door. The door opens only to a secret word. You claim to know the word. I want proof — but you refuse to say the word, because I might be a blabbermouth.",
            },
            {
              type: "p",
              text: "So we run a ritual. You walk in, secretly choosing left or right. From the entrance, I shout a demand: come out left, or come out right. If you truly know the word, you can always comply — stroll to the door, whisper it, and exit whichever side I called. If you're bluffing, you can only comply when you happened to enter the side I demanded. That's pure luck, half the time.",
            },
            {
              type: "code",
              caption: "Twenty rounds of the cave ritual",
              code: `function caveDemo(knowsTheWord) {
  let passed = 0;
  for (let round = 0; round < 20; round++) {
    const entered = Math.random() < 0.5 ? "left" : "right";
    const demanded = Math.random() < 0.5 ? "left" : "right";
    if (knowsTheWord || entered === demanded) passed++;
  }
  return passed === 20; // a faker passes ~1 time in a million
}`,
            },
            {
              type: "p",
              text: "One round proves almost nothing, since a faker passes half the time. So we repeat. After twenty rounds, a faker's odds collapse to about one in a million. I'm now convinced you know the word — and here's the miracle: I've learned nothing about the word itself. Not its length, not its first letter. Only the fact that you know it.",
            },
            {
              type: "p",
              text: "That's a zero-knowledge proof, and modern systems use the idea constantly: proving you know a password without transmitting it, proving you're old enough without showing your birthdate, proving a blockchain transaction is valid without revealing balances. Convince without revealing — a whole branch of cryptography in one sentence.",
            },
          ],
          quiz: [
            {
              q: "In the Ali Baba cave, a faker who doesn't know the magic word still passes a single round...",
              options: [
                "never — the ritual is perfect",
                "about half the time, by luck of which side they entered",
                "every single time",
                "only when the verifier blinks",
              ],
              answer: 1,
              explain: "The faker complies only when the demanded side happens to match the side they entered. That's a coin flip.",
            },
            {
              q: "After enough cave rounds, what does the verifier know about the secret word itself?",
              options: [
                "Its first letter",
                "Its approximate length",
                "Nothing — only that you know it",
                "Everything — that was the point",
              ],
              answer: 2,
              explain: "That's the zero in zero-knowledge: the proof convinces without revealing. Repeat enough rounds and luck is ruled out, secrets stay secret.",
            },
          ],
        },
        {
          id: "crp-future-crypto",
          title: "After Quantum",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Somewhere, an adversary is recording encrypted traffic and filing it away, betting that one day the math will give out. Today's traffic, saved for tomorrow's machines. The threat already has a name, and if your secrets are long-lived, it should worry you.",
            },
            { type: "h", text: "Harvest now, decrypt later" },
            {
              type: "p",
              text: "Here's the attack: capture encrypted traffic today — useless to you now — and store it. Wait for quantum computers capable of breaking today's public-key exchange. Then rewind the tapes. Anything encrypted under keys that can be retroactively broken becomes an open book. Health records, state secrets, anything that must stay private for decades: for those, the clock is already running.",
            },
            {
              type: "p",
              text: "The defense exists. Standards bodies have published post-quantum algorithms — NIST finalized the first standards in 2024 — built on different hard problems. Where RSA leans on factoring, these lean on lattices: geometric problems believed to shrug off quantum attack. Migration across the industry has begun.",
            },
            { type: "h", text: "Crypto agility" },
            {
              type: "list",
              items: [
                "Systems designed so algorithms can be swapped, not soldered in",
                "Protocols that version their crypto and negotiate upgrades",
                "Keys rotated on schedule, never held forever out of laziness",
                "Migration treated as routine maintenance, not a one-time emergency",
              ],
            },
            {
              type: "p",
              text: "That last item is the quiet revolution. Security teams used to pick a cipher and marry it. The new expectation is serial monogamy: run the best algorithm today, and be ready to replace it — everywhere, quickly — the day the math shifts.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "The next decade of security looks less like waiting for a breakthrough and more like running a migration project: auditing, upgrading, and swapping algorithms across millions of systems. Unglamorous — and exactly what keeps yesterday's secrets safe.",
            },
          ],
          quiz: [
            {
              q: "Harvest now, decrypt later describes...",
              options: [
                "backing up your own keys safely",
                "adversaries recording encrypted traffic today, betting future quantum computers will crack it",
                "deleting old ciphertext on schedule",
                "a farming technique",
              ],
              answer: 1,
              explain: "Stored ciphertext outlives the strength of its crypto. For secrets that must hold for decades, tomorrow's quantum threat is today's problem.",
            },
            {
              q: "The new post-quantum algorithms are built on...",
              options: [
                "the same factoring problem as RSA, but slower",
                "entirely different hard problems, like lattices",
                "smaller keys and optimism",
                "AI language models",
              ],
              answer: 1,
              explain: "Post-quantum standards lean on different mathematical walls — lattice problems — believed to stand even against quantum attack.",
            },
            {
              q: "Crypto agility means...",
              options: [
                "doing cryptography while exercising",
                "designing systems so algorithms can be swapped when the math shifts",
                "committing to one algorithm forever, for security",
                "hiding which cipher you use from attackers",
              ],
              answer: 1,
              explain: "Agile systems treat algorithms as replaceable parts. When a wall shows cracks, you swap it without rebuilding the whole castle.",
            },
          ],
        },
        {
          id: "crp-boss-vault-final",
          title: "THE VAULT",
          minutes: 6,
          xp: 100,
          concept: [
            {
              type: "p",
              text: "This is it. The final lock of the course, welded together from every chapter: ancient ciphers, hashes and salts, key exchange, certificates, and the quantum horizon.",
            },
            {
              type: "p",
              text: "Eight tumblers. No hints from me. Whatever is inside THE VAULT, you've earned the combination.",
            },
          ],
          quiz: [],
          boss: {
            name: "THE VAULT",
            intro: "The final lock combines everything you have learned. Eight tumblers, one door, no hints. Crack the combination.",
            art: `     ________________________
    |     THE FINAL VAULT     |
    |________________________|
    |    _____      _____    |
    |   |  *  |    | (o) |   |
    |   |_____|    |_____|   |
    |________________________|
    |  8 tumblers, no mercy  |
    |________________________|`,
            stages: [
              {
                question: "Tumbler one hums: which of these actually keeps a secret?",
                options: [
                  "Base64-encoding the message",
                  "Compressing the message into a zip file",
                  "Encrypting it with a key only the recipient holds",
                  "Renaming the file to secret-dot-txt",
                ],
                answer: 2,
                explain: "Encoding and compression are translations anyone can undo. Only a key — a secret — turns scrambling into encryption.",
              },
              {
                question: "Tumbler two displays a fingerprint. Which hash property makes it useful for checking integrity?",
                options: [
                  "It can be reversed with the right password",
                  "It is one-way — the fingerprint cannot be walked back to the file",
                  "It shrinks files for storage",
                  "It encrypts with a public key",
                ],
                answer: 1,
                explain: "One-way plus avalanche: verify all day, never recover. Change one bit of input and the fingerprint changes beyond recognition.",
              },
              {
                question: "The vault's own password store is next. How should it look?",
                options: [
                  "Passwords in plain text, sorted alphabetically",
                  "One encrypted vault holding every password",
                  "A per-user random salt mixed into a deliberately slow hash",
                  "Passwords Base64-encoded for obfuscation",
                ],
                answer: 2,
                explain: "Salt kills precomputed tables; slow hashing makes guessing expensive. Together they turn a leak into a long, grinding, expensive slog.",
              },
              {
                question: "Tumbler four freezes a TLS handshake mid-air. Why does TLS use BOTH asymmetric and symmetric crypto?",
                options: [
                  "To confuse attackers with variety",
                  "Asymmetric is slow but solves key agreement — it hands off to fast symmetric for the actual data",
                  "Symmetric is slow but very strong",
                  "It flips between them at random",
                ],
                answer: 1,
                explain: "Public-key math does one careful, slow job: establishing a shared key. Symmetric encryption then carries the whole conversation at speed.",
              },
              {
                question: "The vault demands a certificate before continuing. What job does that certificate do?",
                options: [
                  "It encrypts the page content",
                  "It proves the public key belongs to the real vault, vouched for by a certificate authority",
                  "It compresses the handshake",
                  "It stores the user's passwords",
                ],
                answer: 1,
                explain: "Without a certificate, you might be agreeing on keys with an impostor. The cert is public-key crypto's identity card.",
              },
              {
                question: "A voice from the walls: AI will crack AES any day now. Is it right?",
                options: [
                  "Yes — modern AI brute forces 256-bit keys routinely",
                  "No — the math holds; the weak links are humans, passwords, and buggy implementations",
                  "Yes, but only for uppercase letters",
                  "No, because AES is classified",
                ],
                answer: 1,
                explain: "No known shortcut exists for AES keys, AI or otherwise. Real break-ins go around the cipher — through people and code.",
              },
              {
                question: "Deep in the vault, a recorder hoards today's encrypted traffic. What is it betting on?",
                options: [
                  "That you'll forget your password",
                  "Harvest now, decrypt later — future machines breaking today's public-key exchange",
                  "That hashes will reverse themselves",
                  "That the vault will rust open",
                ],
                answer: 1,
                explain: "Recorded traffic outlives the era of its crypto. Secrets that must hold for decades need post-quantum protection today.",
              },
              {
                question: "Final tumbler: the vault's own messenger is end-to-end encrypted. What does the relaying server see?",
                options: [
                  "Plaintext messages and a full content log",
                  "Ciphertext it cannot read, plus metadata — who, when, how much",
                  "Absolutely nothing, not even addresses",
                  "Only the emoji",
                ],
                answer: 1,
                explain: "E2EE blinds the server to content, not to envelopes. Metadata survives — that is the honest limit of the guarantee.",
              },
            ],
          },
        },
      ],
    },
  ],
};
