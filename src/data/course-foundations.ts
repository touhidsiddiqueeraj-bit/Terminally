import type { Course } from "./types";

export const foundationsCourse: Course = {
  id: "foundations",
  title: "Digital Foundations",
  subtitle: "How computers and the internet actually work — the base layer every modern skill sits on.",
  icon: "cpu",
  color: "green",
  chapters: [
    {
      id: "bits-and-bytes",
      title: "Bits & Bytes",
      blurb: "Before crypto, before code: learn to think in the machine's own language.",
      lessons: [
        {
          id: "fnd-what-is-a-computer",
          title: "What Is a Computer, Anyway?",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You have tapped these glowing rectangles thousands of times. But what actually is a computer? Strip away the brands and the bezels, and every computer ever built — from a room-sized machine of the 1950s to the phone in your pocket — does exactly one thing: it takes information in, transforms it, and puts results out.",
            },
            { type: "h", text: "The three-step secret" },
            {
              type: "p",
              text: "The pattern is called input, process, output. Input is anything you feed the machine: keystrokes, taps, a photo, sensor readings. Processing is the transformation it performs on that input. Output is the result it hands back: pixels on a screen, sound in your headphones, a confirmation email. A calculator does it with numbers. A game does it with physics and pixels. Same skeleton, different muscles.",
            },
            {
              type: "code",
              caption: "Every program ever written fits this shape",
              code: `// Input, process, output — the shape of every program
const name = "Ada";                      // input
const greeting = "Hello, " + name + "!"; // process: combine
console.log(greeting);                   // output: "Hello, Ada!"`,
            },
            { type: "h", text: "Hardware, software, and the cast" },
            {
              type: "p",
              text: "The physical parts you could point at — chips, boards, keys — are hardware. The instructions telling them what to do are software. Inside the hardware, three players matter most: the CPU does the thinking, memory (also called RAM) is its scratchpad for whatever is happening right now, and storage is the filing cabinet that keeps your files safe even when the power is off.",
            },
            {
              type: "table",
              headers: ["Part", "Job", "Analogy"],
              rows: [
                ["CPU", "Does the actual thinking, one tiny step at a time", "The cook following a recipe"],
                ["Memory (RAM)", "Holds what the computer is working on right now", "A scratchpad next to the cook"],
                ["Storage", "Keeps files safe even when the power is off", "A filing cabinet in the basement"],
              ],
            },
            {
              type: "p",
              text: "Here is the punchline that sets up everything else in this course: deep down, a computer is billions of tiny electronic switches, each one either on or off. There is no magic inside — just an absurd number of absurdly small switches, flipping absurdly fast. The rest of this chapter teaches you how to read the machine's mind.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "You do not need to memorize specs. Chips get faster and drives get bigger every year, but the mental model — input, process, output, with a thinker, a scratchpad and a filing cabinet — has held for decades. Learn the model once and it keeps paying rent.",
            },
          ],
          quiz: [
            {
              q: "Which sequence describes what a computer does with information?",
              options: [
                "Input, then process, then output",
                "Output, then process, then input",
                "Process, then discard, then repeat",
                "Input, then store, then forget",
              ],
              answer: 0,
              explain:
                "Every computation follows this shape: information goes in, the processor transforms it, and a result comes out. Whether it is a calculator or a game, the skeleton is the same.",
            },
            {
              q: "Which part is the computer's scratchpad — fast, but wiped clean when the power goes off?",
              options: ["The storage drive", "The CPU", "The memory (RAM)", "The screen"],
              answer: 2,
              explain:
                "RAM holds whatever the machine is actively working on, and it empties on shutdown. Storage is the filing cabinet that keeps files when power is off.",
            },
          ],
        },
        {
          id: "fnd-binary",
          title: "Speaking Binary",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Machines have no letters and no digits. A wire can carry voltage or it cannot, and that is the whole menu. So computers speak the smallest language possible: two symbols, 1 and 0. It is called binary, and once you can read a little of it, computers stop being mysterious.",
            },
            { type: "h", text: "One switch, two states" },
            {
              type: "p",
              text: "A single 1 or 0 is called a bit — short for binary digit. A bit is one switch: off is 0, on is 1, the same way a light switch is either up or down. One bit can say two things. Two bits can say four things. Ten bits can say 1,024 things. The pattern is doubling, and doubling adds up terrifyingly fast.",
            },
            { type: "h", text: "Place values that double" },
            {
              type: "p",
              text: "You already read a positional number system. In decimal, each slot is worth ten times the slot to its right: 1, 10, 100. Binary uses the same trick with twos: each slot is worth double the one to its right — 1, 2, 4, 8, 16. So the binary number 1010 is not one thousand and ten. Read it slot by slot: one 8, zero 4s, one 2, zero 1s. Eight plus two. It is ten.",
            },
            {
              type: "code",
              caption: "Reading 1010 exactly like the machine does",
              code: `let value = 0;
for (const bit of "1010") {
  value = value * 2 + Number(bit); // double, then add
}
console.log(value); // 10`,
            },
            {
              type: "list",
              items: [
                "Count 0 is 0",
                "Count 1 is 1",
                "Count 2 is 10",
                "Count 3 is 11",
                "Count 4 is 100",
                "Count 5 is 101",
                "Count 6 is 110",
                "Count 7 is 111",
                "Count 8 is 1000",
                "Count 9 is 1001",
                "Count 10 is 1010",
              ],
            },
            {
              type: "callout",
              variant: "info",
              title: "WHY BINARY WINS",
              text: "Electricity is noisy. If a wire had to hold ten precise voltage levels to represent the digits 0 through 9, tiny fluctuations would corrupt the data constantly. Two states — clearly high or clearly low — stay readable even through noise. Binary is not clever so much as it is robust.",
            },
            {
              type: "p",
              text: "Your turn to think in binary. In the exercise below you will convert binary strings into ordinary numbers. Notice what the loop is doing: as you walk the string left to right, each step doubles everything you have built so far — which is exactly how place values grow. That is the whole trick, and it is why the loop is three lines long.",
            },
          ],
          quiz: [
            {
              q: "A single bit can hold how many different values?",
              options: ["Two — 0 or 1", "Eight", "Ten", "256"],
              answer: 0,
              explain:
                "A bit is one switch with two states: on or off, 1 or 0. That is the machine's entire vocabulary at the bottom layer.",
            },
            {
              q: "In the binary number 1010, what is the leftmost 1 worth?",
              options: ["1", "2", "8", "10"],
              answer: 2,
              explain:
                "Binary place values double from right to left: 1, 2, 4, 8. The leftmost bit of 1010 sits in the 8s place, so the number means 8 + 0 + 2 + 0 = 10.",
            },
            {
              q: "Why did binary win as the language of hardware?",
              options: [
                "It was the fastest to type",
                "Two states are easy to tell apart even when electrical signals are noisy",
                "It uses less electricity than other systems",
                "It was required by early computing law",
              ],
              answer: 1,
              explain:
                "A wire only needs to be clearly high or clearly low, so tiny amounts of noise cannot corrupt the meaning. That reliability is everything when billions of signals fly around each second.",
            },
          ],
          exercise: {
            prompt: [
              "Time to read binary like the machine does — left to right, doubling as you go.",
              "Write binaryToDecimal so that it takes a string like '1010' and returns the number it represents, which is 10.",
              "The trick: start at 0. For every bit, double your total, then add the bit. By the end you hold the value.",
              "Your code replaces the comment between let total = 0 and return total.",
            ],
            starter: `function binaryToDecimal(binary) {
  // Walk the string left to right.
  // Each step: double the total, then add the current bit.
  let total = 0;
  // your code here
  return total;
}`,
            tests: [
              { name: "zero stays zero", code: "return binaryToDecimal('0') === 0;" },
              { name: "1010 is ten", code: "return binaryToDecimal('1010') === 10;" },
              { name: "a full byte of ones is 255", code: "return binaryToDecimal('11111111') === 255;" },
              { name: "10000000 is 128", code: "return binaryToDecimal('10000000') === 128;" },
            ],
            solution: `function binaryToDecimal(binary) {
  let total = 0;
  for (const bit of binary) {
    total = total * 2 + Number(bit);
  }
  return total;
}`,
            hints: [
              "Doubling then adding is exactly how place values grow: 1, 2, 4, 8...",
              "Use a for...of loop over the string — each character is '0' or '1'.",
              "Number(bit) turns the character '1' into the number 1.",
            ],
          },
        },
        {
          id: "fnd-bytes",
          title: "Bytes and Beyond",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "A bit is one switch, and one switch is lonely. To say anything useful, computers group bits together. The standard group is 8 bits, and that bundle is called a byte. Eight bits give 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 = 256 possible patterns — enough for every letter, digit and punctuation mark in English, with room to spare.",
            },
            { type: "h", text: "What fits in a byte" },
            {
              type: "list",
              items: [
                "One letter, digit or punctuation mark",
                "Any whole number from 0 up to 255",
                "One color channel of a single pixel",
              ],
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Once you know bytes, the number 256 stops being random. Color channels run from 0 to 255 because each one is a byte. Older systems famously had 256-color modes for the same reason. Watch for it — 256 appears everywhere once you know to look.",
            },
            { type: "h", text: "Kilobytes, megabytes and friends" },
            {
              type: "p",
              text: "Bytes scale up with the same prefixes you know from grams and kilograms. A kilobyte is about a thousand bytes, a megabyte about a million, a gigabyte about a billion, a terabyte about a trillion. Purists will note these are sometimes counted in 1,024-byte steps, because computers love powers of two — both conventions exist, and the difference is small enough to ignore for now.",
            },
            {
              type: "table",
              headers: ["Unit", "Roughly", "Feels like"],
              rows: [
                ["Byte", "8 bits, 256 values", "One character of text"],
                ["Kilobyte (KB)", "About a thousand bytes", "A short paragraph of plain text"],
                ["Megabyte (MB)", "About a million bytes", "A photo from your phone"],
                ["Gigabyte (GB)", "About a billion bytes", "A movie, nicely compressed"],
                ["Terabyte (TB)", "About a trillion bytes", "An entire laptop's drive"],
              ],
            },
            {
              type: "p",
              text: "Now flip the question around: given a number, how many bits do you need to store it? The exercise below asks for exactly that. The strategy is halving: keep cutting n in half until you reach 1, and count the cuts. Each halving peels away one doubling — that is, one bit of place value.",
            },
          ],
          quiz: [
            {
              q: "How many distinct values fit in one byte?",
              options: ["8", "64", "256", "1024"],
              answer: 2,
              explain:
                "A byte is 8 bits, and every bit doubles the count: 2 to the power of 8 is 256. The values run from 0 to 255.",
            },
            {
              q: "Roughly how many bytes are in a megabyte?",
              options: ["A thousand", "A million", "A billion", "A trillion"],
              answer: 1,
              explain:
                "The ladder climbs by thousands: a kilobyte is roughly a thousand bytes, a megabyte roughly a million, a gigabyte roughly a billion.",
            },
            {
              q: "Why does the number 256 keep showing up in computing?",
              options: [
                "It is the total number of values one byte can hold",
                "It is the number of bits in a byte",
                "It is the top speed of the first CPU",
                "It is the number of keys on a keyboard",
              ],
              answer: 0,
              explain:
                "256 is 2 to the 8th power — every possible pattern of a full byte. That is why color channels and many settings max out at 255, the largest value a byte can hold.",
            },
          ],
          exercise: {
            prompt: [
              "Now flip the question: instead of decoding bits, figure out how many bits you need.",
              "Write bitsToFit so it returns the smallest number of bits that can store the number n.",
              "bitsToFit(1) is 1, bitsToFit(2) is 2, and bitsToFit(255) is 8 — a byte exactly.",
              "Strategy: keep halving n, rounding down, until you reach 1 — and count the steps.",
            ],
            starter: `function bitsToFit(n) {
  // How many bits do you need to store the number n?
  // Keep halving n until you reach 1, counting the steps.
  let bits = 1;
  // your code here
  return bits;
}`,
            tests: [
              { name: "one fits in one bit", code: "return bitsToFit(1) === 1;" },
              { name: "two needs two bits", code: "return bitsToFit(2) === 2;" },
              { name: "255 fills a byte exactly", code: "return bitsToFit(255) === 8;" },
              { name: "256 spills into a ninth bit", code: "return bitsToFit(256) === 9;" },
            ],
            solution: `function bitsToFit(n) {
  let bits = 1;
  while (n > 1) {
    n = Math.floor(n / 2);
    bits++;
  }
  return bits;
}`,
            hints: [
              "Each extra bit doubles what you can store: 1 bit = 2 values, 2 bits = 4...",
              "Halve n with Math.floor(n / 2) until only 1 remains.",
              "Count how many halvings that took, starting from 1 bit.",
            ],
          },
        },
        {
          id: "fnd-text-as-numbers",
          title: "Text Is Just Numbers",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is a secret hiding in plain sight: there are no letters inside a computer. Every A you have ever seen on a screen was stored as a number and only painted as a letter at the last moment. The only reason it works is that everyone, everywhere, agreed on the translation.",
            },
            { type: "h", text: "The codebook called ASCII" },
            {
              type: "p",
              text: "In the 1960s, engineers agreed on a standard codebook called ASCII — the American Standard Code for Information Interchange. It assigns a number to each character: A is 65, B is 66, and so on. The agreement is the point. Your keyboard, my screen and a server on another continent all read from the same codebook, so text travels without corruption.",
            },
            {
              type: "code",
              caption: "Every character secretly carries a number",
              code: `console.log("A".charCodeAt(0)); // 65
console.log("B".charCodeAt(0)); // 66
console.log("a".charCodeAt(0)); // 97 — lowercase has its own range
console.log(String.fromCharCode(72, 105)); // "Hi"`,
            },
            {
              type: "table",
              headers: ["Character", "Code", "Note"],
              rows: [
                ["A", "65", "Uppercase starts here"],
                ["B", "66", "Right after A, naturally"],
                ["a", "97", "Lowercase lives in its own range"],
                ["0", "48", "Even the digit zero has a code"],
              ],
            },
            { type: "h", text: "Unicode: the worldwide expansion" },
            {
              type: "p",
              text: "ASCII covers English and stops there. The world writes in Chinese, Arabic, emoji and hundreds of other scripts, so a far bigger codebook called Unicode was built: one giant table that gives every character from every writing system its own number. To store those numbers efficiently, an encoding called UTF-8 pulls a clever trick — common characters take one byte, rarer ones take more. That variable-length idea is why UTF-8 became the default for the web.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "This idea does not stop at text. Photos, audio and video are numbers too — and every AI model ever built consumes nothing but numbers, hunting for patterns in them. When you hear that a model 'understands language', what it actually processes are numeric codes very much like the ones you are about to juggle.",
            },
            {
              type: "p",
              text: "Time to become the codebook. In the exercise below you will convert text into numbers and back again using JavaScript's built-in methods. If your two functions mirror each other perfectly, any word will survive the round trip.",
            },
          ],
          quiz: [
            {
              q: "In ASCII, the letter A is 65. What code is B?",
              options: ["64", "66", "97", "122"],
              answer: 1,
              explain:
                "The codebook assigns consecutive numbers to consecutive letters, so B sits exactly one step past A, at 66.",
            },
            {
              q: "What problem does Unicode solve?",
              options: [
                "It compresses files to half their size",
                "It encrypts text so only servers can read it",
                "It gives every character from every writing system its own number",
                "It replaces the keyboard with voice input",
              ],
              answer: 2,
              explain:
                "ASCII covers the basics of English, but the world writes in thousands of symbols. Unicode is the giant codebook that numbers them all, from Arabic script to emoji.",
            },
            {
              q: "Which JavaScript expression turns the number 72 back into a character?",
              options: ["String.fromCharCode(72)", "charCodeAt(72)", "Number(72)", "Boolean(72)"],
              answer: 0,
              explain:
                "String.fromCharCode travels from code to character — it rebuilds H from 72. charCodeAt is the reverse trip.",
            },
          ],
          exercise: {
            prompt: [
              "Let's prove text is just numbers, using the real methods JavaScript provides.",
              "Write toCodes: it takes text like 'Hi' and returns the array of numeric codes — 72 and 105.",
              "Write fromCodes: it takes an array of codes and glues the characters back into a string.",
              "If your two functions round-trip perfectly — fromCodes(toCodes(word)) gives back word — you win.",
            ],
            starter: `function toCodes(text) {
  // Turn every character into its numeric code.
  // 'A' is 65, 'B' is 66, and so on.
  // Return an array of numbers.
  // your code here
}

function fromCodes(codes) {
  // The reverse: turn an array of numbers back into text.
  // your code here
}`,
            tests: [
              { name: "toCodes('Hi') is [72, 105]", code: "return JSON.stringify(toCodes('Hi')) === '[72,105]';" },
              { name: "fromCodes rebuilds text", code: "return fromCodes([72, 105]) === 'Hi';" },
              { name: "round trip survives any word", code: "return fromCodes(toCodes('bytes')) === 'bytes';" },
            ],
            solution: `function toCodes(text) {
  return text.split("").map((ch) => ch.charCodeAt(0));
}

function fromCodes(codes) {
  return codes.map((code) => String.fromCharCode(code)).join("");
}`,
            hints: [
              "Every character has a method: charCodeAt(0).",
              "text.split('') turns a string into an array of characters.",
              "String.fromCharCode(65) gives back 'A' — then join the pieces.",
            ],
          },
        },
        {
          id: "fnd-boss-binary",
          title: "The Binary Guardian",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "You have reached the end of Chapter 1. Standing between you and the next chapter is the Binary Guardian — keeper of everything you just learned about bits, bytes and codes, and a machine-spirit that has never once used the word 'maybe'.",
            },
            {
              type: "p",
              text: "Boss battles are pure multiple-choice combat: answer every stage correctly to defeat the guardian and bank the XP. No code required — just what you learned. A wrong answer is not fatal. Regroup, reread the question, and strike again.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Binary Guardian",
            intro:
              "The guardian awakens, eyes flickering 1, 0, 1. It speaks only in binary and accepts only perfect answers. Prove you belong in its realm.",
            art: `       .-------.
      |  0   0  |
      |    ^    |
      | [=====] |
      |  1 0 1  |
      '-------'
       /|   |/
      = |   | =
        || ||
       ==   ==`,
            stages: [
              {
                question: "The guardian rumbles: 'What... is a bit?'",
                options: [
                  "A single 0 or 1 — one switch, two states",
                  "A small byte",
                  "A type of memory chip",
                  "A unit of electrical current",
                ],
                answer: 0,
                explain:
                  "A bit is the atom of computing: one tiny switch that is either off (0) or on (1). Everything else is built from these.",
              },
              {
                question: "The guardian flashes its eyes: 101. What is that in decimal?",
                options: ["3", "5", "6", "101"],
                answer: 1,
                explain:
                  "From the right, the places are 1, 2 and 4. Add the places that hold a 1: 4 + 1 = 5.",
              },
              {
                question: "The guardian demands: 'What is the LARGEST value one byte can hold?'",
                options: ["8", "64", "255", "256"],
                answer: 2,
                explain:
                  "A byte has 256 possible values, but they run from 0 to 255 — zero takes up one of the slots, so the maximum is 255.",
              },
              {
                question: "The guardian recites: 'In the old codebook, A is 65. What is B?'",
                options: ["64", "66", "97", "125"],
                answer: 1,
                explain:
                  "Consecutive letters get consecutive codes. B sits exactly one step past A, at 66.",
              },
              {
                question: "Final riddle: 'How many distinct values can 2 bits express?'",
                options: ["Two", "Eight", "Sixteen", "Four"],
                answer: 3,
                explain:
                  "Each bit doubles the possibilities: 2 x 2 = 4. The patterns are 00, 01, 10 and 11.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "logic-and-code",
      title: "Logic & Code",
      blurb: "From silent switches to decisions and loops — meet computation.",
      lessons: [
        {
          id: "fnd-booleans",
          title: "True or False",
          minutes: 4,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every question with a yes-or-no answer can be stored in a single bit — and that is exactly what booleans are. A boolean is a value that is either true or false, and it is the smallest useful piece of data in programming. Do you have the key? Is the password correct? Is the game over? All booleans.",
            },
            {
              type: "p",
              text: "You rarely type true and false by hand. More often the machine manufactures them for you: every comparison produces a boolean. Is 5 greater than 3? JavaScript does not answer politely — it evaluates the expression and hands you the result.",
            },
            {
              type: "code",
              caption: "Comparisons are boolean factories",
              code: `const age = 13;
console.log(age > 10);   // true — comparisons MAKE booleans
console.log(age === 13); // true — triple equals asks "equal?"
console.log(age < 10);   // false

const oldEnough = age >= 18;
console.log(oldEnough);  // false`,
            },
            { type: "h", text: "One equals versus three" },
            {
              type: "p",
              text: "Here is a trap that bites every beginner: a single equals sign does not compare. It assigns. Writing x = 5 means store 5 into x. To ask a question you need ===, three in a row, which reads as 'is exactly equal to?' and answers with a boolean.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Writing if (x = 5) does not check whether x is 5 — it overwrites x with 5 and treats that as true. Train your eyes to flinch at a single equals sign inside a condition. Three equals signs compare; one builds.",
            },
            { type: "h", text: "Combining truths" },
            {
              type: "list",
              items: [
                "&& means and — true only if both sides are true",
                "|| means or — true if at least one side is true",
                "! means not — flips true into false and back",
              ],
            },
            {
              type: "p",
              text: "One more quirk to file away: JavaScript has a loose notion called truthiness. Inside a condition, some non-boolean values act as true or false — 0 and empty strings count as false, and almost everything else counts as true. That explains a lot of odd behavior you will meet later. First, a classic warm-up: build the even-or-odd test.",
            },
          ],
          quiz: [
            {
              q: "What does the expression 5 > 3 evaluate to?",
              options: ["true", "false", "5", "It throws an error"],
              answer: 0,
              explain:
                "Comparisons always produce a boolean. Five is greater than three, so the result is true.",
            },
            {
              q: "What does a single equals sign do in JavaScript?",
              options: [
                "Checks whether two values are equal",
                "Assigns a value to a variable",
                "Creates a new boolean",
                "Converts text to a number",
              ],
              answer: 1,
              explain:
                "One equals sign stores a value — it is the assignment operator. Equality checks need ===, with three.",
            },
            {
              q: "Which expression is true only when BOTH sides are true?",
              options: ["a || b", "!a", "a = b", "a && b"],
              answer: 3,
              explain:
                "&& means and — it demands truth on both sides. || means or, and ! flips a value.",
            },
          ],
          exercise: {
            prompt: [
              "Your first boolean factory.",
              "Write isEven so it returns true when n is even and false when it is odd.",
              "Even numbers divide by 2 with nothing left over — and there is an operator for 'what is left over'.",
              "Return the comparison directly; its result is already true or false.",
            ],
            starter: `function isEven(n) {
  // Return true if n is even, false otherwise.
  // your code here
}`,
            tests: [
              { name: "4 is even", code: "return isEven(4) === true;" },
              { name: "7 is odd", code: "return isEven(7) === false;" },
              { name: "0 is even", code: "return isEven(0) === true;" },
              { name: "negative numbers work too", code: "return isEven(-3) === false;" },
            ],
            solution: `function isEven(n) {
  return n % 2 === 0;
}`,
            hints: [
              "The remainder operator % gives what is left over after dividing.",
              "Even numbers divide cleanly by 2 — no remainder.",
              "Compare with === to get a real boolean.",
            ],
          },
        },
        {
          id: "fnd-logic-gates",
          title: "AND, OR, NOT",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Software booleans have a physical ancestor. Deep inside your processor sit billions of transistors — electronic switches with no moving parts, each either conducting or not. Out of those raw switches, engineers built the first brick of computation: the logic gate.",
            },
            { type: "h", text: "Switches that decide" },
            {
              type: "p",
              text: "A logic gate is a tiny circuit that takes one or two boolean inputs and produces one boolean output, following a fixed rule. Wire two switches one after the other and current flows only when both are on — that is AND. Wire them side by side so either path works — that is OR. A NOT gate simply outputs the opposite of what it is given. Rules made of copper.",
            },
            {
              type: "table",
              headers: ["a", "b", "a AND b"],
              rows: [
                ["true", "true", "true"],
                ["true", "false", "false"],
                ["false", "true", "false"],
                ["false", "false", "false"],
              ],
            },
            {
              type: "code",
              caption: "The same gates, written as code",
              code: `function andGate(a, b) {
  return a && b; // true only when BOTH are true
}
function orGate(a, b) {
  return a || b; // true when AT LEAST ONE is true
}
function notGate(a) {
  return !a; // flips the input
}`,
            },
            { type: "h", text: "From gates to brains" },
            {
              type: "p",
              text: "Here is where it gets poetic. Chain gates in the right pattern and you get a circuit that adds two bits. Chain adders and you get arithmetic. Combine arithmetic with gates that route signals based on results, and you have a processor. Computation is not bolted on top of the switches — it emerges from them. Your code, translated all the way down, is a very large arrangement of ANDs, ORs and NOTs.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "A modern phone packs billions of transistors on a chip the size of a fingernail, each flipping billions of times per second. Every app you have ever opened was those gates flickering in patterns. Physics doing arithmetic at scale.",
            },
            {
              type: "p",
              text: "You just met the three gates in code form. Now build them from memory in the exercise — and know that somewhere under your fingertips, real versions of these gates are running your code.",
            },
          ],
          quiz: [
            {
              q: "An AND gate receives true and false. What comes out?",
              options: ["true", "false", "It depends on the voltage", "An error"],
              answer: 1,
              explain:
                "AND is strict: both inputs must be true. A single false is enough to force the output false.",
            },
            {
              q: "Which gate flips its input?",
              options: ["AND", "OR", "NOT", "All gates flip their input"],
              answer: 2,
              explain:
                "NOT is the contrarian: true becomes false, false becomes true. It takes one input and inverts it.",
            },
            {
              q: "What are logic gates physically made of?",
              options: [
                "Tiny electronic switches called transistors",
                "Miniature gears and springs",
                "Tiny light bulbs",
                "Magnetic letters",
              ],
              answer: 0,
              explain:
                "A transistor is a switch with no moving parts, and wiring a few together in clever patterns gives you AND, OR and NOT. Billions of them make a chip.",
            },
          ],
          exercise: {
            prompt: [
              "Build the three gates you just met, using JavaScript's own logic operators.",
              "andGate returns true only when both inputs are true.",
              "orGate returns true when at least one input is true, and notGate flips its single input.",
              "The operators are && (and), || (or) and ! (not). One line each is enough.",
            ],
            starter: `function andGate(a, b) {
  // Both inputs must be true.
  // your code here
}

function orGate(a, b) {
  // At least one input is true.
  // your code here
}

function notGate(a) {
  // Flip the input.
  // your code here
}`,
            tests: [
              {
                name: "AND needs both",
                code: "return andGate(true, true) === true && andGate(true, false) === false;",
              },
              {
                name: "OR accepts either",
                code: "return orGate(false, true) === true && orGate(false, false) === false;",
              },
              {
                name: "NOT flips",
                code: "return notGate(false) === true && notGate(true) === false;",
              },
            ],
            solution: `function andGate(a, b) {
  return a && b;
}

function orGate(a, b) {
  return a || b;
}

function notGate(a) {
  return !a;
}`,
            hints: [
              "JavaScript has these exact operators: &&, ||, !",
              "andGate(true, false) — one true is not enough for AND.",
              "The ! operator flips a boolean.",
            ],
          },
        },
        {
          id: "fnd-branching",
          title: "Teaching Machines to Decide",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Straight-line code always does the same thing, in the same order, every time. Useful programs cannot afford that luxury: sometimes you log in correctly, sometimes you type the wrong password. The machine needs a way to pick a path, and that mechanism is branching.",
            },
            { type: "h", text: "The if/else shape" },
            {
              type: "code",
              caption: "A chain of checks, top to bottom",
              code: `const age = 15;

if (age < 4) {
  console.log("Ticket is free.");
} else if (age < 18) {
  console.log("Ticket is half price.");
} else {
  console.log("Ticket is full price.");
}`,
            },
            {
              type: "p",
              text: "The condition inside the parentheses is an expression that boils down to a boolean. If it is true, its block runs and the rest of the chain is skipped. If it is false, the machine falls to the next check — the else if — and keeps falling until one matches or the final else catches whatever is left. Exactly one path runs, never more.",
            },
            { type: "h", text: "Braces and breathing room" },
            {
              type: "p",
              text: "The curly braces mark where each branch begins and ends. Technically, a branch holding a single statement can skip them — and professionally, almost nobody does. Braces make your structure visible at a glance, keep later edits safe, and spare you from the classic bug where a second line silently belongs to no branch at all.",
            },
            {
              type: "list",
              items: [
                "A login page checks your credentials — grant access or show an error",
                "A thermostat compares temperature to a target — heat, cool, or do nothing",
                "A game tests whether two objects overlap — crash sound, or not",
              ],
            },
            {
              type: "p",
              text: "Branches quietly run your digital life. In the exercise you will build a tiny security policy: a function that inspects a password's length and returns one of three verdicts. Check the small cases first, then work your way up.",
            },
          ],
          quiz: [
            {
              q: "Which keyword runs its block only when the if condition is false?",
              options: ["if", "else", "return", "for"],
              answer: 1,
              explain:
                "else is the fallback path — the machine takes it whenever the condition fails.",
            },
            {
              q: "In an if / else if / else chain, how many of the branches can run?",
              options: [
                "Every branch whose condition is true",
                "At most two",
                "Exactly one",
                "None, unless you add braces",
              ],
              answer: 2,
              explain:
                "The chain is checked top to bottom and stops at the first true condition. Everything after is skipped, so exactly one branch runs.",
            },
            {
              q: "What type of value does the condition inside if ( ... ) need to produce?",
              options: ["A boolean", "A string", "A number", "Any type except objects"],
              answer: 0,
              explain:
                "Conditions boil down to true or false. That is exactly what comparisons like pw.length < 8 produce.",
            },
          ],
          exercise: {
            prompt: [
              "Give the machine a decision to make about security.",
              "Write passwordStrength: return 'weak' for passwords shorter than 8 characters, 'medium' for shorter than 12, and 'strong' otherwise.",
              "An if / else if / else chain fits this perfectly — check the small cases first.",
              "These verdicts are strings, so return them in quotes.",
            ],
            starter: `function passwordStrength(pw) {
  // Return 'weak' if the password is shorter than 8 characters.
  // Return 'medium' if it is shorter than 12 characters.
  // Return 'strong' otherwise.
  // your code here
}`,
            tests: [
              { name: "tiny passwords are weak", code: "return passwordStrength('abc') === 'weak';" },
              {
                name: "eight characters is medium",
                code: "return passwordStrength('abcd1234') === 'medium';",
              },
              {
                name: "twelve or more is strong",
                code: "return passwordStrength('abcd1234efgh') === 'strong';",
              },
            ],
            solution: `function passwordStrength(pw) {
  if (pw.length < 8) {
    return "weak";
  } else if (pw.length < 12) {
    return "medium";
  } else {
    return "strong";
  }
}`,
            hints: [
              "pw.length gives the character count.",
              "Check the small cases first with if, then else if.",
              "Only the final branch needs no condition.",
            ],
          },
        },
        {
          id: "fnd-loops",
          title: "Do It a Million Times",
          minutes: 4,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Imagine printing the numbers 1 to 1,000 by writing 1,000 lines of code. Absurd — and entirely unnecessary. The moment you notice yourself repeating something, you reach for a loop: a way to tell the machine to run a block of code again and again, once per item or until a condition changes.",
            },
            { type: "h", text: "The for loop, piece by piece" },
            {
              type: "code",
              caption: "Anatomy of a for loop",
              code: `//        start    check    step
for (let i = 1; i <= 5; i++) {
  console.log("Rep number " + i);
}
// Runs five times: i is 1, 2, 3, 4, then 5`,
            },
            {
              type: "p",
              text: "A for loop wears three expressions in its header, separated by semicolons. Start runs once, before anything else. Check runs before every lap — if it is true, the body runs; if false, the loop is finished. Step runs after each lap, usually nudging the counter. So the rhythm is: start, check, body, step, check, body, step — until a check finally fails.",
            },
            { type: "h", text: "While loops: repeat until" },
            {
              type: "code",
              caption: "A while loop watches one condition",
              code: `let fuel = 3;
while (fuel > 0) {
  console.log("Burning fuel... " + fuel);
  fuel--; // forget this line and the loop never ends
}`,
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Before you run any loop, be able to finish this sentence: this loop stops when blank. If you cannot name the thing that eventually makes the condition false, you have written an infinite loop — your program will freeze on that spot until something kills it.",
            },
            {
              type: "p",
              text: "Loops are where repetition becomes free. Your exercise is a timeless classic: add up every number from 1 to n. A for loop from 1 to n, a running total, one return — that is the whole machine.",
            },
          ],
          quiz: [
            {
              q: "How many times does the body of for (let i = 0; i < 5; i++) run?",
              options: ["4", "5", "6", "Forever"],
              answer: 1,
              explain:
                "i starts at 0 and the loop runs while i is less than 5, so the body executes for 0, 1, 2, 3 and 4 — five trips.",
            },
            {
              q: "What is an infinite loop?",
              options: [
                "A loop that runs on a server",
                "A loop nested inside another loop",
                "A loop whose exit condition never becomes true",
                "A loop that counts by two",
              ],
              answer: 2,
              explain:
                "If nothing ever makes the condition false — a counter you forgot to increment, say — the loop never ends, and the program freezes right there.",
            },
          ],
          exercise: {
            prompt: [
              "Loops exist so you never add 100 numbers by hand.",
              "Write sumTo so it returns 1 + 2 + 3 and so on, all the way up to n.",
              "A for loop from 1 up to n, adding each number into total, does the job.",
              "When the loop ends, return total — it holds the answer.",
            ],
            starter: `function sumTo(n) {
  // Add up every number from 1 to n and return the total.
  // sumTo(5) should be 1+2+3+4+5 = 15.
  let total = 0;
  // your code here
  return total;
}`,
            tests: [
              { name: "sumTo(1) is just 1", code: "return sumTo(1) === 1;" },
              { name: "sumTo(5) is 15", code: "return sumTo(5) === 15;" },
              { name: "Gauss would be proud: sumTo(100)", code: "return sumTo(100) === 5050;" },
            ],
            solution: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}`,
            hints: [
              "A for loop that starts at 1 and ends at n: for (let i = 1; i <= n; i++)",
              "Add each i to total as you go.",
              "Return total after the loop finishes.",
            ],
          },
        },
        {
          id: "fnd-boss-logic",
          title: "Gatekeeper v2.0",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 2 ends at a sealed gate. Gatekeeper v2.0 was built from the same switches and gates you just wired together in code, and it respects nothing except correct logic — not strength, not speed, not sweet talk.",
            },
            {
              type: "p",
              text: "Five logic puzzles stand between you and the next chapter. Pick the right output for each stage — the gate only counts flawless reasoning, and it never gets tired.",
            },
          ],
          quiz: [],
          boss: {
            name: "Gatekeeper v2.0",
            intro:
              "A lock with no keyhole, wired entirely from AND, OR and NOT gates, bars the way forward. It does not open for force. It opens only for truth.",
            art: `      .-----.
     /       \\
    |         |
    |         |
   _|_________|_
  |             |
  |    (__)     |
  |  GATEKEEPER |
  |_____________|`,
            stages: [
              {
                question: "The first lock is an AND gate with both inputs true. What is the output?",
                options: ["false", "true", "Sometimes true", "Undefined"],
                answer: 1,
                explain:
                  "AND outputs true only when every input is true. Both are true here, so the gate swings open.",
              },
              {
                question: "An OR gate receives false and false. What comes out?",
                options: ["true", "It depends on the battery", "false", "The gate refuses to answer"],
                answer: 2,
                explain:
                  "OR needs at least one true input. With zero true inputs, the output is false.",
              },
              {
                question: "A NOT gate receives true. What is the output?",
                options: ["An error", "true", "null", "false"],
                answer: 3,
                explain:
                  "NOT inverts its input: true goes in, false comes out. It is the gate-shaped version of the ! operator.",
              },
              {
                question: "The Gatekeeper hums a puzzle: !true || false. What does it evaluate to?",
                options: ["true", "false", "It depends on the machine", "It is invalid JavaScript"],
                answer: 1,
                explain:
                  "NOT applies first: !true is false. Then false || false is false — no true input remains anywhere.",
              },
              {
                question: "Which gate matches the rule 'at least one input must be true'?",
                options: ["AND", "NOT", "OR", "None — no gate works that way"],
                answer: 2,
                explain:
                  "OR is the optimist: one true input is enough. AND is the strict one, demanding every input.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "the-internet",
      title: "The Internet",
      blurb: "Follow a single click across the planet.",
      lessons: [
        {
          id: "fnd-networks",
          title: "Computers That Talk",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "One computer is an island. Connect two of them so they can exchange messages, and you have a network — the moment computing became social. Your laptop, your phone, your printer and your router form one of these at home right now.",
            },
            {
              type: "p",
              text: "A network is simply two or more computers that can send messages to each other. The rules they follow — how to start a conversation, how to take turns, how to announce themselves — are called protocols. Shared rules are what let machines from different companies, built decades apart, understand each other perfectly.",
            },
            { type: "h", text: "Clients and servers" },
            {
              type: "p",
              text: "Most conversations on a network follow one pattern: one machine asks, another answers. The asker is called a client, and the answerer is called a server. Your browser is a client — it sends requests like 'give me this page'. A server is a machine, usually a serious one in a warehouse, whose whole job is to sit and answer those requests.",
            },
            {
              type: "list",
              items: [
                "Your browser, asking for a page — client",
                "A warehouse machine handing you that page — server",
                "Your email app fetching mail — also a client",
                "The machine storing your inbox — also a server",
              ],
            },
            { type: "h", text: "From your couch to the planet" },
            {
              type: "p",
              text: "Your home crew — Wi-Fi, router, gadgets — is a local network, sometimes called a LAN, short for local area network. Your router connects it to your internet provider's much bigger network, which connects to other providers' networks around the world. That is the internet's real definition: a network of networks, with no single owner at the center.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "The internet is not a cloud. It is physical: fiber cables under oceans, racks of machines humming in warehouses, radio waves crossing your living room. When a page loads, electrons and photons genuinely traveled. Keep that physical reality in mind and the rest of this chapter clicks into place.",
            },
          ],
          quiz: [
            {
              q: "In the client-server model, what is the server's job?",
              options: [
                "Send requests and wait for answers",
                "Receive requests and send back answers",
                "Store your keyboard presses",
                "Convert Wi-Fi into electricity",
              ],
              answer: 1,
              explain:
                "The client asks; the server answers. Your browser is a client requesting pages, and the machines answering those requests are servers.",
            },
            {
              q: "The internet is best described as...",
              options: [
                "A single giant computer in a secret location",
                "One cable that connects every device",
                "A network of networks",
                "A subscription service",
              ],
              answer: 2,
              explain:
                "Your home network connects to your provider's network, which connects to other providers' networks, and so on. The internet is the result: networks talking to networks.",
            },
          ],
        },
        {
          id: "fnd-packets",
          title: "Data in Envelopes",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You send a photo to a friend across the country. Somewhere, that photo becomes electricity, light and radio, crosses a dozen machines, and reassembles perfectly on the other side. The naive way to imagine it — one unbroken stream of bits flowing like water — is exactly how it does not work.",
            },
            { type: "h", text: "Why not send it all at once" },
            {
              type: "p",
              text: "An unbroken stream has two fatal flaws. First, hogging: while your giant file owns the line, everyone else's messages have to wait. Second, fragility: if even one piece gets corrupted mid-flight, the whole transfer must restart from zero. The internet's designers chose a different shape — many small pieces.",
            },
            { type: "h", text: "Envelopes with numbers" },
            {
              type: "p",
              text: "Data travels in packets — small chunks, each wrapped with a header saying where it came from, where it is going, and which number it is in the sequence. Machines called routers pass each packet along, choosing the best next hop at that exact moment. Two packets from the same photo can take completely different routes.",
            },
            {
              type: "ascii",
              art: ` you                      server
  |                           |
  +--- [ pkt 1 ] --- hop -----+
  +--- [ pkt 2 ] ------ hop --+
  +--- [ pkt 3 ] --- hop -----+`,
            },
            {
              type: "p",
              text: "At the far end, a protocol called TCP does the accounting. It uses those sequence numbers to reassemble packets into the original order, checks each one for damage, and — this is the masterstroke — requests a re-send of exactly the pieces that went missing. Nothing restarts from zero. The internet is built to fail in small, recoverable pieces.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "This design is why your video call degrades instead of dying. When the network gets congested, packets arrive late or get dropped, and the call software simply makes do with fewer of them. Blurry video is the graceful fallback built into a packet-based world.",
            },
          ],
          quiz: [
            {
              q: "Why is sending one giant, unbroken stream of data a bad idea?",
              options: [
                "Streams cannot carry photos",
                "One lost piece ruins the whole transfer, and the line is blocked for everyone else",
                "Servers cannot count that high",
                "Routers only understand handwritten letters",
              ],
              answer: 1,
              explain:
                "A single stream hogs the line, and if any part is lost there is no way to request just that piece. Small chunks fail small and share the road politely.",
            },
            {
              q: "What does TCP do when a numbered packet never arrives?",
              options: [
                "Nothing — the photo is simply missing a piece forever",
                "Shuts down the whole connection",
                "Asks the sender to re-send that packet",
                "Rebuilds it from a backup battery",
              ],
              answer: 2,
              explain:
                "TCP tracks sequence numbers, notices the gap, and requests a re-send of exactly the missing piece. The receiver stitches everything back into order.",
            },
            {
              q: "Do all packets between you and a server take the same route?",
              options: [
                "Yes — packets must follow one fixed path",
                "Only text packets follow a fixed path",
                "Packets cannot be routed at all",
                "No — routers may send each packet along different paths",
              ],
              answer: 3,
              explain:
                "Routers forward each packet based on conditions at that moment, so packets from the same file can take different roads and still meet at the same destination.",
            },
          ],
        },
        {
          id: "fnd-ip-dns",
          title: "The Internet's Phone Book",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Every machine on a network has an address — a number called an IP address, short for Internet Protocol. In the most familiar format it looks like 203.0.113.7: four numbers separated by dots. Humans are famously terrible at remembering numbers like that, which creates a translation problem.",
            },
            { type: "h", text: "Machines dial numbers, humans type names" },
            {
              type: "p",
              text: "A domain name — the example.org part of a web address — is the human-friendly label. The IP address is what machines actually route by. Something has to convert one into the other, and it has to do it in milliseconds, every single time you click.",
            },
            { type: "h", text: "DNS: the internet's phone book" },
            {
              type: "p",
              text: "That something is DNS, the Domain Name System. When you type a name, your computer asks a DNS server: what number goes with this name? The answer comes back, your computer caches it — remembers it for a while so repeat visits skip the question — and only then does the real request set out.",
            },
            {
              type: "code",
              caption: "A baby phone book: name in, number out",
              code: `const dns = {
  "terminal.academy.example": "203.0.113.7",
  "localhost": "127.0.0.1"
};

const ip = dns["terminal.academy.example"];
console.log(ip); // 203.0.113.7 — now we know where to send`,
            },
            {
              type: "p",
              text: "When DNS fails, you feel it in a very specific way: your Wi-Fi shows connected, the internet is very much alive, and yet every site answers 'not found'. The connection is fine — the translation step is what broke. It is one of the most common ways the internet can feel broken while being perfectly healthy.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Next time a single site will not load but your Wi-Fi icon looks happy, think DNS first. The name-to-number lookup is a separate step with its own failure modes — it can be down even when everything else is up.",
            },
          ],
          quiz: [
            {
              q: "What is the job of DNS?",
              options: [
                "Encrypting your passwords",
                "Translating domain names into IP addresses",
                "Storing websites on your device",
                "Boosting your Wi-Fi signal",
              ],
              answer: 1,
              explain:
                "DNS is the internet's phone book: hand it a name like example.org and it hands back the numeric address machines actually use.",
            },
            {
              q: "An IP address is best compared to...",
              options: ["A recipe", "A filing cabinet", "A phone number for a machine", "A password"],
              answer: 2,
              explain:
                "It identifies one specific machine on the network, and other machines use it to direct their messages — exactly like dialing a number.",
            },
            {
              q: "Your Wi-Fi is connected, but every website says 'not found'. What is a likely suspect?",
              options: ["The DNS lookup is failing", "Your keyboard is broken", "The screen is lying to you", "You have too many browser tabs"],
              answer: 0,
              explain:
                "If names cannot be translated into addresses, no request can be delivered, even though your connection itself is fine. DNS trouble looks exactly like this.",
            },
          ],
        },
        {
          id: "fnd-http",
          title: "The Web's Conversation",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Your browser and a web server have never met, were built by different companies, and yet hold flawless conversations thousands of times a day. They manage it because both sides follow one strict etiquette called HTTP — the HyperText Transfer Protocol. It is the grammar of the web.",
            },
            { type: "h", text: "Requests and responses" },
            {
              type: "p",
              text: "An HTTP conversation has exactly two moves. The client sends a request; the server sends back one response. Always in that order, always one each. A request names a method — a verb describing the kind of ask. GET means 'show me something'. POST means 'here, take this data'. Browsers fetch pages with GET and submit forms with POST.",
            },
            {
              type: "code",
              caption: "The two verbs in action",
              code: `// GET: "show me this page, please"
const page = await fetch("https://terminal.academy.example/lessons");

// POST: "here, take this data"
await fetch("https://terminal.academy.example/scores", {
  method: "POST",
  body: "level=1&xp=30"
});`,
            },
            { type: "h", text: "Status codes: the server's mood in three digits" },
            {
              type: "table",
              headers: ["Code", "Official name", "In plain words"],
              rows: [
                ["200", "OK", "Worked — here is your stuff"],
                ["404", "Not Found", "I looked — no page lives at that address"],
                ["500", "Internal Server Error", "The server itself broke — not your fault"],
              ],
            },
            {
              type: "p",
              text: "The strangest feature of HTTP is that the server forgets you the instant it answers. Every request is handled as if from a complete stranger, with zero memory of any previous request. This amnesia is deliberate — it keeps servers simple and lets any machine answer any request. But websites do need to remember you, which is why cookies exist: tiny notes your browser attaches to every request, saying 'it is me again'.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Stateless design is what lets a website serve millions of visitors — no machine needs to remember anyone. Cookies bolt a memory onto that amnesia, and the tension between the two ideas powers everything from shopping carts to 'remember me' checkboxes.",
            },
          ],
          quiz: [
            {
              q: "You submit a filled-in login form. Which HTTP method is that most likely to use?",
              options: ["GET", "POST", "PRINT", "SAVE"],
              answer: 1,
              explain:
                "GET asks to see something; POST sends data to the server. Submitting a form means handing data over, so POST is the natural fit.",
            },
            {
              q: "What does a 404 status code tell you?",
              options: [
                "Everything worked perfectly",
                "You are not allowed to see this page",
                "The server crashed while answering",
                "The server looked and found no such page",
              ],
              answer: 3,
              explain:
                "404 means the request was fine and the server is fine — the page simply does not exist at that address. 500 would mean the server itself broke.",
            },
            {
              q: "Why do cookies exist?",
              options: [
                "To make websites more colorful",
                "To translate domain names into addresses",
                "Because HTTP on its own forgets you between requests",
                "To encrypt your Wi-Fi password",
              ],
              answer: 2,
              explain:
                "Each HTTP request stands alone — the server has no memory of you. Cookies are small notes your browser re-sends with every request so sites can recognize you.",
            },
          ],
        },
        {
          id: "fnd-boss-net",
          title: "Router's Revenge",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "The final guardian of Digital Foundations guards the network itself. Somewhere between your couch and a server across the planet, a page load went wrong — and a router is laughing about it.",
            },
            {
              type: "p",
              text: "Six stages, six moments where the journey could break. Retrace the path from name lookup to final response, name what failed at every hop, and the course is yours.",
            },
          ],
          quiz: [],
          boss: {
            name: "Router's Revenge",
            intro:
              "A click was made. A page never arrived. Router's Revenge dares you to retrace the entire journey — DNS, packets, TCP, HTTP — and diagnose exactly what broke at every hop.",
            art: `      )   )  (   (
     .-------------.
     |  o  o  o  o |
     |  [ N E T ]  |
     |  o  o  o  o |
     '-------------'
      |   |   |   |
    ~ ~ ~ ~ ~ ~ ~ ~`,
            stages: [
              {
                question: "You type a web address and press enter. What does DNS do first?",
                options: [
                  "Encrypts the page before it travels",
                  "Translates the domain name into an IP address",
                  "Downloads the page to your router",
                  "Chooses which browser to open",
                ],
                answer: 1,
                explain:
                  "Machines route by numeric address, not by name. DNS does the lookup first so the request knows where to go.",
              },
              {
                question: "What exactly is a packet?",
                options: [
                  "A small, numbered chunk of data that travels independently",
                  "A virus that hides inside email",
                  "A spare battery inside the router",
                  "A unit of Wi-Fi signal strength",
                ],
                answer: 0,
                explain:
                  "Big files are chopped into small numbered pieces that travel separately and meet again at the destination.",
              },
              {
                question: "Why does TCP number the packets?",
                options: [
                  "To make them heavier so they do not blow away",
                  "So routers can charge per number",
                  "So the receiver can reorder them and spot missing ones",
                  "Because packets enjoy being counted",
                ],
                answer: 2,
                explain:
                  "Sequence numbers let the receiver reassemble the file in order and notice gaps, triggering a re-request for exactly what was lost.",
              },
              {
                question: "The page finally responds — but with which status code does a server say 'no such page'?",
                options: ["200", "500", "404", "100"],
                answer: 2,
                explain:
                  "200 means success, 500 means the server itself broke, and 404 means the server looked but found no page at that address.",
              },
              {
                question: "In a web request, who asks and who answers?",
                options: [
                  "The server asks, the client answers",
                  "The client asks, the server answers",
                  "Both ask at the same time",
                  "DNS asks on behalf of both",
                ],
                answer: 1,
                explain:
                  "Your browser is the client sending requests; the server's whole job is to hear them and respond.",
              },
              {
                question: "Why not send the page as one giant, unbroken stream?",
                options: [
                  "Streams cannot be encrypted",
                  "Routers refuse anything larger than a postcard",
                  "It would overload the DNS",
                  "One lost piece would ruin everything, and the line would be blocked for others",
                ],
                answer: 3,
                explain:
                  "Unbroken streams hog the road and fail completely if any part is lost. Packets fail small and share the line politely.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "data-encoding",
      title: "Data, Errors & Compression",
      blurb: "Hex, base64, checksums and squeezing — how data survives the real world.",
      lessons: [
        {
          id: "fnd-hex",
          title: "Hexadecimal — The Programmer's Shorthand",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You can now read binary, one bit at a time. But here is the problem: binary is exhausting. The byte 11111111 is eight characters to say one number. Decimal is compact but awkward — 213 tells you nothing about which bits are on. Programmers wanted a middle ground, and they found one that has stuck for sixty years: hexadecimal, usually just called hex.",
            },
            { type: "h", text: "Sixteen symbols" },
            {
              type: "p",
              text: "Hexadecimal is base 16. You run out of single digits after 9, so hex borrows six letters: A stands for 10, B for 11, C for 12, D for 13, E for 14 and F for 15. That is the whole alphabet. Sixteen symbols, zero through fifteen.",
            },
            {
              type: "table",
              headers: ["Hex", "Decimal", "Binary"],
              rows: [
                ["0", "0", "0000"],
                ["9", "9", "1001"],
                ["A", "10", "1010"],
                ["C", "12", "1100"],
                ["F", "15", "1111"],
              ],
            },
            { type: "h", text: "Why programmers swear by it" },
            {
              type: "p",
              text: "Look at that table again and notice something sneaky: four bits — half a byte, called a nibble — express exactly the values 0 to 15. One hex digit expresses exactly the values 0 to 15. They line up perfectly. So one hex digit is always exactly four bits, and one byte is always exactly two hex digits. No guessing, no remainders. FF is 11111111 is 255. The three languages describe the same byte with different amounts of patience.",
            },
            {
              type: "code",
              caption: "One byte, three languages",
              code: `// JavaScript speaks all of them
console.log(0xff);              // 255 — hex literal
console.log((255).toString(16)); // "ff" — decimal to hex
console.log(parseInt("ff", 16)); // 255 — hex to decimal`,
            },
            {
              type: "p",
              text: "You will meet hex constantly from here on. Web colors like #FF6600 are three bytes in hex. Every device's network address is hex. Memory addresses are hex. And when you reach the cryptography course, the fingerprints of keys and hashes will be shown as hex strings — it is the standard costume that raw bytes wear when humans need to look at them.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Read a hex byte as high nibble, low nibble: 3C is a 3 and a C. The 3 contributes 48 (three sixteens), the C contributes 12. Sixty. With a little practice you convert common bytes in your head, and hex stops looking like a code and starts looking like a number.",
            },
            {
              type: "p",
              text: "Time to build the conversion yourself. Going from decimal to hex is the mirror of reading binary: instead of halving, you divide by sixteen, over and over, collecting the remainders. Each remainder is one hex digit, from the least significant up.",
            },
          ],
          quiz: [
            {
              q: "How many bits does one hexadecimal digit represent?",
              options: ["2", "4", "8", "16"],
              answer: 1,
              explain:
                "A hex digit expresses 0 to 15, which is exactly the range of four bits — one nibble. That clean fit is the entire reason programmers use hex.",
            },
            {
              q: "What is 0xFF in decimal?",
              options: ["15", "100", "255", "256"],
              answer: 2,
              explain:
                "F is 15, so FF is fifteen sixteens plus fifteen: 240 + 15 = 255. Two F digits is the largest value one byte can hold.",
            },
            {
              q: "Why do programmers prefer hex over plain binary when eyeballing raw bytes?",
              options: [
                "Hex holds more information per byte",
                "Hex is encrypted for safety",
                "Hex digits map cleanly to groups of four bits, so it is compact AND easy to convert",
                "Computers cannot print binary",
              ],
              answer: 2,
              explain:
                "Binary is precise but bloated; hex is one quarter the length and every digit is exactly one nibble. It is the best of both worlds for humans staring at machine data.",
            },
          ],
          exercise: {
            prompt: [
              "Convert decimal numbers into their hex costume — the same job toString(16) does.",
              "Write decimalToHex(n) so it returns the lowercase hex string for n. decimalToHex(255) must return 'ff'.",
              "The method: divide n by 16 over and over. Each remainder is the next hex digit, building from the right.",
              "Careful with zero: decimalToHex(0) should return '0', not an empty string.",
            ],
            starter: `function decimalToHex(n) {
  // Divide by 16 repeatedly; each remainder
  // becomes a hex digit, right to left.
  const digits = "0123456789abcdef";
  // your code here
}`,
            tests: [
              { name: "zero is '0'", code: "return decimalToHex(0) === '0';" },
              { name: "ten is 'a'", code: "return decimalToHex(10) === 'a';" },
              { name: "255 is 'ff'", code: "return decimalToHex(255) === 'ff';" },
              { name: "256 is '100'", code: "return decimalToHex(256) === '100';" },
              { name: "4096 is '1000'", code: "return decimalToHex(4096) === '1000';" },
              {
                name: "a famous hex word",
                code: "return decimalToHex(3735928559) === 'deadbeef';",
              },
            ],
            solution: `function decimalToHex(n) {
  const digits = "0123456789abcdef";
  if (n === 0) return "0";
  let result = "";
  while (n > 0) {
    result = digits[n % 16] + result; // remainder is the next digit
    n = Math.floor(n / 16);
  }
  return result;
}`,
            hints: [
              "Digits come out least-significant first, so put each new digit at the FRONT of the result string.",
              "The string '0123456789abcdef' is your lookup table: index it with the remainder.",
              "Loop while n is greater than 0, dividing by 16 each pass — and handle n === 0 before the loop.",
            ],
          },
        },
        {
          id: "fnd-base64",
          title: "Base64 — Text in Disguise",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Sometimes perfectly good bytes have to travel through places that only understand plain, printable text. Old email systems choked on raw binary. Some URLs and JSON fields refuse bytes that are not ordinary characters. The fix is not encryption — it is a costume called base64: a way to dress any bytes up as safe, boring text.",
            },
            { type: "h", text: "The alphabet trick" },
            {
              type: "p",
              text: "Base64 picks sixty-four unproblematic characters: A to Z, a to z, 0 to 9, plus and slash. Then it re-chops your data to speak that alphabet. Take three bytes — twenty-four bits — slice them into four groups of six bits instead. Each six-bit group holds a value from 0 to 63, and that value picks one character from the alphabet. Three bytes in, four characters out.",
            },
            {
              type: "code",
              caption: "The math of the costume",
              code: `// 3 bytes = 24 bits = 4 six-bit groups = 4 characters
// "Man" -> "TWFu" is the textbook example

// JavaScript has it built in:
console.log(btoa("Hi!"));  // "SGkh" — encode
console.log(atob("SGkh")); // "Hi!"  — decode`,
            },
            {
              type: "p",
              text: "If your data is not a tidy multiple of three bytes, the last group comes up short, and base64 pads it with equals signs. That is why base64 strings so often end in one or two of them. You have absolutely seen this: long strings of mixed-case letters ending in equals signs, living in email attachments, data URLs, and configuration files.",
            },
            { type: "h", text: "The tax" },
            {
              type: "p",
              text: "Nothing is free. Four characters carry three bytes, so base64 makes data about one third bigger. Fine for a small icon in a CSS file; painful for a two-gigabyte video. That is why base64 is for small payloads and awkward channels, not bulk storage.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Base64 is not encryption. There is no key. Anyone can reverse it in one line — you just watched atob do it. Hiding something in base64 is hiding a note by writing it in a different font. In the AI era you will constantly bump into base64 blobs pasted into chats and configs: decode them mentally as 'data in a costume', never as 'protected data'.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "When you ask an AI assistant about a weird string, one of the first things it checks is whether the string is base64 — because half the mysteries on the internet turn out to be exactly that: plain data wearing its text costume.",
            },
          ],
          quiz: [
            {
              q: "Why does base64 exist at all?",
              options: [
                "To encrypt data so only key holders can read it",
                "To carry arbitrary bytes through channels that only accept plain text",
                "To make files smaller",
                "To convert letters into numbers",
              ],
              answer: 1,
              explain:
                "Base64 is an encoding, not encryption. Its whole job is making binary data safe to pass through text-only pipes like old email systems, URLs and JSON fields.",
            },
            {
              q: "Three bytes go into base64. How many characters come out?",
              options: ["Two", "Three", "Four", "Six"],
              answer: 2,
              explain:
                "Three bytes are 24 bits. Re-sliced into 6-bit groups that is four groups, and each group becomes one character. Hence the one-third size tax.",
            },
            {
              q: "You find a suspicious file full of mixed-case letters ending in '='. A colleague says it is 'basically encrypted'. They are...",
              options: [
                "right — equals signs mark strong encryption",
                "wrong — base64 has no key and anyone can decode it",
                "right — only AI can read base64",
                "wrong — it is actually compressed",
              ],
              answer: 1,
              explain:
                "That is the classic base64 signature, and base64 is a costume, not a vault. No key exists; atob or any decoder reverses it instantly.",
            },
          ],
        },
        {
          id: "fnd-checksums",
          title: "Checksums — Did Anything Break?",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is an uncomfortable truth: bits flip. A cosmic ray hits a memory chip. A cable picks up electrical noise. A sector of an old drive gets tired. Your photo, your file, your message — any of it can silently corrupt in transit or storage. The question is not whether errors happen, but how the machine ever notices.",
            },
            { type: "h", text: "Parity — the one-bit detective" },
            {
              type: "p",
              text: "The oldest trick is beautiful: before sending a byte, count the 1 bits in it and add one extra bit — the parity bit — so the total count is always even. The receiver recounts. Odd total? Something flipped. One extra bit buys you detection of any single flip in that byte. It cannot tell you which bit, and it cannot fix anything — it can only raise its hand.",
            },
            { type: "h", text: "Checksums — add it all up" },
            {
              type: "p",
              text: "Parity guards one byte at a time. A checksum guards a whole message: add up every byte in the data and send the total along with it. The receiver repeats the addition and compares. If the sums disagree, the data broke somewhere between here and there. Download pages often publish checksums for exactly this reason — so you can verify your copy matches the original, byte for byte.",
            },
            {
              type: "code",
              caption: "A toy checksum: sum of all bytes, kept small",
              code: `function checksum(text) {
  let sum = 0;
  for (const ch of text) {
    sum += ch.charCodeAt(0); // every character is a number
  }
  return sum % 256; // keep it to one byte
}

console.log(checksum("hello")); // 20
console.log(checksum("helloo")); // 111 — different data, different sum`,
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Real systems use sturdier cousins of this idea. CRC checks mix each byte's position into the math, so scrambled order gets caught. Credit card numbers hide a check digit computed with the Luhn algorithm — type a digit wrong and the card number rejects itself. Barcodes, ISBNs, bank account numbers: check digits are everywhere once you know to look.",
            },
            { type: "h", text: "The weakness" },
            {
              type: "p",
              text: "A plain sum has a blind spot: it does not care about order. Add the same numbers in a different order and you get the same total — 'ab' and 'ba' checksum identically. Errors that preserve the sum sail right through. That is why serious systems use mixing, and why the cryptography course will escalate this idea all the way to cryptographic hashes, where finding any two inputs with the same fingerprint is deliberately near-impossible.",
            },
            {
              type: "p",
              text: "Build the toy version now, and prove the reorder weakness to yourself in the tests.",
            },
          ],
          quiz: [
            {
              q: "A parity bit or checksum can do which of the following?",
              options: [
                "Repair corrupted data automatically",
                "Detect that something changed, without saying what changed",
                "Prevent errors from happening",
                "Compress the data so errors matter less",
              ],
              answer: 1,
              explain:
                "These are detection tools, not repair or prevention. They raise a hand when the numbers disagree; recovery means re-requesting or re-reading the data.",
            },
            {
              q: "Why does the toy sum-checksum fail to notice when two letters swap places, as in 'ab' becoming 'ba'?",
              options: [
                "Addition is not allowed in checksums",
                "Sums do not depend on order, so both arrangements add up the same",
                "Swapped letters always have equal character codes",
                "The checksum only looks at the first byte",
              ],
              answer: 1,
              explain:
                "Addition is commutative: same parts, any order, same total. Stronger checks like CRC mix position into the calculation precisely to catch reordering.",
            },
            {
              q: "A download page shows a checksum next to a file link. You compute the checksum of your downloaded copy and it matches. What do you now know?",
              options: [
                "The file is free of malware",
                "The file was encrypted properly",
                "Your copy almost certainly did not corrupt on the way down",
                "The file is the newest version",
              ],
              answer: 2,
              explain:
                "A matching checksum means your bytes match the published bytes — integrity, not safety, secrecy or freshness. It says the copy survived the trip intact.",
            },
          ],
          exercise: {
            prompt: [
              "Implement the toy checksum from the lesson: add up every character's code, keep one byte.",
              "checksum(text) must return the sum of all character codes, modulo 256. checksum('hello') is 20.",
              "Empty text should checksum to 0.",
              "The last test proves the reorder weakness: checksum('ab') equals checksum('ba'). Let it pass — that is the lesson.",
            ],
            starter: `function checksum(text) {
  // Add every character's code to a running
  // total, then keep the total to one byte.
  // your code here
}`,
            tests: [
              { name: "empty text is 0", code: "return checksum('') === 0;" },
              { name: "'hello' is 20", code: "return checksum('hello') === 20;" },
              { name: "'A' is its own code, 65", code: "return checksum('A') === 65;" },
              {
                name: "'The quick brown fox' is 19",
                code: "return checksum('The quick brown fox') === 19;",
              },
              {
                name: "reorder weakness: 'ab' equals 'ba'",
                code: "return checksum('ab') === checksum('ba');",
              },
            ],
            solution: `function checksum(text) {
  let sum = 0;
  for (const ch of text) {
    sum += ch.charCodeAt(0);
  }
  return sum % 256;
}`,
            hints: [
              "Loop over the text with for...of — each ch is a one-character string.",
              "ch.charCodeAt(0) gives the character's numeric code.",
              "After the loop, return sum % 256 so the answer always fits in one byte.",
            ],
          },
        },
        {
          id: "fnd-compression",
          title: "Squeezing Data",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "A single 4K photo, stored as raw bytes, would eat around 24 megabytes. Your phone shoots fifty of those in a second. Video at raw size would fill any drive in minutes. The only reason any of this fits anywhere is compression: finding the patterns hiding in data and describing them shorter.",
            },
            { type: "h", text: "Two flavors: lossless and lossy" },
            {
              type: "list",
              items: [
                "Lossless — ZIP files, PNG images: squeeze out the patterns, restore every original byte exactly. For anything where exactness matters: documents, code, spreadsheets.",
                "Lossy — JPEG images, MP3 audio, video: throw away detail human eyes and ears barely notice, keep the rest. A tenth of the size for a picture that looks basically identical.",
              ],
            },
            { type: "h", text: "Idea one: run-length encoding" },
            {
              type: "p",
              text: "The simplest compression ever invented: when the same symbol repeats, store the count instead of the repeats. A line of 40 identical pixels becomes the number 40 and one pixel. Fantastic for simple graphics — logos, screenshots, anything with long runs of sameness. Useless for photos, where almost nothing repeats.",
            },
            {
              type: "code",
              caption: "Run-length encoding, the whole idea",
              code: `"aaaaaabbb"  ->  "6a3b"   // 9 characters become 4
"abcabcabc"  ->  "1a1b1c1a1b1c1a1b1c"  // oops — grew!

// RLE wins big on long runs, LOSES on data with no runs.
// Every compressor has a favorite kind of data.`,
            },
            { type: "h", text: "Idea two: dictionaries and short codes" },
            {
              type: "p",
              text: "Smarter compressors build a dictionary of chunks that repeat — and here is the twist that makes it powerful — they assign the SHORTEST codes to the most frequent symbols. Morse code worked this way a century before computers: E, the most common English letter, is a single dot. Huffman coding does exactly this with bits, and it is the beating heart of ZIP and PNG.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "You cannot compress what has no patterns — and the most pattern-free data in the universe is properly encrypted data or pure randomness. Try to ZIP an already-encrypted file and it barely shrinks. Remember this when you reach the cryptography course: encrypted data is supposed to look like noise.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "Modern AI runs on compression's descendants. Language models learn statistical patterns so well they can guess missing text — which is compression in spirit. And the practical side still matters daily: shipping models, datasets and backups means thinking about sizes the same way engineers always have.",
            },
            {
              type: "p",
              text: "Your turn to squeeze. Implement run-length encoding exactly as shown above: each run of identical characters becomes its count followed by the character.",
            },
          ],
          quiz: [
            {
              q: "You must email a spreadsheet of financial records. Which compression style is appropriate?",
              options: ["Lossy, for smaller files", "Lossless, or none", "Lossy, but only slightly", "Base64"],
              answer: 1,
              explain:
                "Records must come back byte-for-byte exact, so lossless (like ZIP) or no compression at all. Lossy is for human perception — images, sound, video — where approximations are acceptable.",
            },
            {
              q: "Run-length encoding would work BEST on which of these?",
              options: [
                "A photograph of a forest",
                "A simple black-and-white logo with large solid areas",
                "An MP3 song file",
                "Properly encrypted data",
              ],
              answer: 1,
              explain:
                "RLE feeds on long runs of identical values — exactly what solid-color graphics have in bulk. Photos barely repeat, songs are already compressed, and encrypted data has no patterns at all.",
            },
            {
              q: "You ZIP a movie file and it shrinks by 4 percent. You ZIP an encrypted archive and it shrinks by 0.1 percent. Why?",
              options: [
                "ZIP refuses to touch encrypted data",
                "Encrypted data is designed to look pattern-free, so there is nothing for a compressor to exploit",
                "The encrypted archive was smaller to begin with",
                "Encryption adds extra room for compression",
              ],
              answer: 1,
              explain:
                "Compression works by exploiting patterns. Good encryption destroys patterns on purpose — the output should be statistically indistinguishable from noise, and noise does not compress.",
            },
          ],
          exercise: {
            prompt: [
              "Implement run-length encoding: replace each run of identical characters with its count and the character.",
              "rleEncode('aaabbc') must return '3a2b1c'.",
              "Every run gets encoded, even runs of length one: 'abc' becomes '1a1b1c'.",
              "Empty text encodes to an empty string.",
            ],
            starter: `function rleEncode(text) {
  // Walk the text, counting how many times the
  // current character repeats. When it changes,
  // emit count + character and start counting again.
  // your code here
}`,
            tests: [
              { name: "'aaabbc' is '3a2b1c'", code: "return rleEncode('aaabbc') === '3a2b1c';" },
              { name: "singles are explicit", code: "return rleEncode('abc') === '1a1b1c';" },
              { name: "one long run", code: "return rleEncode('aaaa') === '4a';" },
              { name: "mixed runs", code: "return rleEncode('wwwgg') === '3w2g';" },
              { name: "empty stays empty", code: "return rleEncode('') === '';" },
            ],
            solution: `function rleEncode(text) {
  if (text === "") return "";
  let result = "";
  let current = text[0];
  let count = 1;
  for (let i = 1; i < text.length; i++) {
    if (text[i] === current) {
      count++;
    } else {
      result += count + current;
      current = text[i];
      count = 1;
    }
  }
  return result + count + current; // flush the final run
}`,
            hints: [
              "Track the character you are currently inside of, and how many of it you have seen.",
              "When the character changes, append count + current to the result, then reset.",
              "The final run never sees a 'change' — remember to append it after the loop ends.",
            ],
          },
        },
        {
          id: "fnd-boss-data",
          title: "The Archivist",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 4 ends in the deep stacks of the data vault, where The Archivist keeps every byte that ever mattered. It speaks fluent hex, dresses its payloads in base64, and can smell a flipped bit from three cabinets away. Impress it, or be filed under 'corrupted'.",
            },
            {
              type: "p",
              text: "Boss rules as before: multiple-choice combat, every stage answered correctly to win. The Archivist has no patience for guessing.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Archivist",
            intro:
              "Cabinet drawers slide open around you, each one labeled in hexadecimal. The Archivist rises from behind a shelf of checksums, eyes glowing a patient amber. 'Show me you understand what data must survive,' it hums.",
            art: `     _______________
    | .-----------. |
    | | > archive | |
    | '-----------' |
    |___[=======]___|
     /==\\      /==\\
    ||   |    |   ||
     \\==/      \\==/`,
            stages: [
              {
                question: "The Archivist hums: 'One of my hex digits. How many bits is it worth?'",
                options: ["2", "4", "8", "16"],
                answer: 1,
                explain:
                  "A hex digit spans 0 to 15 — exactly four bits, one nibble. Two hex digits make one byte, which is why the pairing is so convenient.",
              },
              {
                question: "It slides open a drawer labeled 0xB. 'Contents?'",
                options: ["8", "11", "13", "16"],
                answer: 1,
                explain:
                  "B is hex for 11. A is 10, B is 11, C is 12, D is 13, E is 14, F is 15 — the six borrowed letters of hexadecimal.",
              },
              {
                question: "It presents a file full of mixed-case letters ending in '='. 'This is encrypted, yes?'",
                options: [
                  "Yes — the equals sign marks encryption",
                  "No — it is base64, an encoding anyone can reverse",
                  "Yes — only key holders can decode it",
                  "No — it is compressed with RLE",
                ],
                answer: 1,
                explain:
                  "That is the base64 signature: no key, no secrecy, one function call to reverse. It is a text costume for bytes, not a vault.",
              },
              {
                question: "A drawer rattles. 'My checksum disagrees with the bytes inside. What can my checksum tell me?'",
                options: [
                  "Exactly which bit flipped, and how to fix it",
                  "That something changed — but not what, and it cannot repair it",
                  "That the drawer is under attack right now",
                  "Nothing — checksums are decorative",
                ],
                answer: 1,
                explain:
                  "Checksums and parity are detection tools: they raise a hand when numbers disagree. Locating and repairing the damage needs heavier machinery.",
              },
              {
                question: "Final riddle: 'Decode my run: 4a2b.'",
                options: ["aaab", "aaaabb", "aabb", "4ab2"],
                answer: 1,
                explain:
                  "Run-length encoding reads count-then-symbol: 4 a's, then 2 b's — aaaabb. Runs become counts, counts become runs.",
              },
            ],
          },
        },
      ],
    },
  ],
};
