import type { Course } from "./types";

/**
 * Course 4 — Software Architecture (red path)
 * The structure of systems: contracts, boundaries, patterns, data and scale.
 * Written for a post-AI world: code is cheap, structure is expensive.
 */
export const architectureCourse: Course = {
  id: "architecture",
  title: "Software Architecture",
  subtitle:
    "How systems are shaped before the first line ships — structure, patterns, and the thinking that scales.",
  icon: "blocks",
  color: "red",
  chapters: [
    {
      id: "arch-systems",
      title: "Thinking in Systems",
      blurb: "Clients, servers, contracts, and boundaries — learn to see the wires behind the screen.",
      lessons: [
        {
          id: "arch-what-is-architecture",
          title: "What Is Software Architecture?",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Anyone can write a function. But why do some codebases feel like a well-organized workshop, where you can find any tool in seconds — while others feel like a flooded basement, where touching one pipe bursts three leaks? The difference is rarely the code inside the files. It is the architecture: the structure of the system and the decisions that shape it.",
            },
            { type: "h", text: "Decisions that are hard to un-make" },
            {
              type: "p",
              text: "Architecture is the set of decisions that are expensive to change later. Which parts talk to which parts. Where data lives. What the boundaries are. What you trust and what you double-check. Rename a variable and the cost is seconds; restructure a tangled system and the cost is months. Architects spend their attention exactly there — on the decisions with the longest shadows.",
            },
            {
              type: "code",
              caption: "Two codebases, same features, different fates",
              code: `// Tangled: the cart reaches into the database, the mailer,
// the logger, and half of the settings object.
cart.checkout(db, mailer, logger, settings, taxRules);

// Structured: the cart knows one thing — the contract of a
// payment service. Swap Stripe for PayPal, nothing else moves.
cart.checkout(paymentService);`,
            },
            { type: "h", text: "What good means" },
            {
              type: "p",
              text: "Good architecture is not pretty diagrams. It is a system that keeps meeting its quality attributes — the measurable promises a system makes beyond merely working. Speed. Safety. Availability. And above all in real projects: changeability, the ability to add features without setting the building on fire.",
            },
            {
              type: "table",
              headers: ["Quality attribute", "The question it answers", "What it looks like"],
              rows: [
                ["Performance", "Does it respond fast enough?", "Search returns in under 200 ms"],
                ["Scalability", "Does it survive growth?", "10x users means 2x cost, not a crash"],
                ["Availability", "Is it there when needed?", "Downtime measured in minutes per year"],
                ["Security", "Does it resist attack?", "Least privilege, verified inputs, no secrets in code"],
                ["Maintainability", "Can it change safely?", "A junior ships a feature without fear"],
              ],
            },
            {
              type: "p",
              text: "Here is why this course exists in a post-AI world. Writing code has become astonishingly cheap — a model can draft a login flow in seconds. But choosing what structure that code should live inside, which tradeoffs to accept, and which quality attributes matter most for this product in this year? That is judgment, and it is now the most valuable skill in the building. When implementation is a commodity, architecture is the scarce resource.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Every system has an architecture, even the accidental one. If nobody chooses the structure, the structure gets chosen by whatever was easiest to type that day — and that is how flooded basements are built. Choosing badly beats not choosing.",
            },
          ],
          quiz: [
            {
              q: "Software architecture is best described as:",
              options: [
                "The decisions about structure that are expensive to change later",
                "The folder layout required by your programming language",
                "A diagram that must be drawn before any code is written",
                "The specific framework a project is built with",
              ],
              answer: 0,
              explain:
                "Architecture is about the structural decisions with long shadows: boundaries, data flow, trust. Renaming a variable is not architecture; moving where data lives definitely is.",
            },
            {
              q: "A system works fine but every small change breaks something unrelated. Which quality attribute is suffering?",
              options: ["Performance", "Scalability", "Maintainability", "Availability"],
              answer: 2,
              explain:
                "Changeability — maintainability — is the quality attribute that answers: can this system change without setting itself on fire? Tangled dependencies are its natural enemy.",
            },
            {
              q: "Why does architecture matter MORE in a world where AI can generate code quickly?",
              options: [
                "Because generated code cannot run without diagrams",
                "Because choosing structure and tradeoffs is judgment that code generators do not supply",
                "Because architects are required by law to approve AI output",
                "It does not — generated code needs no architecture",
              ],
              answer: 1,
              explain:
                "When implementation is cheap, the scarce skill is deciding what to build, how it should be structured, and which tradeoffs to accept. That judgment is the human leverage.",
            },
          ],
        },
        {
          id: "arch-clients-servers",
          title: "Clients, Servers & the API Contract",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Almost every app you have ever used is really two programs cooperating across a network. The client is the program in front of you — the browser tab, the phone app. The server is the program somewhere else that holds the data and does the heavy lifting. The client asks, the server answers. That rhythm, request and response, is the heartbeat of the web.",
            },
            {
              type: "code",
              caption: "The heartbeat: one request, one response",
              code: `// Client side (browser)
const res = await fetch("/api/lessons/arch-001");
const data = await res.json(); // the server's answer, as data

// Server side (simplified) — listen and answer
app.get("/api/lessons/:id", (req, res) => {
  const lesson = findLesson(req.params.id);
  if (!lesson) return res.status(404).json({ error: "not found" });
  res.status(200).json(lesson);
});`,
            },
            { type: "h", text: "The contract" },
            {
              type: "p",
              text: "Between client and server sits an API — an application programming interface. An API is a contract: a published promise about what requests look like and what responses will contain. GET /api/lessons returns an array of lesson objects with these fields. POST /api/progress records your completion. The client does not know or care what database the server uses; the server does not know or care what font the client renders. The contract is the only thing they share, and that deliberate ignorance is what lets each side evolve.",
            },
            {
              type: "p",
              text: "Contracts have grammar. Endpoints are nouns — /lessons, /users, /progress. HTTP verbs are the actions — GET reads, POST creates, PUT replaces, DELETE removes. And every response carries a status code, which is the server's way of answering a question you did not explicitly ask: how did that go?",
            },
            {
              type: "table",
              headers: ["Status family", "Meaning", "Examples you have met"],
              rows: [
                ["2xx — success", "It worked", "200 OK, 201 Created"],
                ["3xx — redirect", "It moved, look there", "301 Moved Permanently"],
                ["4xx — client error", "You asked wrong", "401 Unauthorized, 404 Not Found"],
                ["5xx — server error", "We broke it", "500 Internal Server Error, 503 Overloaded"],
              ],
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "A contract is a promise, and breaking it has consequences. Rename a field the client depends on — even a typo fix — and every old app in the wild starts crashing at once. Serious APIs version their contracts for exactly this reason, so change arrives as a new promise instead of a broken old one.",
            },
            {
              type: "p",
              text: "Time to read the server's mood like a developer. In the exercise below you will write the check that every HTTP client library contains somewhere: did this request land in the success family or not? The whole 2xx range counts — from 200 to 299 — and everything else, even a polite redirect, does not.",
            },
          ],
          quiz: [
            {
              q: "In the client-server model, where does the authoritative copy of shared data usually live?",
              options: [
                "In the client, which syncs to the server",
                "On the server, which answers requests about it",
                "Split evenly across both sides",
                "In the HTTP status code",
              ],
              answer: 1,
              explain:
                "The server owns the data and the business rules. The client keeps at most a temporary copy, which is exactly why it must ask before acting on anything authoritative.",
            },
            {
              q: "What does an API's versioning exist to prevent?",
              options: [
                "Slow responses on old phones",
                "Breaking clients that still depend on the old contract",
                "Hackers reading the endpoint list",
                "The server from caching responses",
              ],
              answer: 1,
              explain:
                "A published API is a promise. Versioning lets the promise evolve — new fields, new endpoints — while old clients keep working against the version they were built for.",
            },
            {
              q: "A request returns 404. What happened?",
              options: [
                "The server crashed while handling it",
                "The thing requested was not found — a client-side mistake",
                "The response was moved to another URL",
                "The request succeeded but the body is empty",
              ],
              answer: 1,
              explain:
                "4xx means the client asked wrong: bad credentials, bad URL, missing thing. 404 specifically says the requested resource does not exist at that address.",
            },
          ],
          exercise: {
            prompt: [
              "Servers answer with status codes; clients must judge them.",
              "Write isSuccess so it returns true only for the success family — every status from 200 through 299.",
              "Everything else — redirects, client errors, server errors — must return false.",
              "One comparison for the floor, one for the ceiling.",
            ],
            starter: `function isSuccess(status) {
  // True for any status in the 2xx family: 200 to 299.
  // False for everything else (3xx, 4xx, 5xx...).
  // your code here
}`,
            tests: [
              { name: "200 is a success", code: "return isSuccess(200) === true;" },
              { name: "the whole family counts, up to 299", code: "return isSuccess(201) === true && isSuccess(204) === true && isSuccess(299) === true;" },
              { name: "redirects are not successes", code: "return isSuccess(300) === false && isSuccess(301) === false;" },
              { name: "client and server errors fail", code: "return isSuccess(404) === false && isSuccess(500) === false && isSuccess(503) === false;" },
            ],
            solution: `function isSuccess(status) {
  return status >= 200 && status < 300;
}`,
            hints: [
              "The entire 2xx range counts: 200, 201, 204 — anything from 200 up to 299.",
              "Two comparisons joined with && — one for the floor, one for the ceiling.",
              "The ceiling is exclusive: 300 itself is already a redirect, not a success.",
            ],
          },
        },
        {
          id: "arch-abstraction",
          title: "Abstraction: The Fine Art of Hiding",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You have been using abstractions your whole life without calling them that. A steering wheel is an abstraction: it hides steering geometry, hydraulics and tire physics behind one honest interface — turn left, go left. You do not need to know what it hides to use it well. That is the entire point.",
            },
            { type: "h", text: "A function is a promise" },
            {
              type: "p",
              text: "In software, an abstraction is a boundary with a promise on its face. A function signature says: give me these inputs, in this shape, and I will return that output, in that shape. Everything inside the boundary is the implementer's business. Everything outside is the caller's business. Neither side needs to understand the other's half.",
            },
            {
              type: "code",
              caption: "Same promise, wildly different machinery behind it",
              code: `// Caller's world: the promise. No clue about internals needed.
const users = await fetchUsers({ active: true });

// Implementer's world: could be a database query, a cache
// lookup, a call to another service. The caller never knows.
// That ignorance is not a bug — it is the feature.`,
            },
            { type: "h", text: "Depend on contracts, not implementations" },
            {
              type: "p",
              text: "Here is where beginners give away their power: reaching through the boundary. When your code depends on how something works instead of what it promises, you have coupled yourself to details that were never guaranteed. The fix is a rule you will use for decades: depend on the contract. Take a payment service that promises to charge a card — your code should ask the service to charge, not dig into its Stripe calls. Then the day Stripe becomes PayPal, nothing in your code even notices.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "No abstraction is perfect. When hidden details leak out — a cache that makes your reads stale, a queue that occasionally reorders messages — engineers call it a leaky abstraction. The skill is not pretending leaks never happen; it is knowing where the boundary is, so when a leak appears you know exactly which side has to adapt.",
            },
            {
              type: "p",
              text: "Let us feel the principle in code. In the exercise below, your function receives a discount rule it has never seen before — and never needs to see. The rule arrives as a function: something that takes a total and returns a new one. Your job is only to honor the contract and apply it. Ten percent off, two dollars off, a chaotic formula invented yesterday — all identical to your code, because all your code does is call the promise.",
            },
          ],
          quiz: [
            {
              q: "What makes something a good abstraction?",
              options: [
                "It uses the most advanced techniques available",
                "It hides detail behind a promise you can use without knowing the details",
                "It exposes every internal option for maximum flexibility",
                "It is written by the most senior engineer on the team",
              ],
              answer: 1,
              explain:
                "A good abstraction reduces what you must hold in your head. The steering wheel works because it hides the machinery — not because it exposes it.",
            },
            {
              q: "Your checkout code calls payment.charge(card, amount) instead of reaching into Stripe's API directly. What did you gain?",
              options: [
                "Faster network requests",
                "The freedom to swap payment providers without touching checkout",
                "A guarantee payments never fail",
                "Nothing — it is just more indirection",
              ],
              answer: 1,
              explain:
                "Depending on the contract instead of the implementation means the machinery behind the boundary can be replaced wholesale. The caller never notices.",
            },
            {
              q: "A cache behind a read function starts serving outdated data to callers who needed freshness. This is an example of:",
              options: [
                "A leaky abstraction — hidden detail leaking out",
                "A broken compiler",
                "Too many comments in the code",
                "Versioning done correctly",
              ],
              answer: 0,
              explain:
                "The promise implied freshness; the hidden caching detail leaked through and broke it. Leaky abstractions are why you should know where boundaries sit even while trusting them.",
            },
          ],
          exercise: {
            prompt: [
              "Time to honor a contract you have never seen.",
              "Write applyDiscount(order, rule). order is a dollar total, and rule is a FUNCTION that takes a total and returns the discounted total.",
              "Your function must not know, guess, or care what the rule does — just apply it and return the result.",
              "This is depending on a contract in miniature: the machinery behind rule can be anything at all.",
            ],
            starter: `function applyDiscount(order, rule) {
  // order: a dollar total, like 50.
  // rule: a FUNCTION — takes a total, returns the new total.
  // Apply the rule and return the result. Do NOT try to
  // guess what kind of discount it is. That is the point.
  // your code here
}`,
            tests: [
              { name: "passes the total into the rule", code: "return applyDiscount(100, (t) => t * 2) === 200;" },
              { name: "a 20 percent off rule works", code: "return applyDiscount(50, (t) => t * 0.8) === 40;" },
              { name: "rules can be anything at all", code: "return applyDiscount(10, (t) => t - 3) === 7 && applyDiscount(9, (t) => t) === 9;" },
              { name: "the original total is never mutated", code: "const total = 30; applyDiscount(total, (t) => 0); return total === 30;" },
            ],
            solution: `function applyDiscount(order, rule) {
  return rule(order);
}`,
            hints: [
              "You do not need to know what the rule does. That is the whole lesson.",
              "A rule you receive is called like any function: rule(order).",
              "One line. The contract does the rest.",
            ],
          },
        },
        {
          id: "arch-coupling-cohesion",
          title: "Coupling & Cohesion",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Ask any architect for their one-word nightmare and a suspicious number will whisper: spaghetti. Not because the code is badly written — line by line, spaghetti codebases are often brilliant — but because everything connects to everything. Two forces decide whether a system becomes spaghetti or a city with clean districts: coupling and cohesion. Learn to steer them and structure stops being luck.",
            },
            { type: "h", text: "Coupling: how tangled is the wiring" },
            {
              type: "p",
              text: "Coupling measures how much one module must know about another to work. Low coupling means modules interact through small, boring surfaces — a function call, a message, a contract. High coupling means module A reaches into module B's private drawers: its internal helpers, its data layout, its private constants. The cost of high coupling is brutal and concrete: change B, and A breaks in a place you were not looking. Multiply by a hundred modules and nobody dares change anything, which is precisely how systems fossilize.",
            },
            { type: "h", text: "Cohesion: does the stuff belong together" },
            {
              type: "p",
              text: "Cohesion is coupling's twin, measured inside a module instead of between them. A module has high cohesion when everything in it serves one purpose — a mailer that only sends mail, a cart that only manages items. Low cohesion is the junk drawer: one module that validates input, formats dates, calls the database and sends notifications. Junk drawers feel efficient right up until every kind of change touches them, and every change risks breaking all four jobs at once.",
            },
            {
              type: "ascii",
              art: `  tidy districts            the spaghetti district
  +---+     +---+           +---+ +---+ +---+
  | A |---->| B |           | A |-| B |-| C |
  +---+     +---+           +---+ +---+ +---+
    |         |              |  \\  | |  /  |
    v         v              v   \\ v v /   v
  +---------------+         (everything talks to
  |       C       |          everything: chaos)
  +---------------+`,
            },
            {
              type: "p",
              text: "The goal state is easy to say and takes years to learn to reach: high cohesion inside modules, low coupling between them. Things that change together, live together. Things that change for different reasons get a wall between them — and the wall is a contract, from the last lesson. One more uncomfortable truth deserves airtime: your system's boundaries will eventually mirror your team's communication lines. Organizations design the architectures their communication patterns can support, a pattern known as Conway's law. Four teams that never talk will build four services that barely talk. Ship it with that in mind.",
            },
            {
              type: "p",
              text: "For the exercise, think like a city planner. You will receive a list of items and a rule for which district each belongs to — then organize the city: every item filed under its district's name, districts created on demand. Grouping by a rule is cohesion in motion, and the lookup object you build is the boundary.",
            },
          ],
          quiz: [
            {
              q: "Module A calls a private helper buried inside module B. This is a problem of:",
              options: ["Low cohesion", "High coupling", "Too few comments", "Missing version control"],
              answer: 1,
              explain:
                "Reaching past a module's public surface is coupling at its worst: A now depends on details B never promised to keep stable.",
            },
            {
              q: "A module validates input, formats dates, queries the database AND sends email. What is wrong with it?",
              options: [
                "It has low cohesion — four unrelated jobs in one junk drawer",
                "It has too much cohesion",
                "It is too small to be useful",
                "Nothing — big modules are always better",
              ],
              answer: 0,
              explain:
                "Every distinct reason to change now lands in the same file, and each change risks all the other jobs. Split by purpose and each piece becomes simple.",
            },
            {
              q: "What is the classic target state for coupling and cohesion?",
              options: [
                "High coupling, high cohesion",
                "Low coupling, low cohesion",
                "Low coupling between modules, high cohesion within them",
                "Zero coupling, zero cohesion",
              ],
              answer: 2,
              explain:
                "Modules that each do one job well (high cohesion), talking to each other only through small contracts (low coupling). Things that change together, live together.",
            },
          ],
          exercise: {
            prompt: [
              "Play city planner: organize items into districts.",
              "Write groupBy(items, keyFn). keyFn is a function that takes an item and returns the name of its district.",
              "Return an object mapping each district name to an ARRAY of the items that belong there.",
              "Districts are created on demand — no empty ones, none missing.",
            ],
            starter: `function groupBy(items, keyFn) {
  // items: an array of anything.
  // keyFn: a function — takes an item, returns a district name.
  // Return: { districtName: [items...] }
  // e.g. groupBy(['ann','bo','cid'], w => w.length)
  //   -> { 3: ['ann','cid'], 2: ['bo'] }
  const districts = {};
  // your code here
  return districts;
}`,
            tests: [
              { name: "empty list, empty city", code: "return Object.keys(groupBy([], (x) => 'a')).length === 0;" },
              { name: "groups words by length", code: "const g = groupBy(['ann', 'bo', 'cid'], (w) => w.length); return g[3].length === 2 && g[2][0] === 'bo';" },
              { name: "groups records by field", code: "const rows = [{ t: 'a' }, { t: 'b' }, { t: 'a' }]; const g = groupBy(rows, (r) => r.t); return g.a.length === 2 && g.b.length === 1;" },
              { name: "every item finds a home", code: "const g = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd')); return g.even.length + g.odd.length === 4;" },
            ],
            solution: `function groupBy(items, keyFn) {
  const districts = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!districts[key]) districts[key] = [];
    districts[key].push(item);
  }
  return districts;
}`,
            hints: [
              "Keys coming out of keyFn become property names on the result object.",
              "Use bracket access with a computed key: districts[key].",
              "The first time you see a key, create its array — then push the item in.",
            ],
          },
        },
        {
          id: "arch-boss-systems",
          title: "The Warden of Walls",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 1 ends at a gatehouse. The Warden of Walls patrols the boundaries you just studied — contracts, status codes, coupling, cohesion — and it has seen a thousand systems rot from the inside out. It does not care how fast you can type. It cares whether you know where the walls belong.",
            },
            {
              type: "p",
              text: "Boss battles are pure multiple-choice combat: answer every stage correctly to defeat the warden and bank the XP. A wrong answer is not fatal. Regroup, reread, and strike again.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Warden of Walls",
            intro:
              "The gatehouse doors grind open. The Warden examines you the way it examines pull requests: slowly, and without mercy. 'Show me you know where one thing ends and another begins.'",
            art: `    .-------------------.
    | |]=====[| |]=====[|
    |                   |
    |   o           o   |
    |        .-.        |
    |       [|+|]       |
    '-------------------'
     ||    ||    ||    ||
   ==||====||====||====`,
            stages: [
              {
                question: "The Warden rumbles: 'Which decisions belong to architecture?'",
                options: [
                  "The structural ones that are expensive to change later",
                  "The names of local variables",
                  "Which text editor the team uses",
                  "The order of functions in a file",
                ],
                answer: 0,
                explain:
                  "Architecture lives where the long shadows fall: boundaries, data flow, trust. Variable names are cheap; boundaries are not.",
              },
              {
                question: "It slams a status code on the table: 503. What is the family and the fault?",
                options: [
                  "4xx — the client asked wrong",
                  "5xx — the server is struggling or broken",
                  "2xx — everything worked",
                  "3xx — the answer moved elsewhere",
                ],
                answer: 1,
                explain:
                  "503 Service Unavailable sits in the 5xx family: the server is overloaded or down. Not your mistake — but very much your problem to see coming.",
              },
              {
                question: "'Your code depends on the promise,' the Warden says, 'not on the... what?'",
                options: [
                  "The programming language",
                  "The documentation",
                  "The implementation hidden behind the promise",
                  "The unit tests",
                ],
                answer: 2,
                explain:
                  "Contracts over implementations. Depend on what a boundary promises, and the machinery behind it can be replaced without your code noticing.",
              },
              {
                question: "The Warden shows you a module that parses dates, charges cards and writes logs. 'Name the disease.'",
                options: [
                  "High cohesion",
                  "Low coupling",
                  "Low cohesion — a junk drawer of unrelated jobs",
                  "Excessive documentation",
                ],
                answer: 2,
                explain:
                  "Three unrelated reasons to change, all living in one file. Every change risks all three jobs. Carve it into three single-purpose modules.",
              },
              {
                question: "Final gate: 'Why do we build walls between modules at all?'",
                options: [
                  "To make code harder to read for outsiders",
                  "So that one side can change without breaking everyone depending on it",
                  "Because compilers require them",
                  "To reduce the total line count",
                ],
                answer: 1,
                explain:
                  "Walls — and the contracts that pierce them — are what let systems evolve piece by piece. No boundaries, and every change is a leap across the whole tangled pile.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "arch-patterns",
      title: "Patterns & Principles",
      blurb: "The principles and named patterns that keep systems changeable — and the traps that hide inside them.",
      lessons: [
        {
          id: "arch-solid",
          title: "SOLID, in Plain Words",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "SOLID is five principles for object-oriented design, and despite the capital letters it is not gospel — it is five pieces of hard-won advice about the same underlying question: how do I write code that changes without shattering? Read each one as a sentence you would tell a teammate over coffee, not as scripture.",
            },
            {
              type: "table",
              headers: ["Letter", "Name", "In plain words"],
              rows: [
                ["S", "Single responsibility", "One reason to change per module"],
                ["O", "Open/closed", "Extend by adding, not by editing"],
                ["L", "Liskov substitution", "A substitute must honor the promise"],
                ["I", "Interface segregation", "Small promises beat giant ones"],
                ["D", "Dependency inversion", "Depend on contracts, not machinery"],
              ],
            },
            { type: "h", text: "The one that changes everything: open/closed" },
            {
              type: "p",
              text: "Most of SOLID is commonsense once stated, but the open/closed principle deserves a slow read. It says code should be open for extension but closed for modification: you can add new behavior without editing the code that already works. Why does that matter? Because every edit to working code is a chance to break it, and every reader of your edit must re-verify the old cases still pass. Adding new code carries almost none of that risk.",
            },
            {
              type: "code",
              caption: "Two ways to support a new shape — only one survives contact with time",
              code: `// CLOSED FOR EXTENSION: every new shape means editing
// this function again, and re-testing everything.
function area(shape) {
  if (shape.kind === "square") return shape.side * shape.side;
  if (shape.kind === "circle") return 3.14159 * shape.r * shape.r;
  // adding "triangle" means touching this file forever
}

// OPEN FOR EXTENSION: a table of area functions. New shapes
// register themselves; this code never changes again.
const AREAS = {
  square: (s) => s.side * s.side,
  circle: (s) => 3.14159 * s.r * s.r,
};
function area2(shape) {
  return AREAS[shape.kind](shape);
}`,
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Dependency inversion — the D — is the abstraction lesson wearing a suit. High-level policy should depend on abstractions, not on concrete tools. Your checkout flow depends on a payment interface, not on Stripe; on a mailer interface, not on SendGrid. Notice the flip: it is not the details depending on the policy, but both hanging off the same contract.",
            },
            {
              type: "p",
              text: "A calibration before the exercise: SOLID applied without judgment creates monsters — interfaces with one implementation, six layers of indirection for a weekend project. Principles are heuristics for pain you have not felt yet. When you have felt the pain, they read like prophecy. Until then, use the pieces that solve problems you actually have. Now: build an open-for-extension area calculator, and feel how adding a shape stops meaning editing a function.",
            },
          ],
          quiz: [
            {
              q: "A class parses files, charges payments, and sends emails. Which SOLID principle is loudest here?",
              options: [
                "Single responsibility — it has several reasons to change",
                "Open/closed — it cannot be extended",
                "Liskov substitution — subclasses misbehave",
                "Interface segregation — interfaces are too small",
              ],
              answer: 0,
              explain:
                "Three unrelated jobs means three reasons to change, each able to break the others. Single responsibility says: carve it up by reason-to-change.",
            },
            {
              q: "What does open for extension, closed for modification mean in practice?",
              options: [
                "The file is locked so nobody can edit it",
                "New behavior arrives as new code — tables, registrations, plugins — not edits to proven code",
                "All functions must be public",
                "Classes cannot inherit from each other",
              ],
              answer: 1,
              explain:
                "Think of the area table: adding a shape means adding an entry, not re-editing (and re-risking) the dispatching code that already works.",
            },
            {
              q: "Your checkout code calls an interface called PaymentGateway instead of the Stripe SDK directly. Which principle did you just apply?",
              options: [
                "Dependency inversion — policy depends on a contract, not a concrete tool",
                "Single responsibility",
                "Interface segregation",
                "Liskov substitution",
              ],
              answer: 0,
              explain:
                "Both the checkout flow and the Stripe adapter now hang off the same abstraction. Swapping providers stops being a rewrite.",
            },
          ],
          exercise: {
            prompt: [
              "Build an area calculator that never needs editing again.",
              "The starter gives you AREAS — a table of per-shape area functions. Write totalArea(shapes) so it sums the areas of every shape in the array.",
              "The rule: dispatch through the table. No if/else on kind, no special cases — your loop must not care what shapes exist.",
              "When someone adds a triangle entry to AREAS tomorrow, totalArea must keep working untouched. That is open/closed.",
            ],
            starter: `const AREAS = {
  square: (s) => s.side * s.side,
  circle: (s) => 3.14159 * s.r * s.r,
};

function totalArea(shapes) {
  // shapes: [{ kind: 'square', side: 3 }, { kind: 'circle', r: 2 }, ...]
  // Sum every area. Look each one up in AREAS — never check kind
  // with if/else. New shapes must not require editing this.
  let total = 0;
  // your code here
  return total;
}`,
            tests: [
              { name: "squares only", code: "return totalArea([{ kind: 'square', side: 3 }, { kind: 'square', side: 4 }]) === 25;" },
              { name: "circles included", code: "const a = totalArea([{ kind: 'circle', r: 2 }]); return Math.abs(a - 12.56636) < 0.001;" },
              { name: "mixed shapes", code: "const a = totalArea([{ kind: 'square', side: 1 }, { kind: 'circle', r: 1 }]); return Math.abs(a - 4.14159) < 0.001;" },
              { name: "empty list is zero", code: "return totalArea([]) === 0;" },
              { name: "new shapes extend without edits", code: "AREAS.triangle = (t) => (t.base * t.h) / 2; return totalArea([{ kind: 'triangle', base: 4, h: 3 }]) === 6;" },
            ],
            solution: `const AREAS = {
  square: (s) => s.side * s.side,
  circle: (s) => 3.14159 * s.r * s.r,
};

function totalArea(shapes) {
  let total = 0;
  for (const shape of shapes) {
    total += AREAS[shape.kind](shape);
  }
  return total;
}`,
            hints: [
              "AREAS[shape.kind] looks up the right function. Then you call it, with the shape.",
              "Look up, call, add — for every shape in the array.",
              "The test that adds a triangle proves the point: your loop never needed to know.",
            ],
          },
        },
        {
          id: "arch-patterns",
          title: "Design Patterns & Shared Vocabulary",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "A design pattern is a named solution to a problem that keeps recurring. Not code you copy — a shape you recognize. When someone says 'let us use an observer here' or 'that should be a factory', an entire design lands on the table in one word. Patterns matter less as machinery than as vocabulary: they let teams discuss structure at the level of ideas instead of code lines.",
            },
            {
              type: "table",
              headers: ["Pattern", "The problem it answers", "Where you have met it"],
              rows: [
                ["Observer", "Many parts need to react when something changes", "Button click handlers; live dashboards"],
                ["Factory", "Creating the right object should live in one place", "Making the right payment provider per region"],
                ["Strategy", "Swap an algorithm without rewriting its caller", "Sorting rules; discount rules"],
                ["Singleton", "Exactly one shared instance must exist", "A connection pool — handle with care"],
                ["Adapter", "A foreign interface must fit your contract", "Wrapping an old SDK behind your own API"],
              ],
            },
            {
              type: "code",
              caption: "Observer in miniature — the pattern behind every event system you have used",
              code: `const emitter = createEmitter();

emitter.on("order-placed", (order) => {
  // the mailer reacts
});
emitter.on("order-placed", (order) => {
  // the analytics counter reacts — nobody told the order
  // that either of these exists
});`,
            },
            {
              type: "p",
              text: "Notice what the observer pattern buys in that snippet: the code that places the order knows nothing about mailers or analytics. It emits an event and walks on. New reactions can be added forever — log to a warehouse, alert fraud detection — without the order code changing a single line. That is a pattern paying rent: it hardens a boundary.",
            },
            { type: "h", text: "The two traps" },
            {
              type: "p",
              text: "Trap one is the golden hammer: learn one pattern, apply it everywhere, and every problem starts looking like it deserves a singleton. Trap two is pattern worship — inserting factories and observers into code with two users and no change ahead. A pattern used where its problem does not exist is not structure, it is decoration that costs a future reader an hour. The discipline is to reach for a pattern when you recognize its problem — not when you remember its name.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "Ask a model to 'add caching' and it will happily wrap your function. Ask it 'should this be an observer or a strategy?' and you get a real design conversation. AI tools are excellent at applying patterns once the pattern is chosen — the choosing, matching pattern to actual problem, is still your call.",
            },
            {
              type: "p",
              text: "Now build the classic. The exercise hands you the skeleton of an event emitter — the observer pattern itself. Wire up on to remember listeners, emit to call them. When it passes, you will have implemented the same shape that powers every event system from browser clicks to message queues.",
            },
          ],
          quiz: [
            {
              q: "The deepest value of a named design pattern is that it:",
              options: [
                "makes code run faster",
                "lets a team discuss whole design decisions in a single word",
                "guarantees code has no bugs",
                "replaces the need for tests",
              ],
              answer: 1,
              explain:
                "Patterns are shared vocabulary. 'Observer here' compresses a paragraph of design intent into two words every engineer can picture.",
            },
            {
              q: "Why does the order-placing code in an observer setup not know that analytics exists?",
              options: [
                "Because observers run in a different programming language",
                "Because it only emits an event — reactions subscribe from outside, through the boundary",
                "Because analytics runs only at night",
                "Because the compiler deletes the coupling",
              ],
              answer: 1,
              explain:
                "The emitter broadcasts; listeners subscribe independently. The source stays blissfully ignorant of its audience — that is the decoupling.",
            },
            {
              q: "Every module in a small side project now has a factory, a singleton and an observer. What went wrong?",
              options: [
                "Nothing — more patterns is always better",
                "Golden hammer and pattern worship: patterns applied where their problems do not exist",
                "The patterns are in the wrong language",
                "The project needs more singletons",
              ],
              answer: 1,
              explain:
                "A pattern earns its place by matching a real recurring problem. Without the problem, it is expensive decoration for future readers.",
            },
          ],
          exercise: {
            prompt: [
              "Implement the observer pattern from scratch — an event emitter.",
              "createEmitter() must return an object with two functions: on(eventName, fn) remembers fn for that event, and emit(eventName, data) calls every remembered fn, passing data.",
              "Events are isolated: emitting 'click' must never fire listeners for 'hover'.",
              "This exact shape powers browser events, message queues and every reactive framework you will ever touch.",
            ],
            starter: `function createEmitter() {
  const listeners = {};

  function on(eventName, fn) {
    // remember fn for this eventName.
    // your code here
  }

  function emit(eventName, data) {
    // call every fn remembered for this eventName, with data.
    // your code here
  }

  return { on, emit };
}`,
            tests: [
              { name: "a listener hears its event", code: "const e = createEmitter(); let got = 0; e.on('ping', (d) => { got = d; }); e.emit('ping', 41); return got === 41;" },
              { name: "multiple listeners all fire", code: "const e = createEmitter(); let hits = 0; e.on('x', () => { hits += 1; }); e.on('x', () => { hits += 10; }); e.emit('x', null); return hits === 11;" },
              { name: "events are isolated", code: "const e = createEmitter(); let fired = false; e.on('a', () => { fired = true; }); e.emit('b', null); return fired === false;" },
              { name: "emit with no listeners is safe", code: "const e = createEmitter(); e.emit('ghost', 1); return true;" },
            ],
            solution: `function createEmitter() {
  const listeners = {};

  function on(eventName, fn) {
    if (!listeners[eventName]) listeners[eventName] = [];
    listeners[eventName].push(fn);
  }

  function emit(eventName, data) {
    const fns = listeners[eventName] || [];
    for (const fn of fns) fn(data);
  }

  return { on, emit };
}`,
            hints: [
              "Store one array of functions per event name inside listeners.",
              "Same guard-or-create move as grouping: if the array is missing, create it, then push.",
              "emit walks the array and calls each function with data. An event nobody subscribed to is just an empty array.",
            ],
          },
        },
        {
          id: "arch-dry-kiss",
          title: "DRY, KISS, YAGNI",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Three acronyms, one confession: most damage to codebases is not done by stupid people in a hurry. It is done by smart people trying too hard. These three principles are the brake pedals, and every senior engineer you will ever meet has a scar from ignoring one of them.",
            },
            {
              type: "table",
              headers: ["Principle", "Stands for", "Says", "Its failure mode"],
              rows: [
                ["DRY", "Don't Repeat Yourself", "Every fact lives in exactly one place", "Wrong abstractions merged too early"],
                ["KISS", "Keep It Simple, Stupid", "Prefer the simple solution that works", "Complexity smuggled in for its own sake"],
                ["YAGNI", "You Aren't Gonna Need It", "Build for today's requirements", "Speculative features nobody asked for"],
              ],
            },
            { type: "h", text: "DRY's dark side" },
            {
              type: "p",
              text: "DRY is the most quoted and most misused of the three. Its real claim is about knowledge, not text: two pieces of code that happen to look alike but answer to different masters — one owned by billing, one by shipping — are not duplicates, and fusing them into one parameterized mega-function welds two departments together forever. The industry's collected wisdom on this is the rule of three: duplicate freely the first time, tolerate it the second, and abstract on the third occurrence — when the real shared shape has finally revealed itself. Abstract too early and you will build the wrong abstraction, and a wrong abstraction is worse than duplication, because now every future change must fight it.",
            },
            {
              type: "p",
              text: "KISS and YAGNI are siblings aimed at the same enemy: speculative complexity. The pluggable database layer for the app with one database. The configuration system for the tool with two users. The internationalization framework shipped before the first customer. Every one of them was built by someone reasoning sensibly about an imagined future. YAGNI's counter-offer is brutal: you are not a prophet. Build what is needed now, cleanly, and trust that clean code is the cheapest thing to extend later. If the future arrives, it will arrive with better information than you have today.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "When you feel the urge to add an option, a layer, or a hook 'just in case' — write down the exact user story that needs it. If you cannot name the story, you are not engineering, you are hoarding. Future you, debugging at 2 am, sends thanks for every layer you declined to add.",
            },
          ],
          quiz: [
            {
              q: "Two functions look nearly identical — one belongs to billing, one to shipping. Merging them into one is:",
              options: [
                "always correct DRY",
                "risky: they are textually similar but answer to different masters, so change independently",
                "required by the compiler",
                "the rule of three",
              ],
              answer: 1,
              explain:
                "DRY is about knowledge, not appearances. Fusing code that serves different owners couples those owners — and one of them will eventually need the function to change.",
            },
            {
              q: "What does the rule of three recommend?",
              options: [
                "Never write more than three functions per file",
                "Abstract on the third occurrence of duplication, not the first",
                "Test every line three times",
                "Three team members must approve each pull request",
              ],
              answer: 1,
              explain:
                "Duplicate once, tolerate twice, abstract on the third time — by then the genuinely shared shape has emerged, and you are far less likely to build the wrong abstraction.",
            },
            {
              q: "Your side project has a pluggable database layer supporting six engines. It uses one. What principle is being violated?",
              options: ["DRY", "KISS and YAGNI — speculative complexity", "Liskov substitution", "Single responsibility"],
              answer: 1,
              explain:
                "YAGNI: the five unused engines are imagined futures. Every layer of 'just in case' is code to read, test and maintain for a need that never arrived.",
            },
          ],
        },
        {
          id: "arch-tech-debt",
          title: "Technical Debt & the Art of Refactoring",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Sometimes you ship the quick, ugly version on purpose. A deadline, a demo, a launch that cannot slip. The code works, but it cuts corners — hardcoded values, a missing layer, a shortcut you know you will regret. That is technical debt: a loan of speed today, repaid with interest every time someone touches that code later.",
            },
            { type: "h", text: "Interest, and who pays it" },
            {
              type: "p",
              text: "The metaphor is precise in the ways that matter. Debt accrues interest: the tangled module slows every feature that brushes it, every bug hunt inside it, every onboarding of a new engineer. Small debts, taken deliberately and paid back quickly, are healthy — speed now is sometimes exactly the right trade. Unpaid debt compounds: shortcuts breed shortcuts, because nobody wants to be the one who cleans around them. And eventually comes the bankruptcy equivalent — the rewrite nobody can afford, of a system nobody can safely change.",
            },
            {
              type: "code",
              caption: "Same feature, one borrowed and one paid off",
              code: `// the loan: fast to write, interest forever
function isAdmin(u) {
  return u.email === "admin@corp.com"; // hardcoded. good luck.
}

// the repayment: one source of truth for the fact
function isAdmin(u) {
  return u.roles.includes("admin");
}`,
            },
            { type: "h", text: "Refactoring: paying the debt back" },
            {
              type: "p",
              text: "Refactoring is changing code's structure without changing its behavior — paying down the loan while the lights stay on. The craft rules are boring and unbreakable: small steps, each leaving the code working; tests before you start, so behavior is pinned; and one rule worth tattooing somewhere — never mix refactoring with new features in the same change. A pull request that both restructures and extends is unauditable: the reviewer cannot tell movement from mutation.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "AI has quietly changed the economics here. Extracting a function, renaming across a codebase, writing the tests that pin behavior before you refactor — all of it is dramatically cheaper with a good assistant. The judgment of WHERE to pay debt down and WHETHER the trade is worth it remains yours. Machines lower the cost of repayment; they do not decide the budget.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "The boy scout rule: leave the code a little cleaner than you found it. Not a heroic rewrite — one renamed function, one extracted method, one deleted dead branch per visit. Teams that practice it never face the mountain, because the mountain never gets a chance to form.",
            },
          ],
          quiz: [
            {
              q: "Technical debt is best understood as:",
              options: [
                "code written by junior developers",
                "speed borrowed today, repaid with interest on every future change",
                "any code older than two years",
                "bugs that have not been fixed yet",
              ],
              answer: 1,
              explain:
                "The debt is deliberate speed-at-the-cost-of-structure. Interest is the drag on everyone who touches the code afterwards. Taken deliberately and repaid promptly, it is a tool.",
            },
            {
              q: "What is the non-negotiable precondition for a safe refactor?",
              options: [
                "A fresh architecture diagram",
                "Tests that pin the current behavior before you restructure",
                "Rewriting the module from scratch",
                "Renaming every variable at once",
              ],
              answer: 1,
              explain:
                "Refactoring changes structure, never behavior — and only tests can prove behavior survived. Without that pin, you are not refactoring, you are gambling.",
            },
            {
              q: "Why should refactoring and new features never share one pull request?",
              options: [
                "It makes the diff too colorful",
                "Reviewers cannot distinguish structural moves from behavior changes, so nothing is really verified",
                "Git cannot handle both at once",
                "Features must always come first",
              ],
              answer: 1,
              explain:
                "Mixed changes are unauditable. Split them: one pure refactor the reviewer can skim, one feature the reviewer can study.",
            },
          ],
        },
        {
          id: "arch-boss-patterns",
          title: "The Pattern Wraith",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 2 closes with a visitation. The Pattern Wraith has read every design book ever printed and misused half of them. It will test whether you can tell a principle from a slogan — and whether you know when NOT to reach for the shiny hammer.",
            },
            {
              type: "p",
              text: "Five stages. Answer true, and pass. The wraith respects precision and nothing else.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Pattern Wraith",
            intro:
              "It condenses out of the design books, shimmering with UML. 'Everyone quotes me,' it whispers, 'few survive quoting me correctly.'",
            art: `       .---------.
      /   _   _   \\
     |   (o) (o)   |
     |     ...     |
      \\  \\_____/  /
       '.  \\_/  .'
         '-...-'
        ~ ~ ~ ~ ~`,
            stages: [
              {
                question: "The wraith hisses: 'Single responsibility means a module has...?'",
                options: [
                  "one reason to change",
                  "one function in it",
                  "one parameter",
                  "one line of code",
                ],
                answer: 0,
                explain:
                  "Not one task in the literal sense — one reason to change. The test is organizational: who would need to edit this file, and how many unrelated groups are they?",
              },
              {
                question: "It conjures an area table dispatching per shape. 'Which principle is on display?'",
                options: [
                  "Open/closed — new shapes extend by addition, not by editing",
                  "Singleton",
                  "Liskov substitution",
                  "Interface segregation",
                ],
                answer: 0,
                explain:
                  "The dispatching code is closed for modification — it never changes again. New behavior arrives as new entries. That is open/closed, working for a living.",
              },
              {
                question: "'When should you abstract duplicated code, by the rule of three?'",
                options: [
                  "The moment you see two similar lines",
                  "On the third occurrence — once the true shared shape has emerged",
                  "Never — duplication is always fine",
                  "Before writing the code at all",
                ],
                answer: 1,
                explain:
                  "Abstract too early and you weld together things that merely look alike. The third occurrence is when the real pattern has usually revealed itself.",
              },
              {
                question: "The wraith shows you a side project with a pluggable engine supporting six databases. It uses one. 'Name the sin.'",
                options: [
                  "Excessive DRY",
                  "YAGNI — speculative complexity for an imagined future",
                  "Missing singleton",
                  "Too much cohesion",
                ],
                answer: 1,
                explain:
                  "You Aren't Gonna Need It. The five unused engines are pure imagined future, and every one of them is code to read, test and maintain forever.",
              },
              {
                question: "Final whisper: 'Refactoring changes... what, exactly?'",
                options: [
                  "Structure only — behavior must stay identical, pinned by tests",
                  "Behavior only",
                  "Both structure and behavior, freely",
                  "The programming language",
                ],
                answer: 0,
                explain:
                  "If behavior changes, it is a feature or a fix — not a refactor. The safety of the whole practice rests on that distinction, proven by tests.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "arch-scale",
      title: "Data & Scale",
      blurb: "Model the facts, pick the store, cache the answers — and survive success.",
      lessons: [
        {
          id: "arch-data-modeling",
          title: "Modeling Data: Entities & Relations",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Programs are temporary; data is forever. Frameworks get rewritten, languages get replaced, but that users table from 2009 is still in production, still shaping what the company can do. Data modeling — deciding what facts exist and how they relate — is the least glamorous and most durable architecture decision you will ever make.",
            },
            { type: "h", text: "Entities, attributes, relations" },
            {
              type: "p",
              text: "An entity is a kind of thing your system cares about: a user, a lesson, an order. Attributes are the facts you keep about it: a user has a name, a joined date. Relations connect entities, and they come in exactly three flavors: one-to-one (a user has one profile), one-to-many (a user places many orders), and many-to-many (a student completes many lessons, a lesson is completed by many students). Every database schema you will ever read is those three shapes, combined.",
            },
            {
              type: "code",
              caption: "One fact, referenced everywhere — stored once",
              code: `users:      { id: 1, name: "ada" }
orders:     { id: 501, userId: 1, total: 42 }
            { id: 502, userId: 1, total: 17 }

// order 501 belongs to user 1 by REFERENCE — the user's
// name is not copied into the order. One fact, one home.`,
            },
            { type: "h", text: "Normalize: every fact lives once" },
            {
              type: "p",
              text: "The core discipline of modeling is normalization, and its rule fits on a sticky note: store every fact exactly once, and reference it everywhere else. Copy a user's address into five orders and the day they move, four of those orders are now lies. Reference it once instead, and updating the fact updates the whole system's truth. Before denormalizing — deliberately copying for read speed — earn the right by understanding what duplication costs you.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Model by interviewing your data. What questions must this system answer, and how often? 'Show my orders' means orders need a user reference. 'Show the best-selling products' means orders need product references. The queries you will run shape the model far more than any diagramming instinct.",
            },
            {
              type: "p",
              text: "For the exercise, build the structure databases lean on hardest: the primary-key index. You will take an array of rows and build the lookup object that makes finding any row instant — one pass, one map, no scanning. It is the same trick your database uses, in miniature.",
            },
          ],
          quiz: [
            {
              q: "Why does an order store a user ID instead of copying the user's name and address?",
              options: [
                "It saves a few bytes of storage",
                "So each fact lives in one place — update it once and the whole system stays true",
                "Because IDs look professional",
                "Orders are not allowed to contain text",
              ],
              answer: 1,
              explain:
                "Copied facts drift apart the moment reality changes. A reference keeps a single source of truth — the heart of normalization.",
            },
            {
              q: "Students enroll in many courses; courses hold many students. What relation is that?",
              options: ["One-to-one", "One-to-many", "Many-to-many", "No relation"],
              answer: 2,
              explain:
                "Many-to-many — usually resolved with a middle entity, like an enrollment row holding both a student reference and a course reference.",
            },
            {
              q: "What is the guiding question when deciding which attributes an entity needs?",
              options: [
                "Which attributes does the database find prettiest?",
                "Which questions must the system answer, now and soon?",
                "How many columns did the last project use?",
                "As many as possible — you can never have too many",
              ],
              answer: 1,
              explain:
                "Model by interviewing the data's future queries. Attributes exist to answer questions; a question with no attribute behind it becomes a scramble later.",
            },
          ],
          exercise: {
            prompt: [
              "Build the structure every database leans on: a primary-key index.",
              "Write buildIndex(rows, key). rows is an array of objects; key is a field name like 'id'.",
              "Return an object that maps each row's key value to the row itself — so lookups become instant instead of scans.",
              "One pass over the rows, one entry per row. Keys are unique — later rows replace earlier ones with the same key.",
            ],
            starter: `function buildIndex(rows, key) {
  // rows: [{ id: 3, name: 'cy' }, { id: 7, name: 'zed' }, ...]
  // key:  the field to index by, like 'id'.
  // Return: { 3: { id: 3, name: 'cy' }, 7: { ... } }
  // so buildIndex(rows, 'id')[7] finds zed instantly.
  const index = {};
  // your code here
  return index;
}`,
            tests: [
              { name: "lookup by id is instant", code: "const rows = [{ id: 3, name: 'cy' }, { id: 7, name: 'zed' }]; const ix = buildIndex(rows, 'id'); return ix[7].name === 'zed' && ix[3].name === 'cy';" },
              { name: "empty rows, empty index", code: "return Object.keys(buildIndex([], 'id')).length === 0;" },
              { name: "any field can be the key", code: "const rows = [{ slug: 'a', n: 1 }, { slug: 'b', n: 2 }]; const ix = buildIndex(rows, 'slug'); return ix.b.n === 2;" },
              { name: "later rows win on key collisions", code: "const rows = [{ id: 1, v: 'old' }, { id: 1, v: 'new' }]; return buildIndex(rows, 'id')[1].v === 'new';" },
            ],
            solution: `function buildIndex(rows, key) {
  const index = {};
  for (const row of rows) {
    index[row[key]] = row;
  }
  return index;
}`,
            hints: [
              "row[key] reads the field whose name is stored in the key variable — bracket access.",
              "One loop: assign each row to index[row[key]].",
              "Assignment naturally means the last row with a key wins, which is exactly what we want here.",
            ],
          },
        },
        {
          id: "arch-sql-nosql",
          title: "SQL vs NoSQL: Picking a Store",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Data models need a home, and the two great families of homes could not be more different in spirit. Relational databases — SQL — organize reality into tables of rows, joined by reference, policed by schema. Document databases — the most common NoSQL — store JSON-shaped blobs that each stand alone, flexible and forgiving. Both are excellent. Neither is general. The fight is older than you think and it is not a fight — it is a wardrobe decision.",
            },
            {
              type: "table",
              headers: ["", "Relational (SQL)", "Document (NoSQL)"],
              rows: [
                ["Shape", "Tables, rows, references", "Self-contained JSON documents"],
                ["Schema", "Enforced up front — bad data rejected at the door", "Flexible — each document can differ"],
                ["Best at", "Related facts, complex questions, consistency", "Read-heavy, nested, fast-moving shapes"],
                ["Watch out for", "Rigid migrations, join-heavy hot paths", "Duplicated data drifting out of sync"],
              ],
            },
            {
              type: "code",
              caption: "The same order, as each family would store it",
              code: `-- relational: three facts, three tables, joined on demand
users(id, name)  orders(id, user_id, total)  items(order_id, sku, qty)

// document: one self-contained snapshot, read in one go
{
  "_id": 501, "user": { "id": 1, "name": "ada" },
  "total": 42, "items": [ { "sku": "TEE", "qty": 2 } ]
}`,
            },
            {
              type: "p",
              text: "Notice the deep trade in that snippet. The relational version stores each fact once and assembles answers with joins — perfect truth, paid for in assembly. The document version hands you the whole answer in one read — perfect speed, paid for in duplication: ada's name now lives in every one of her orders. Neither is wrong. Relational shines when facts are shared and questions are unpredictable — billing, inventory, anything with money. Documents shine when data is nested, self-contained and read whole — user profiles, content, catalogs.",
            },
            { type: "h", text: "Indexes: the universal cheat code" },
            {
              type: "p",
              text: "Whichever family you choose, one law binds both: without an index, every query is a full scan — read every row, ask every one. With an index — the sorted lookup structure you built by hand last lesson — the database jumps straight to the answer. The trade is classic: indexes cost writes and space, and buy read speed. Index the fields you search by; skip the ones you never do.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Pick your database because it matches your data's shape and your queries' needs — never because it is new, nostalgic, or trending on developer social media. Migrating a live system between families is one of the most expensive do-overs in engineering.",
            },
          ],
          quiz: [
            {
              q: "A billing system with customers, invoices and payments that must never disagree. Which family is the safer default?",
              options: [
                "Relational (SQL) — enforced schema and references keep shared facts consistent",
                "Document (NoSQL) — flexible shapes fit anything",
                "Whichever launched most recently",
                "Store it in a spreadsheet",
              ],
              answer: 0,
              explain:
                "Money means many relations and a low tolerance for contradictory copies. Schema enforcement and single sources of truth are the relational home turf.",
            },
            {
              q: "You store each user's profile as one nested JSON blob, read whole, rarely joined. What is the natural fit?",
              options: ["A document database", "A strict graph of 40 tables", "Plain text files", "No database at all"],
              answer: 0,
              explain:
                "Self-contained, nested, read whole — the document profile. One read, no assembly, and no shared facts to drift.",
            },
            {
              q: "What does a database index fundamentally trade?",
              options: [
                "Security for speed",
                "Write speed and storage for read speed",
                "Accuracy for convenience",
                "Nothing — indexes are free",
              ],
              answer: 1,
              explain:
                "Every index must be maintained on every write, and each one occupies space — that is the rent. You pay it back only on the fields you actually search.",
            },
          ],
        },
        {
          id: "arch-caching",
          title: "Caching: Keep the Answer Nearby",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Some requests are expensive — a page assembled from six queries, a report computed over a million rows, a file fetched across an ocean. And most of the time, nobody needs the fresh answer. Caching is the art of noticing that: compute once, keep the answer near, and hand the copy out until it stops being true. Done well, it is the single biggest speed win in computing. Done carelessly, it serves yesterday's truth as today's.",
            },
            {
              type: "code",
              caption: "The whole idea, in five lines",
              code: `function getPrice(symbol) {
  if (cache[symbol] && !isExpired(symbol)) {
    return cache[symbol]; // hit: skip the expensive work
  }
  const price = expensiveFetch(symbol); // miss: pay full price
  cache[symbol] = price;                // remember for next time
  return price;
}`,
            },
            { type: "h", text: "Where caches live" },
            {
              type: "p",
              text: "Caches stack in layers, each closer to the person waiting. The browser keeps images and scripts so a second visit costs nothing. A CDN keeps copies of your files in cities near your users, so a request from Dhaka does not cross the planet. Your app keeps hot answers in memory. Your database keeps index pages it reads often. Same idea at every altitude: move the answer closer, and the distance you pay shrinks.",
            },
            { type: "h", text: "The hard part: truth decays" },
            {
              type: "p",
              text: "An old joke among engineers says there are only two hard problems in computer science: cache invalidation, naming things, and off-by-one errors. The invalidation joke is the serious one — deciding when a cached answer stops being true. The standard tool is a TTL, a time-to-live: each cached answer carries an expiry, after which it is recomputed. The trade is naked: short TTLs mean fresher answers and more expensive misses; long TTLs mean cheap hits and staler truth. Correctness requirements set the dial, not taste.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "A cache you cannot clear in an emergency is a liability wearing a cape. When you fix a bug or change a calculation, stale caches keep serving the old, wrong answer until they expire — sometimes to millions of users. Every cache in your system should have a way to be flushed, and you should know where that lever is before 2 am.",
            },
            {
              type: "p",
              text: "Now build the purest cache there is: memoization, wrapping a single function so repeat calls with the same argument skip the work entirely. It is one small function, and it is also the exact mechanism inside every caching layer you just read about — from the browser to the CDN to the database.",
            },
          ],
          quiz: [
            {
              q: "What is the fundamental bargain a cache makes?",
              options: [
                "Trade freshness for speed — serve remembered answers instead of recomputing",
                "Trade security for storage",
                "Trade accuracy for pretty interfaces",
                "Trade disk space for network speed only",
              ],
              answer: 0,
              explain:
                "A cache stores a computed answer and hands out copies. The entire craft is deciding when the copy is still true enough to serve.",
            },
            {
              q: "What does a TTL control?",
              options: [
                "How large the cache can grow",
                "How long a cached answer is served before it expires and is recomputed",
                "How many users can share one cache",
                "The password for the cache server",
              ],
              answer: 1,
              explain:
                "Time-to-live is the freshness dial: short TTLs buy freshness with more recomputation; long TTLs buy speed with staleness risk.",
            },
            {
              q: "Why must every cache have a way to be cleared?",
              options: [
                "To free memory every night automatically",
                "So a fix or change is not masked by stale answers being served until expiry",
                "Because caches are illegal in some countries",
                "To reset the TTL counter",
              ],
              answer: 1,
              explain:
                "The nightmare scenario: you fix a bug, deploy, and users still see the wrong answer — because a cache somewhere is faithfully serving yesterday. Know your flush levers.",
            },
          ],
          exercise: {
            prompt: [
              "Build the purest cache in computing: memoization.",
              "Write memoize(fn). It returns a NEW function that behaves like fn, but remembers results: calling it twice with the same argument runs the real fn only once.",
              "Different arguments each do their own work — only repeats are free.",
              "When it passes, you have implemented the mechanism inside every cache layer you have ever used.",
            ],
            starter: `function memoize(fn) {
  const cache = {};
  return function (arg) {
    // cache hit? return the remembered answer.
    // miss? call fn, remember the result, return it.
    // your code here
    return undefined;
  };
}`,
            tests: [
              { name: "behaves like the original", code: "const m = memoize((n) => n * 3); return m(4) === 12 && m(0) === 0 && m(-2) === -6;" },
              { name: "repeat calls run the work only once", code: "let calls = 0; const m = memoize((n) => { calls += 1; return n + 1; }); m(5); m(5); m(5); return calls === 1;" },
              { name: "different arguments each pay", code: "let calls = 0; const m = memoize((n) => { calls += 1; return n * 2; }); m(1); m(2); m(1); return calls === 2;" },
              { name: "cached and fresh results agree", code: "const m = memoize((s) => s.toUpperCase()); const first = m('abc'); const second = m('abc'); return first === 'ABC' && second === 'ABC';" },
            ],
            solution: `function memoize(fn) {
  const cache = {};
  return function (arg) {
    if (arg in cache) return cache[arg];
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}`,
            hints: [
              "Use the argument as a property name on the cache object: cache[arg].",
              "Check before computing — the 'in' operator asks whether a key exists.",
              "On a miss: compute, store, return. On a hit: return immediately. That is the entire cache.",
            ],
          },
        },
        {
          id: "arch-monolith-micro",
          title: "Monoliths, Microservices & Messages",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "There is a question every growing system eventually forces: should this be one deployable program, or many? One program — a monolith — where a single build contains everything. Or many small services — microservices — each owned by a team, deployed on its own, talking to the others over the network. The debate generates more heat than almost any topic in architecture, and the honest answer is that both are correct — at different sizes.",
            },
            {
              type: "ascii",
              art: `  MONOLITH                   MICROSERVICES
  .-----------------.        .---.  .---.  .---.
  | ui   billing    |        |ui |  |ui |  |ui |
  | search   mail   |        '---'  '---'  '---'
  | everything      |          |      |      |
  '------db---------'          v      v      v
   one build, one ship       .----. .----. .----.
                              |pay| |srch| |mail|
                              '----' '----' '----'`,
            },
            {
              type: "p",
              text: "The monolith's virtues are criminally underrated. One build, one deploy, one log stream. A function call from billing to search costs nanoseconds, and if it fails, you get a stack trace, not a network timeout. For a small team and a young product, that simplicity is not a compromise — it is the correct architecture. Its weakness only appears at scale: every deploy ships the whole system, so every team queues on the same release train, and one memory leak takes everything down.",
            },
            {
              type: "p",
              text: "Microservices invert every one of those trades. Teams deploy independently, hourly if they like; a failure in search can leave checkout standing; different services can even use different technologies. The price is brutal and permanent: function calls become network calls — slower, and able to fail in ways a function call cannot dream of. You inherit distributed-systems homework: retries, timeouts, tracing, and data spread across boundaries that used to be a join. Only pay that tuition when organizational scale demands it — most systems should begin life as a well-structured monolith, and split only along the seams that actually hurt.",
            },
            { type: "h", text: "Messages: decoupling in time" },
            {
              type: "p",
              text: "There is a third move that is not about size at all: message queues. Instead of the checkout calling the mailer directly and waiting, checkout drops a message — order placed — onto a queue, and walks on. The mailer picks it up whenever it can. The two systems are now decoupled in time: the mailer can be slow, down, or being redeployed, and checkout never notices. When your reactions to an event start multiplying — mail, analytics, fraud checks — a queue turns the chaos into a broadcast.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Famous advice from an early Amazon engineer: monolith first. Start with one well-structured deployable, keep modules behind clean contracts, and extract a service only when a seam demands it — a team boundary, a scaling hotspot, a failure-isolation need. A monolith carved along future service lines is cheap to split; a pile of premature microservices is expensive to run and nearly impossible to merge.",
            },
          ],
          quiz: [
            {
              q: "What is the strongest argument FOR starting with a monolith?",
              options: [
                "Monoliths can never fail",
                "In-process calls are fast, debuggable and simple — deploy and trace one system",
                "Monoliths require no code review",
                "It is the only option cloud providers support",
              ],
              answer: 1,
              explain:
                "A function call is nanoseconds and yields a stack trace when it breaks. That simplicity is worth real money at small scale, where you have not yet earned distributed-systems problems.",
            },
            {
              q: "What does a team truly gain from microservices?",
              options: [
                "Automatically faster code",
                "Independent deploys and failure isolation between services",
                "No need for monitoring anymore",
                "Freedom from writing tests",
              ],
              answer: 1,
              explain:
                "The real prize is organizational: teams ship on their own cadence, and one service's crash does not take the platform with it. The cost is a distributed system to operate.",
            },
            {
              q: "Checkout drops an 'order placed' message on a queue instead of calling the mailer directly. What did that buy?",
              options: [
                "Faster mail delivery",
                "Decoupling in time — the mailer can be slow or down and checkout still succeeds",
                "Stronger password hashing",
                "Nothing; queues are only for logs",
              ],
              answer: 1,
              explain:
                "The queue breaks the time coupling: producer and consumer never wait for each other. This is the observer pattern of the architecture world, scaled up.",
            },
          ],
        },
        {
          id: "arch-boss-scale",
          title: "The Scale Titan",
          minutes: 5,
          xp: 100,
          concept: [
            {
              type: "p",
              text: "The final gate of the red path. The Scale Titan has absorbed every traffic spike, every slow query, every 3 am page. It does not care how elegant your diagrams looked in the meeting — it cares whether your structure survives contact with a million users.",
            },
            {
              type: "p",
              text: "Six stages. The Titan's respect is the hardest currency in this course. Bank it.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Scale Titan",
            intro:
              "The floor shakes. A shape made of load balancers and query plans pulls itself upright. 'One million requests per minute,' it intones. 'Show me a system that deserves to serve them.'",
            art: `        ( ( ( o ) ) )
     ( ( (  LOAD  ) ) )
    [=====-=======-=====]
     \\_________________/
      |o o o o o o o o|
      |o o o o o o o o|
     /=================\\
    < 1,000,000 req/s >`,
            stages: [
              {
                question: "The Titan booms: 'An order stores a user ID, not a copy of the user's name. Why?'",
                options: [
                  "To save storage space",
                  "So each fact lives once — change the name and the whole system stays true",
                  "Because IDs are easier to read",
                  "To encrypt the orders",
                ],
                answer: 1,
                explain:
                  "Normalization: one fact, one home, referenced everywhere. Copied facts drift into contradictions the moment reality changes.",
              },
              {
                question: "It shows you nested, self-contained user profiles, read whole, rarely joined. 'Choose the store.'",
                options: [
                  "A document database — the data is already shaped like documents",
                  "Forty relational tables joined at read time",
                  "A CSV file per profile",
                  "Blockchain",
                ],
                answer: 0,
                explain:
                  "Self-contained, nested, read whole: the document home turf. One read, no assembly, no shared facts to drift.",
              },
              {
                question: "A report page takes nine seconds because it recomputes a million rows on every visit. Your cheapest weapon?",
                options: [
                  "A bigger server",
                  "A cache — compute once, serve the answer until it expires",
                  "Rewrite it in a faster language",
                  "Delete the page",
                ],
                answer: 1,
                explain:
                  "Most requests do not need the fresh answer. Caching moves the expensive computation from 'every visit' to 'once per TTL' — the biggest win available.",
              },
              {
                question: "'Every cache must have...' the Titan pauses. You finish the sentence:",
                options: [
                  "a unique color scheme",
                  "a way to be cleared — or a fix will be masked by stale answers",
                  "a public API",
                  "its own domain name",
                ],
                answer: 1,
                explain:
                  "Truth decays and deployments change calculations. The cache you cannot flush in an emergency will faithfully serve the wrong answer at scale.",
              },
              {
                question: "The Titan asks why your young startup should NOT run eight microservices.",
                options: [
                  "Because microservices cannot handle traffic",
                  "Because you would pay distributed-systems costs without the organizational scale that justifies them",
                  "Because containers are banned",
                  "Because one database is required by law",
                ],
                answer: 1,
                explain:
                  "Network calls, retries, tracing, independent deploys — that is real permanent cost. Monolith first; split along the seams only when they actually hurt.",
              },
              {
                question: "Final blow: 'What does a message queue decouple that a direct call cannot?'",
                options: [
                  "Code from comments",
                  "Time — the producer walks on; the consumer catches up whenever it can",
                  "Databases from disks",
                  "Nothing; queues are only decorative",
                ],
                answer: 1,
                explain:
                  "A direct call couples two systems to each other's availability and speed right now. A queue says: the fact is recorded; react when you can. Checkout survives the mailer's nap.",
              },
            ],
          },
        },
      ],
    },
  ],
};
