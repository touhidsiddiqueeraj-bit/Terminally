import type { Course } from "./types";

export const securityCourse: Course = {
  id: "security",
  title: "Security & Privacy",
  subtitle: "Defend your accounts, your data, and your sanity — in a world of AI-powered scams.",
  icon: "shield",
  color: "amber",
  chapters: [
    {
      id: "digital-fortress",
      title: "Your Digital Fortress",
      blurb: "Accounts are the front door. Lock yours properly.",
      lessons: [
        {
          id: "sec-threat-model",
          title: "Who's After You?",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Picture a hacker. You're imagining a hooded genius in a dark room, personally hunting you through the wires, right? Here's the good news: that person almost certainly doesn't exist. The overwhelming majority of attacks are opportunistic — automated scripts that rattle every doorknob in the neighborhood, all day long, looking for doors that are already unlocked.",
            },
            {
              type: "p",
              text: "That's genuinely great news for you. You don't need to outsmart a genius. You need a locked door, because the bot just shuffles on to the next house. Strong basic defenses beat the overwhelming majority of real-world attacks — and this course is those defenses.",
            },
            { type: "h", text: "Think like a defender" },
            {
              type: "p",
              text: "Security professionals call it threat modeling, and it's less mysterious than it sounds. It's just three questions you ask about your own digital life — the same way you'd walk through your house checking the windows before a trip.",
            },
            {
              type: "list",
              items: [
                "What do I have that's worth stealing",
                "Who might want it, and what could they do with it",
                "How would they most likely try to get it",
              ],
            },
            {
              type: "p",
              text: "Your answers define your risk. And risk has a simple shape: it's likelihood multiplied by damage. A likely-but-annoying threat, like spam, matters far less than a rare-but-devastating one, like your bank account being emptied. When you can't fix everything at once, you fix the high-damage things first.",
            },
            { type: "h", text: "The three locks everyone needs" },
            {
              type: "p",
              text: "Whatever else you do, three defenses cover more ground than everything else combined: keep your software updated, use a unique password for every account, and turn on multi-factor authentication wherever it's offered. The rest of this chapter shows you how to do all three without losing your mind.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Spend your effort where the damage is highest. Your email and banking accounts are the crown jewels — email is the reset key to everything else, and banking is, well, your money. Harden those first, then work outward.",
            },
          ],
          quiz: [
            {
              q: "Most attacks a normal person faces are best described as...",
              options: [
                "Long, personal campaigns run by genius hackers",
                "Opportunistic and automated — bots rattling every doorknob, looking for unlocked ones",
                "Almost always inside jobs at the companies you use",
                "Random accidents with no attacker involved",
              ],
              answer: 1,
              explain:
                "The movie-style mastermind is rare. Most real attacks are cheap, automated, and opportunistic — which is exactly why basic defenses work so well against them.",
            },
            {
              q: "Risk is best understood as...",
              options: [
                "How scary a threat sounds in the news",
                "How many passwords you have to manage",
                "Likelihood multiplied by damage",
                "How fast your internet connection is",
              ],
              answer: 2,
              explain:
                "A threat that's likely but harmless barely registers. One that's rare but catastrophic does. Multiply the two and you know where to spend your defense budget.",
            },
            {
              q: "You have one free hour to improve your security. Where should it go?",
              options: [
                "Your email and banking accounts first",
                "The account you use least often",
                "Your music streaming account",
                "Alphabetically, starting with the letter A",
              ],
              answer: 0,
              explain:
                "Email is the master reset key to your other accounts, and banking is your actual money. Highest potential damage gets locked first.",
            },
          ],
        },
        {
          id: "sec-passwords",
          title: "Why Your Password Is Weak",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You've been told to make strong passwords your whole digital life. But strong how? And why does clever character soup still lose to something a toddler could remember? Time to put actual numbers on it.",
            },
            { type: "h", text: "Entropy: the price of guessing you" },
            {
              type: "p",
              text: "Security folks measure password strength in bits of entropy — a number that says how hard the password is to guess by brute force. Every extra bit doubles the number of guesses an attacker needs. Two things buy entropy: a bigger alphabet of possible characters, and above all, length. Length wins, because every character you add multiplies the search space all over again.",
            },
            {
              type: "code",
              caption: "Guessing price, measured in bits",
              code: `// Two passwords, similar effort to type and remember:
const weak = "P@ssw0rd!";                  // famous
const phrase = "river-copper-lantern-moss"; // four random words

function bits(text, pool) {
  // each character multiplies the guesses needed by the pool size
  return Math.round(text.length * Math.log2(pool));
}

console.log(bits(weak, 94));   // pool 94: letters + digits + symbols
console.log(bits(phrase, 58)); // pool 58: letters + the hyphens
// 59 theoretical bits vs 146 honest ones — length is the lever`,
            },
            { type: "h", text: "Why clever loses" },
            {
              type: "p",
              text: "Notice the catch: the clever password scores 59 bits of theoretical entropy and still falls in seconds. Real attackers don't guess blind — they run dictionary attacks, trying billions of known passwords and common patterns first. Every famous password, and every clever substitution like turning a into @ or o into 0, is already on those lists. P@ssw0rd isn't a puzzle to them; it's a word in their dictionary.",
            },
            {
              type: "table",
              headers: ["Password style", "Entropy feel", "Verdict"],
              rows: [
                ["Common word + digits", "Password1 — feels compliant", "Dictionary food, cracked instantly"],
                ["Leet substitutions", "P@ssw0rd! — feels sneaky", "On every cracking list"],
                ["Short random soup", "xK9#mQ2! — feels hardcore", "Decent, but short and unmemorable"],
                ["Four random words", "river-copper-lantern-moss", "Long, strong, and you can remember it"],
              ],
            },
            {
              type: "p",
              text: "One more failure mode ruins lives: reuse. When a password leaks from one site, attackers immediately try it everywhere else — a trick called credential stuffing, and it works because humans reuse passwords so reliably. Your one reused password becomes a skeleton key, and a single breach turns into five account takeovers before breakfast.",
            },
            {
              type: "p",
              text: "The sweet spot is the passphrase: four truly random words strung together. It's long enough to push guessing costs into the absurd, and memorable enough that you won't write it on a sticky note. That's not a style opinion — it's arithmetic, and you're about to prove it by building the calculator yourself in the exercise below.",
            },
          ],
          quiz: [
            {
              q: "Which password puts up the best real-world fight?",
              options: ["P@ssw0rd!", "Password123", "xK9#mQ2!", "river-copper-lantern-moss"],
              answer: 3,
              explain:
                "Length wins. The passphrase carries over a hundred bits of honest entropy, while the others are either dictionary-famous or short enough to fall to sustained guessing.",
            },
            {
              q: "Why is reusing one good password across sites still dangerous?",
              options: [
                "It slowly wears out from overuse",
                "One breach lets attackers try that password on all your other accounts",
                "Websites detect reuse and lock you out",
                "It makes your password manager crash",
              ],
              answer: 1,
              explain:
                "That's credential stuffing, and it works because reuse is so common. The strength of the password stops mattering the moment attackers hold a working copy of it.",
            },
            {
              q: "The cheapest way to add real entropy to a password is...",
              options: [
                "Adding length — each new character multiplies the guesses needed",
                "Swapping letters for lookalike symbols",
                "Changing it every week",
                "Adding your birth year at the end",
              ],
              answer: 0,
              explain:
                "Length multiplies the search space every single time. Symbol swaps are famous patterns dictionaries already know, and birth years are among the first things guessed.",
            },
          ],
          exercise: {
            prompt: [
              "Time to build a real strength meter — the same math defenders use.",
              "Write passwordEntropy(pw), which estimates a password's strength in bits.",
              "The pool starts at 26 for lowercase letters. Grow it: add 26 if the password contains any uppercase letter, 10 for any digit, and 32 for any symbol (anything that is not a letter or digit).",
              "The return line already does the math — your only job is growing the pool before it runs.",
            ],
            starter: `function passwordEntropy(pw) {
  // Estimate a password's strength in bits.
  // 1) Find the pool size:
  //    - start at 26 (lowercase letters)
  //    - +26 if it contains ANY uppercase letter
  //    - +10 if it contains ANY digit
  //    - +32 if it contains ANY symbol (not a letter or digit)
  // 2) Return Math.round(pw.length * Math.log2(pool))
  let pool = 26;
  // your code here
  return Math.round(pw.length * Math.log2(pool));
}`,
            tests: [
              { name: "ten lowercase letters score 47", code: "return passwordEntropy('abcdefghij') === 47;" },
              { name: "short but mixed is still weak", code: "return passwordEntropy('A1!') === 20;" },
              { name: "a single character is nearly nothing", code: "return passwordEntropy('a') === 5;" },
              { name: "empty password has zero entropy", code: "return passwordEntropy('') === 0;" },
            ],
            solution: `function passwordEntropy(pw) {
  let pool = 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  return Math.round(pw.length * Math.log2(pool));
}`,
            hints: [
              "Regex testers: /[A-Z]/.test(pw) is true if pw has any uppercase letter.",
              "The symbol test is the opposite: /[^A-Za-z0-9]/ matches anything not a letter or digit.",
              "The formula at the bottom already does the math — you only grow the pool.",
            ],
          },
        },
        {
          id: "sec-managers",
          title: "Password Managers & Passkeys",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You just learned you need a long, unique password for every account. If you're feeling smug about remembering a hundred of those, you're either wrong or a wizard. The honest math: human memory is built for faces and stories, not random strings. So stop trying.",
            },
            { type: "h", text: "One vault, one key" },
            {
              type: "p",
              text: "A password manager is a digital vault with one really good lock. You remember a single strong master password — ideally a passphrase — and the manager generates and remembers a long, random, unique password for every site you use. It fills them in for you, so your passwords can be as ugly as they deserve to be, because you never have to type them.",
            },
            {
              type: "list",
              items: [
                "Generates a long random password for every account",
                "Stores everything in one encrypted vault",
                "Autofills only on the real site, which fights phishing",
                "Syncs your vault across your devices",
              ],
            },
            { type: "h", text: "But... one vault? Isn't that a target?" },
            {
              type: "p",
              text: "Fair question — you are concentrating risk, and it deserves an honest answer. Reputable managers use zero-knowledge encryption: your vault is encrypted on your device, and your master password never leaves it. The company could lose every server it owns, and the thief still gets a pile of scrambled nothing without your master password. We crack open how that math actually works in the Cryptography course. Nothing is zero risk — but compare it to the alternative: a hundred weak, reused passwords you can actually remember.",
            },
            { type: "h", text: "Passkeys: nothing to phish" },
            {
              type: "p",
              text: "The newer idea might retire passwords entirely. A passkey is a pair of cryptographic keys: the website keeps a public one, your device keeps the private one, and logging in is just your device proving it holds the secret — usually confirmed with your fingerprint or face. There's no password to type, so there's nothing to phish, reuse, or leak in a breach. Support for passkeys is growing across the web, and it's the direction login is heading.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Don't migrate all hundred accounts in one heroic evening — you'll quit by account four. Start with your email and banking passwords, then add the rest whenever you happen to log in somewhere.",
            },
          ],
          quiz: [
            {
              q: "What problem does a password manager actually solve?",
              options: [
                "It remembers one strong master password and generates a unique strong one for every site",
                "It makes websites stop asking for passwords",
                "It stores your passwords in your email for safekeeping",
                "It automatically upgrades all your old passwords",
              ],
              answer: 0,
              explain:
                "You memorize one thing; the vault memorizes the rest. That single swap upgrades every account without upgrading your brain.",
            },
            {
              q: "With zero-knowledge encryption, the password manager's own company...",
              options: [
                "Reads your vault for quality control",
                "Keeps a spare copy of your master password in case you forget",
                "Cannot read your vault — your master password never leaves your device",
                "Decrypts your vault only during business hours",
              ],
              answer: 2,
              explain:
                "The vault is encrypted on your device before it ever travels. A breached company hands attackers ciphertext, not your passwords.",
            },
            {
              q: "Why are passkeys so hard to phish?",
              options: [
                "They're too new for scammers to know about",
                "There's no shared secret to steal — your device proves itself with a private key that never leaves it",
                "They use passwords too long for phishing pages to record",
                "They expire every 30 seconds like a code",
              ],
              answer: 1,
              explain:
                "Phishing works by stealing something you type and replaying it somewhere else. A passkey never hands over a reusable secret, so there's nothing to replay.",
            },
          ],
        },
        {
          id: "sec-2fa",
          title: "Something You Have",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "A password is one lock on your front door. Multi-factor authentication (MFA) — you'll also hear two-factor, or 2FA — is the second lock, of a completely different kind. Even if someone copies your key, they still can't get in without the thing in your pocket.",
            },
            { type: "h", text: "The three families of proof" },
            {
              type: "list",
              items: [
                "Something you know — a password, a PIN, a pattern",
                "Something you have — your phone, a security key, a code generator",
                "Something you are — your fingerprint, your face",
              ],
            },
            {
              type: "p",
              text: "MFA's whole power comes from mixing families. A password plus a code from your phone works because stealing one still isn't enough. Two passwords, on the other hand, is just the same lock twice — that's not MFA, that's paperwork.",
            },
            { type: "h", text: "Why text messages are the weakest link" },
            {
              type: "p",
              text: "SMS codes feel safe, but they travel to your phone number — and your phone number is surprisingly stealable. In a SIM swap, the attacker convinces your phone company to move your number to their SIM card, sometimes with a phony emergency story, sometimes with personal details scraped from leaks. Suddenly your codes arrive on their phone. An authenticator app or a hardware security key is stronger, because the secret lives on the device itself and never travels over the phone network.",
            },
            { type: "h", text: "Don't lock yourself out" },
            {
              type: "p",
              text: "When you turn on MFA, most services hand you recovery codes — one-time passwords for the day you lose your phone. Print them or write them down and store them somewhere genuinely safe, with your important documents. If you skip this step and lose your device, you can be locked out of your own accounts forever. Yes, forever.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Your recovery email is a backdoor. If your email can reset your bank login, then whoever owns your email effectively owns your bank. Protect the recovery account exactly as hard as the main one.",
            },
          ],
          quiz: [
            {
              q: "Which of these counts as 'something you have'?",
              options: ["Your password", "Your first pet's name", "A hardware security key", "Your fingerprint"],
              answer: 2,
              explain:
                "A security key is an object you physically possess. A password is something you know, and your fingerprint is something you are — mixing those families is the whole trick.",
            },
            {
              q: "Why is SMS the weakest choice for your second factor?",
              options: [
                "Text messages arrive too slowly",
                "Your phone number can be hijacked with a SIM swap, taking your codes with it",
                "SMS codes are always only four digits",
                "Phone companies refuse to send MFA texts",
              ],
              answer: 1,
              explain:
                "The code itself is fine — the delivery route isn't. A SIM swap moves your number to an attacker's phone, and the codes follow it. Apps and hardware keys keep the secret on your device instead.",
            },
            {
              q: "What are recovery codes for?",
              options: [
                "Letting you log in when you lose your second-factor device",
                "Giving attackers a backup way in",
                "Sharing one account with your family",
                "Resetting other people's passwords",
              ],
              answer: 0,
              explain:
                "No phone means no codes. Recovery codes are your spare key under the flowerpot — which is exactly why they belong somewhere safe and offline.",
            },
          ],
        },
        {
          id: "sec-boss-takeover",
          title: "Boss: The Account Takeover",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Your phone buzzes with a sign-in alert from your email — from a device, in a country, that isn't you. Someone is inside your email right now, and they are not reading newsletters. Every minute they stay, they can reset your other passwords, delete the evidence, and lock you out of your own digital life. Six decisions stand between them and total control. Make them fast, and make them right.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Account Takeover",
            intro:
              "An intruder is inside your email and moving fast. Evict them before they take the whole house.",
            art: `      ___
     /   \\
    |     |
   _|     |_
  |   ___   |
  |  |x_x|  |
  |  |___|  |
  |   OWNED  |
  |__________|`,
            stages: [
              {
                question: "First, the diagnosis. How did they most likely get in?",
                options: [
                  "They brute-forced your 20-character random password, one guess at a time",
                  "You reused a password somewhere else, it leaked in a breach, and they replayed it on your email",
                  "They physically hacked the email provider's data center",
                  "They guessed it from your vacation photos",
                ],
                answer: 1,
                explain:
                  "Reused, breached passwords are the most common way accounts fall — attackers replay known leaked passwords everywhere, and it works because humans reuse. A truly random 20-character password does not fall to guessing.",
              },
              {
                question: "You're still logged in on your phone. What's the very first move?",
                options: [
                  "Read your sent folder and check where the attacker logged in from — intel first",
                  "Set up a new profile photo to assert dominance",
                  "Email the attacker and ask what they want",
                  "Change your password immediately — evict first, investigate after",
                ],
                answer: 3,
                explain:
                  "While you investigate, they're busy resetting your bank password. Changing your password kills their session and locks the door in one move — everything else can wait ninety seconds.",
              },
              {
                question: "You're turning on MFA to slam this door for good. Which second factor is strongest?",
                options: [
                  "Codes sent by SMS",
                  "A code emailed to your backup address",
                  "A hardware security key that lives on your keyring",
                  "Security questions about your childhood",
                ],
                answer: 2,
                explain:
                  "Hardware keys can't be phished, SIM-swapped, or guessed. SMS is the weakest (SIM swap), email codes inherit your email's risks, and security questions are just slow passwords.",
              },
              {
                question: "Why did they want your EMAIL specifically? Of all your accounts, why is this the prize?",
                options: [
                  "Your email is the reset key to everything else — control it, and you can take over nearly every account tied to it",
                  "Email accounts pay out a fixed bounty when hacked",
                  "Your inbox is full of valuable attachments, by weight",
                  "Attackers primarily want to read your newsletter subscriptions",
                ],
                answer: 0,
                explain:
                  "Password reset links land in your inbox. Whoever owns your email effectively owns the recovery path to your bank, your socials, and everything else tied to that address.",
              },
              {
                question: "They're not finished: now they call your phone company, pretend to be you, and try to move your number to their SIM. What actually blunts a SIM swap?",
                options: [
                  "Using SMS codes but watching them more closely",
                  "Using an authenticator app or hardware key, so your codes don't depend on your phone number",
                  "Answering every unknown call to screen for impostors",
                  "Keeping your phone charged above 50 percent",
                ],
                answer: 1,
                explain:
                  "If your codes come from an app or a hardware key, moving your number gets the attacker nothing. Many carriers also let you set a PIN required for number changes — worth doing as a second layer.",
              },
              {
                question: "Eviction complete. The service shows you recovery codes as you finish setting up MFA. What do you do with them?",
                options: [
                  "Screenshot them and store the image in the cloud",
                  "Email them to yourself so they're always findable",
                  "Print them and store them somewhere physically safe — and harden your recovery email too",
                  "Ignore them — you'll never lose a device",
                ],
                answer: 2,
                explain:
                  "Cloud screenshots and email copies just hand a spare key to the next breach. Paper in a safe place survives dead phones — and a hardened recovery email closes the backdoor for good.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "attacks-defenses",
      title: "Attacks & Defenses",
      blurb: "Know the plays before they're run against you.",
      lessons: [
        {
          id: "sec-phishing",
          title: "Phishing & Social Engineering",
          minutes: 6,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "The most successful attacks in history didn't hack computers. They hacked people. Social engineering is the art of manipulating a human into handing over the keys — and its most famous form, phishing, arrives in your inbox dressed as something you trust.",
            },
            { type: "h", text: "The con, upgraded for the internet" },
            {
              type: "p",
              text: "The playbook is ancient: pretend to be someone trustworthy, create pressure, ask for the thing. Email is the classic channel — that's phishing — but the same con runs over text messages (smishing), phone calls (vishing), and QR codes stuck where you'll scan them. Different doors, same burglar.",
            },
            {
              type: "list",
              items: [
                "Urgency — act within 24 hours or lose access",
                "Fear — unusual activity detected on your account",
                "Authority — this is your boss, your bank, your government",
                "Reward — you've won, claim it now",
              ],
            },
            { type: "h", text: "The AI era sharpens the hook" },
            {
              type: "p",
              text: "It gets worse, and you deserve the honest version. AI can clone a voice from a short audio sample — and samples of your voice are everywhere, from voicemail greetings to video calls. It can produce thousands of personalized, flawlessly written lures — the old tell of broken grammar is dead. Deepfake video calls are an emerging pattern too. The bar for looking legit has never been higher.",
            },
            {
              type: "table",
              headers: ["Sign", "What it looks like", "Why it works"],
              rows: [
                ["Urgency", "'Verify now or your account closes'", "Panic switches off careful thinking"],
                ["Wrong sender", "The name says your bank, the address says otherwise", "You read the friendly name, not the fine print"],
                ["Unexpected file", "An invoice or voicemail you never asked about", "Curiosity clicks before caution loads"],
                ["Secrecy", "'Please don't tell anyone about this'", "Isolation stops you from verifying"],
                ["Credential ask", "'Confirm your password to continue'", "Once shared, a password can't be un-shared"],
              ],
            },
            {
              type: "p",
              text: "The one defense that works on every channel: verify out-of-band. That means reaching the person or company through a channel you already trust — call the number on the back of your card, open the official app yourself, message your boss the way you normally would. Never use the contact details handed to you inside the suspicious message, because those belong to the con artist. And before clicking any link, hover over it and read the real address: the brand name can be a costume — the true owner is the domain just before the first single slash.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "Treat urgency itself as the red flag. Any message engineered to make you act before you think was designed that way on purpose — slow down and verify through a channel you chose.",
            },
          ],
          quiz: [
            {
              q: "Phishing attacks primarily hack...",
              options: [
                "Firewalls and routers",
                "The person — their fear, their hurry, their trust",
                "Email servers directly",
                "Graphics cards",
              ],
              answer: 1,
              explain:
                "No exploit needed — just a story that makes you click, type, or pay. The machine is fine; the moment is rigged.",
            },
            {
              q: "To 'verify out-of-band' means...",
              options: [
                "Reply to the message and ask if it's legitimate",
                "Double-check the sender's profile picture",
                "Contact the person or company through a channel you already trust, like the number on your card",
                "Forward the message to a friend for a second opinion",
              ],
              answer: 2,
              explain:
                "The contact info inside a suspicious message belongs to the con artist. Verification only counts when you pick the channel yourself.",
            },
            {
              q: "Why does AI raise the phishing stakes?",
              options: [
                "AI can send email without an internet connection",
                "Spam filters can't read AI-generated text",
                "AI emails carry more viruses per attachment",
                "Lures can now be flawless, personalized, and voice-cloned at massive scale",
              ],
              answer: 3,
              explain:
                "The old tells — weird grammar, generic greetings — are gone. Scale and polish both went up, so your verification habits matter more than your eye for typos.",
            },
          ],
        },
        {
          id: "sec-malware",
          title: "The Malware Zoo",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Malware is the umbrella term for all software written with bad intentions — and it comes in species, each with its own hunting style. Learn to recognize the animals, and their defenses start writing themselves.",
            },
            { type: "h", text: "Field guide to the species" },
            {
              type: "list",
              items: [
                "Virus — hitches a ride on a host file; spreads when you run it",
                "Worm — needs no host; crawls across networks by itself",
                "Trojan — disguises itself as something you wanted; opens the door from inside",
                "Ransomware — encrypts your files, then demands payment for the key",
                "Spyware — hides and watches; records what you type and do",
              ],
            },
            {
              type: "p",
              text: "How do they get in? Rarely through magic. The delivery routes are stubbornly mundane: email attachments, downloads from shady corners of the internet, infected ads on otherwise normal sites (malvertising), and pop-ups claiming your software is out of date. Notice the pattern — nearly every route needs you to click, open, or install something.",
            },
            { type: "h", text: "The defenses that actually matter" },
            {
              type: "list",
              items: [
                "Updates — patch the doors before anyone walks through them",
                "Least privilege — give every program, app, and person only the access it needs",
                "Backups — copy what matters, and keep one copy offline",
                "Official sources — download from the real site, not the ad beside it",
              ],
            },
            {
              type: "p",
              text: "Least privilege deserves a plain explanation, because it's the quiet hero. Running your day as a normal user — not an administrator, not with every permission granted — means malware that lands on your machine can only trash the guest room, not the whole house. The same idea applies to apps: a flashlight that demands access to your contacts is asking for more house than it needs.",
            },
            {
              type: "p",
              text: "And backups are ransomware's natural enemy. Its entire business model is pay or lose everything. A recent backup the attackers can't reach turns that threat into no thanks, I have copies — and takes all of its power away in one sentence.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "The most dangerous downloads are the ones that find you. A pop-up insisting your browser is out of date, an ad for the exact software you were just shopping for — urgency plus convenience is the trojan's favorite outfit.",
            },
          ],
          quiz: [
            {
              q: "Which malware species spreads with no host program at all?",
              options: ["Virus", "Trojan", "Worm", "Spyware"],
              answer: 2,
              explain:
                "Worms self-replicate across networks on their own. Viruses need you to run the infected host, and trojans need you to want them.",
            },
            {
              q: "Which defense most directly removes ransomware's leverage?",
              options: [
                "A faster processor",
                "Regular backups, with one copy kept offline",
                "Renaming your files to look boring",
                "A longer email password",
              ],
              answer: 1,
              explain:
                "Ransomware sells you back what only it holds. A backup it can't reach means it holds nothing — the ransom note loses all its power.",
            },
            {
              q: "A trojan gets installed because...",
              options: [
                "It's disguised as something you actually wanted — a game, an update, an invoice",
                "It physically breaks through your firewall",
                "It arrives only through email servers",
                "It infects machines that are powered off",
              ],
              answer: 0,
              explain:
                "The costume is the whole trick. A trojan forces no door — it waits for you to open one and carry it inside yourself.",
            },
          ],
        },
        {
          id: "sec-network-attacks",
          title: "Evil WiFi & Snooping",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Cafe WiFi: free, convenient, and operated by nobody you've ever met. Before you type anything interesting, it's worth knowing exactly what that network can and can't see. No paranoia required — just plumbing.",
            },
            { type: "h", text: "What 'open' really means" },
            {
              type: "p",
              text: "An open network is one with no password — which means no encryption between your device and the router. Your traffic passes through equipment you don't control, alongside strangers you can't see. Most of those strangers are just checking email. A few are running tools that watch what flies past, or hosting rogue hotspots with friendly names like Free Airport WiFi that look official and aren't.",
            },
            {
              type: "p",
              text: "The sneakier version is a man-in-the-middle attack: the attacker quietly relays your traffic, standing between you and the site you think you're talking to. You see a normal-looking login page; they see — and possibly keep — everything you send through it.",
            },
            { type: "h", text: "Your armor is HTTPS" },
            {
              type: "p",
              text: "Here's the genuinely reassuring part. HTTPS — the padlock in your address bar — encrypts the content of your traffic end to end. On hostile WiFi, a snoop sees that you connected to a site and how much you sent, but not the passwords, messages, or card numbers inside. One honest limit: HTTPS protects content, not the addresses of the sites you visit — the network operator can still see which sites you talk to.",
            },
            { type: "h", text: "What a VPN is actually for" },
            {
              type: "p",
              text: "A VPN tunnels your traffic to an exit point somewhere else. What changes is who can see what: the cafe network now sees only an encrypted tunnel to your VPN provider, while the VPN provider — instead of the cafe — sees where you go next. That's a real shift, and sometimes a useful one. What a VPN does not do is make you anonymous or trustworthy: you've moved trust from the coffee shop to a company, not eliminated it. Choose reputable providers, and skip the magic-bullet marketing.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "The padlock is your seatbelt on open WiFi. If a site doesn't use HTTPS, don't type anything into it — and for the sensitive stuff, your phone's cellular connection is usually a safer bet than a network you borrowed.",
            },
          ],
          quiz: [
            {
              q: "On open WiFi, what does HTTPS actually protect?",
              options: [
                "Which sites you visit",
                "The content of what you send and receive — but not which sites you visit",
                "Your battery life",
                "Nothing at all",
              ],
              answer: 1,
              explain:
                "HTTPS encrypts the contents of the tunnel. The network can still see the addresses of the sites you contact — the envelope, not the letter.",
            },
            {
              q: "A rogue hotspot works by...",
              options: [
                "Broadcasting a legitimate-looking network name so your device happily connects to it",
                "Physically relocating your laptop",
                "Overheating your battery",
                "Hiding the padlock icon in your browser",
              ],
              answer: 0,
              explain:
                "Your device trusts any network with a matching name. The evil twin answers first and becomes the router you never meant to use.",
            },
            {
              q: "What does a VPN actually change about who sees your traffic?",
              options: [
                "It makes you fully anonymous online",
                "It guarantees the websites you visit are safe",
                "It shifts visibility — the local network sees a tunnel, and the VPN provider sees the traffic instead",
                "It encrypts the websites themselves",
              ],
              answer: 2,
              explain:
                "A VPN moves trust from the network you're on to the provider you chose. That's a real benefit on hostile WiFi — and a reason to choose the provider with care.",
            },
          ],
        },
        {
          id: "sec-web-bugs",
          title: "When Websites Have Bugs",
          minutes: 6,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Sometimes the villain isn't a person at all — it's a mistake. Software is written by humans under deadlines, and bugs are the typos that slip through. Most bugs just crash things. The dangerous ones open doors, and attackers make a full-time job of finding them.",
            },
            { type: "h", text: "Injection: a form that talks to the database too well" },
            {
              type: "p",
              text: "Many sites have forms — login boxes, search bars, comment fields — wired straight to a database. SQL injection is what happens when your input gets stitched directly into the database's instructions instead of being treated as mere data. Imagine handing a bank teller a note that ends with and empty the vault into this bag — and the teller reads it as an order from head office. A crafted input can end one command and start another, and suddenly the form is giving orders.",
            },
            {
              type: "code",
              caption: "Two habits that close the injection door",
              code: `// 1) Validate input: reject anything that isn't the shape you expect
function validUsername(name) {
  // letters, digits, underscore; 3 to 20 characters, nothing else
  return /^[A-Za-z0-9_]{3,20}$/.test(name);
}

// 2) Parameterized queries: input travels as DATA, never as code
//    The database fills in the ? — it can't reinterpret it as a command
db.query("SELECT * FROM users WHERE name = ?", [name]);`,
            },
            { type: "h", text: "XSS: a script wearing the site's uniform" },
            {
              type: "p",
              text: "Cross-site scripting (XSS) is the mirror image. Instead of your input attacking the database, it attacks other visitors: the attacker plants their script on a page you trust — through a comment, a profile field, a message — and your browser runs it because it came from a site you trust. From inside, that script can act as you on that site: click buttons, send messages, quietly walk out with whatever it finds.",
            },
            {
              type: "p",
              text: "The fixes rhyme: validate and sanitize input, escape output so data can never masquerade as code, and use parameterized queries for everything that touches a database. The shared principle fits in one sentence: treat all user input as hostile until proven otherwise — including, technically, yours.",
            },
            { type: "h", text: "When researchers find the doors first" },
            {
              type: "p",
              text: "Most bugs are actually found by good-faith security researchers, and the system that keeps their findings from fueling crime is responsible disclosure: report privately, give the company time to patch, then go public. Your part in that machine is beautifully simple — when a patch lands for software you use, install it quickly. A patch is the fix arriving at your door, and it only protects you once it's running.",
            },
          ],
          quiz: [
            {
              q: "SQL injection happens when...",
              options: [
                "A database gets too old to function",
                "User input gets stitched into database commands and becomes part of the code",
                "Too many users visit the site at once",
                "Passwords contain special characters",
              ],
              answer: 1,
              explain:
                "The form trusts its visitors too much. Input becomes instructions, and the visitor starts giving orders to the database.",
            },
            {
              q: "XSS is dangerous because...",
              options: [
                "It crashes the browser tab",
                "It changes the site's colors to confuse you",
                "The attacker's script runs on a page you already trust — and can act as you while it's there",
                "It only infects phones",
              ],
              answer: 2,
              explain:
                "The page is the disguise. Your browser trusts the site, so it trusts the script the attacker planted on it.",
            },
            {
              q: "A patch ships for a serious bug in software you use. Your move?",
              options: [
                "Wait a month to be sure it's stable",
                "Update quickly — the fix only protects you once it's installed",
                "Uninstall the software entirely",
                "Read the changelog, then decide to never update",
              ],
              answer: 1,
              explain:
                "Once a bug is public, attackers race to exploit every unpatched copy they can find. Updating fast is how you win that race by not running in it.",
            },
          ],
        },
        {
          id: "sec-zero-trust",
          title: "Zero Trust",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "For decades, security worked like a castle: a thick wall around the network, and total trust for anyone inside it. Then laptops left the office, phones joined the network, and attackers started walking in through phished logins instead of the gate. The castle model died of modern life. Its replacement has a blunt name: zero trust.",
            },
            { type: "h", text: "Never trust, always verify" },
            {
              type: "p",
              text: "The idea fits in one sentence: every request must prove itself, no matter where it comes from — inside the network, outside it, doesn't matter. Instead of one ID check at the castle gate, every door checks your badge. That would be exhausting for a medieval kingdom; for software, it's just how you build things now.",
            },
            {
              type: "list",
              items: [
                "Verify every request — even from 'inside'",
                "Least privilege — every user and device gets only the access it needs",
                "MFA everywhere — identity is proven, not assumed",
                "Assume breach — design as if an attacker is already in",
              ],
            },
            {
              type: "p",
              text: "Least privilege is the load-bearing wall of the whole idea. Every person, program, and device gets exactly the access it needs to do its job — and nothing more. A key that opens one door, not the whole building. When something goes wrong, the blast radius is one room.",
            },
            { type: "h", text: "Zero trust for your life" },
            {
              type: "p",
              text: "You can run the same operating system in your head. Treat every device, network, and message as unproven until verified. A new device wants to join your WiFi? Make it prove what it is. A message from a colleague asks for something unusual? Verify through a channel you trust. That's not paranoia — that's consistency, and consistency is the entire trick.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Zero trust is how modern companies architect their security — the phrase shows up in most security job postings. The same logic, scaled down to one person with a laptop and a phone, protects your digital life just as well.",
            },
          ],
          quiz: [
            {
              q: "Why did the old 'castle and moat' model fail?",
              options: [
                "Firewalls were outlawed",
                "The network edge dissolved — devices and users are everywhere, so 'inside' no longer means 'safe'",
                "Passwords got too long to type",
                "Companies stopped caring about security",
              ],
              answer: 1,
              explain:
                "Laptops, phones, and cloud services spread the network past any wall. Trusting 'inside' stopped making sense the moment there stopped being an inside.",
            },
            {
              q: "Zero trust in one sentence:",
              options: [
                "Trust nobody until they prove it — every request, every time",
                "Trust everyone who is inside the building",
                "Trust only people with important job titles",
                "Trust, but don't verify",
              ],
              answer: 0,
              explain:
                "Verification isn't a checkpoint at the border; it's a condition of every single request, forever. That discipline is the point.",
            },
          ],
        },
        {
          id: "sec-boss-ransom",
          title: "Boss: Ransomware Rampage",
          minutes: 5,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "It started as a normal Tuesday. Then files began renaming themselves with extensions nobody recognized, printers spat out the same strange note, and every screen in the office lit up with a countdown. Something is encrypting everything it can reach, and it wants payment. Your next few moves decide whether this is a bad week or a company-ending event.",
            },
          ],
          quiz: [],
          boss: {
            name: "Ransomware Rampage",
            intro:
              "Files are encrypting themselves across the office. Respond correctly — or lose everything.",
            art: `+--------------------------------+
|  !!! YOUR FILES ARE ENCRYPTED  |
|                                |
|  documents .......... .locked  |
|  photos ............. .locked  |
|  spreadsheets ........ .locked  |
|                                |
|  pay within 24:00 to decrypt   |
+--------------------------------+`,
            stages: [
              {
                question: "First, the diagnosis: how did ransomware most likely get in?",
                options: [
                  "It materialized from a corrupted hard drive",
                  "Someone ran a file disguised as a software update or invoice — and carried it inside",
                  "The office WiFi was running too fast that morning",
                  "It spread from the coffee machine's firmware",
                ],
                answer: 1,
                explain:
                  "Ransomware usually rides in as a trojan: a poisoned attachment, a fake update, a download from the wrong source. Someone clicked something that looked legitimate — that's not carelessness, that's the design.",
              },
              {
                question: "It's spreading machine to machine. What's the very first action?",
                options: [
                  "Isolate — disconnect infected machines from the network so the spread stops",
                  "Pay the ransom before the countdown hits zero",
                  "Delete the encrypted files to show strength",
                  "Open one encrypted file to confirm it's really locked",
                ],
                answer: 0,
                explain:
                  "Every connected machine is another room for the fire to reach. Pulling infected systems off the network stops the spread — payment, deletion, and curiosity can all wait.",
              },
              {
                question: "The note taunts you about your backups. What does the 3-2-1 rule say?",
                options: [
                  "Three passwords, two locks, one key",
                  "Three backups per day, two per week, one per month",
                  "Three copies of your data, on two different types of media, with one kept offline or offsite",
                  "Three copies, two of them encrypted, one on the same server",
                ],
                answer: 2,
                explain:
                  "Three copies protects against any single failure, two media types protects against one kind of disaster, and one offline copy is the copy ransomware can't reach — which is the entire point.",
              },
              {
                question: "The countdown ticks. The note promises the key on payment. What's the sound general guidance?",
                options: [
                  "Always pay immediately — downtime costs more than the ransom",
                  "Negotiate hard, then pay",
                  "Pay in gift cards to stay anonymous",
                  "Paying funds the next attack and doesn't guarantee recovery — restoring from backups is the better path when you have them",
                ],
                answer: 3,
                explain:
                  "There's no honor among extortionists: paying marks you as a payer, funds the next campaign, and the decryptor they send may not even work. Security guidance trends firmly against paying — backups beat ransoms.",
              },
              {
                question: "How do updates and least privilege blunt an attack like this?",
                options: [
                  "They lower the ransom price",
                  "Updates close the known holes it exploits, and least privilege walls off how far it can spread once inside",
                  "They make your files unappetizing to malware",
                  "They encrypt your files first, so there's nothing left to steal",
                ],
                answer: 1,
                explain:
                  "Patched software removes the front door, and a restricted environment turns all your files into a few of one user's files. Ransomware needs reach to make threats.",
              },
              {
                question: "It's contained. What's the correct recovery order?",
                options: [
                  "Clean the systems first, then restore from backups, then investigate how it got in",
                  "Restore everything immediately — reinfection is a myth",
                  "Investigate for a week first, while everything stays offline",
                  "Pay, restore, clean, forget",
                ],
                answer: 0,
                explain:
                  "Restoring onto an infected machine hands the attacker fresh files to encrypt. Clean, then restore, then do the post-mortem so the same door doesn't let it walk back in.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "network-defense",
      title: "Everyday Network Defense",
      blurb: "Wi-Fi, routers, VPNs and patches — harden the networks your life runs on.",
      lessons: [
        {
          id: "sec-wifi",
          title: "Public Wi-Fi and Evil Twins",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "The café offers free Wi-Fi and you accept, because everyone does. Here is what that trade really means: an open network is a public park for radio waves. Anyone within a few hundred meters receives everything your phone transmits, and can send your phone anything they like. Using open Wi-Fi is not automatically a disaster — but only because of defenses you are about to understand.",
            },
            { type: "h", text: "The evil twin" },
            {
              type: "p",
              text: "The classic attack is not even a break-in. The attacker sets up their own hotspot named 'CoffeeShop_Free_WiFi' — or exactly the same name as the real one — with a strong signal. Your phone, remembering the name from last visit, joins automatically. Now every packet you send lands in the attacker's lap before it reaches the internet. It is called an evil twin, and it costs twenty dollars of hardware.",
            },
            {
              type: "list",
              items: [
                "What the twin sees without HTTPS: every plain-http site in full, your DNS lookups (a list of everywhere you go), and unencrypted app traffic.",
                "What HTTPS protects: the content and destination of each secure connection. The twin still sees roughly how much you transmit.",
                "What the twin can still try: a fake sign-in page (captive portal) to harvest credentials, and tricking you past a browser certificate warning.",
              ],
            },
            { type: "h", text: "Your defenses" },
            {
              type: "list",
              items: [
                "Prefer your phone's hotspot and mobile data — it is encrypted by design and cannot be impersonated by a stronger signal.",
                "Verify the exact network name with staff before joining; turn off auto-join for open networks.",
                "Treat any sign-in page asking for a password you care about as hostile until proven otherwise.",
                "Never click through a browser certificate warning on a network you do not control. That warning is the system working.",
              ],
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "The single habit that erases most of this chapter: before typing anything sensitive on any network, glance at the address bar. https, correct domain spelling, no warning. That two-second check defeats the evil twin's best moves.",
            },
            {
              type: "p",
              text: "Your turn to build the checker. The exercise implements the checklist this lesson just taught: a connection is trustworthy only when all three signals agree.",
            },
          ],
          quiz: [
            {
              q: "What is an evil twin access point?",
              options: [
                "A router that duplicates your home network",
                "An attacker's hotspot mimicking a legitimate network name to capture your traffic",
                "A second antenna on the real router",
                "A Bluetooth device paired twice",
              ],
              answer: 1,
              explain:
                "It impersonates the real network — often with a stronger signal — so your device hands it your traffic willingly. No password cracking required.",
            },
            {
              q: "On an open network, which of these does HTTPS still protect?",
              options: [
                "The full content of unencrypted http sites",
                "Your DNS lookups",
                "The content and destination of your secure connections",
                "The names of all apps you use",
              ],
              answer: 2,
              explain:
                "HTTPS encrypts both the request and the hostname inside the connection. Plain-http pages, and which domains you resolve, remain visible to the network.",
            },
            {
              q: "Your browser shows a certificate warning on hotel Wi-Fi. The correct move is...",
              options: [
                "click through — hotels always have broken certificates",
                "click through, but avoid typing passwords",
                "stop: a certificate warning on untrusted Wi-Fi may mean an attacker is intercepting the connection",
                "switch to a private browser window and continue",
              ],
              answer: 2,
              explain:
                "That warning is often the only visible sign of a man-in-the-middle. On a network you do not control, it means the connection cannot be trusted — do not proceed.",
            },
          ],
          exercise: {
            prompt: [
              "Implement the padlock checklist from this lesson as code.",
              "isConnectionSecure(connection) takes an object with url, certificateValid and domainMatch. Return true only when ALL three checks pass: the url starts with https://, the certificate is valid, and the domain matches the certificate.",
              "Fail any single check and the answer is false — a chain is only as strong as its weakest link.",
            ],
            starter: `function isConnectionSecure(connection) {
  // connection.url, connection.certificateValid,
  // connection.domainMatch — all three must
  // pass before you return true.
  // your code here
}`,
            tests: [
              {
                name: "all three checks pass",
                code:
                  "return isConnectionSecure({ url: 'https://example.com', certificateValid: true, domainMatch: true }) === true;",
              },
              {
                name: "plain http fails",
                code:
                  "return isConnectionSecure({ url: 'http://example.com', certificateValid: true, domainMatch: true }) === false;",
              },
              {
                name: "invalid certificate fails",
                code:
                  "return isConnectionSecure({ url: 'https://example.com', certificateValid: false, domainMatch: true }) === false;",
              },
              {
                name: "domain mismatch fails",
                code:
                  "return isConnectionSecure({ url: 'https://evil-copy.com', certificateValid: true, domainMatch: false }) === false;",
              },
            ],
            solution: `function isConnectionSecure(connection) {
  if (!connection.url.startsWith("https://")) return false;
  if (!connection.certificateValid) return false;
  if (!connection.domainMatch) return false;
  return true;
}`,
            hints: [
              "connection.url.startsWith('https://') checks the scheme — note the two slashes.",
              "Check each of the three fields in turn, returning false the moment one fails.",
              "Only when every check passes do you return true.",
            ],
          },
        },
        {
          id: "sec-vpn",
          title: "What a VPN Does — and What It Doesn't",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every tech influencer sells one, every tech podcast runs ads for one, and almost nobody explains what the thing actually does. Let's fix that. A VPN — virtual private network — builds an encrypted tunnel from your device to some other network. Your traffic enters the tunnel near you and exits near the VPN company's servers.",
            },
            { type: "h", text: "What it genuinely does" },
            {
              type: "list",
              items: [
                "Hides your traffic from the local network — the café twin and a nosy home router see only an encrypted tunnel to one address.",
                "Hides your IP address from the sites you visit — they see the VPN company's address instead.",
                "Lets you reach a private network from outside — the original use: employees reaching office systems from home.",
              ],
            },
            { type: "h", text: "What it absolutely does not do" },
            {
              type: "list",
              items: [
                "Make you anonymous. You log into services, carry cookies, and get fingerprinted by your browser regardless of IP.",
                "Stop malware or phishing. The tunnel carries malicious downloads as faithfully as any other traffic.",
                "Protect data you hand over voluntarily. A VPN cannot encrypt what you type into a website's own forms and upload yourself.",
                "Fix a site with bad security. If the site leaks its database, no tunnel on your end helps.",
              ],
            },
            {
              type: "p",
              text: "Notice the deeper pattern: a VPN MOVES trust, it does not create it. Your ISP and the café network stop seeing your traffic — and the VPN company starts seeing it instead. You have traded 'trust my internet provider' for 'trust this company with a marketing budget'. Sometimes that is a good trade. But it is a trade, not a magic cloak, and a free VPN is a company whose business model you should think about very carefully.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "The most common data leak of the decade is not the network — it is the user. Every prompt pasted into a chatbot, every document uploaded to a free AI tool, leaves through the front door with your blessing. No VPN touches that. The tunnel protects the road, not the choices you make at the destination.",
            },
          ],
          quiz: [
            {
              q: "With a VPN active, what does the café's Wi-Fi network see about your browsing?",
              options: [
                "Every site you visit, in full",
                "Only an encrypted tunnel to the VPN server — not your traffic's contents or destinations",
                "Your passwords, because the VPN shares them",
                "Nothing at all; the VPN makes you invisible",
              ],
              answer: 1,
              explain:
                "The tunnel starts at your device. The local network sees encrypted blobs to one address, which is the VPN's real, honest value.",
            },
            {
              q: "The VPN company's servers are now in a position to...",
              options: [
                "see nothing, by mathematical law",
                "see the traffic your ISP used to see — trust has moved to them",
                "control your home router",
                "read your passwords out of your password manager",
              ],
              answer: 1,
              explain:
                "A VPN relocates trust rather than eliminating it. The provider can observe your traffic metadata and destinations the way the ISP did before. Choose providers accordingly.",
            },
            {
              q: "Which of these does a VPN NOT protect you from?",
              options: [
                "A snooper on the café network reading your traffic",
                "Your IP address being visible to websites",
                "Phishing emails and the passwords you type into a fake site",
                "An employer-style private network being unreachable from home",
              ],
              answer: 2,
              explain:
                "The tunnel guards the road, not the destination or your decisions. Phishing and voluntarily-uploaded data sail straight through any VPN.",
            },
          ],
        },
        {
          id: "sec-router",
          title: "Fortress Router",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Your home router is the most important computer you never think about. Every packet from every device you own — phones, laptops, TVs, cameras, that smart speaker in the kitchen — passes through it. Whoever controls the router controls the house: they can watch traffic, redirect it, plant themselves silently in the middle of everything.",
            },
            { type: "h", text: "The default-password graveyard" },
            {
              type: "p",
              text: "In 2016, a piece of malware called Mirai scanned the internet for routers, cameras and recorders still wearing their factory logins — admin/admin and friends. It found hundreds of thousands of them, and the resulting botnet knocked major chunks of the internet offline, including Twitter and Netflix, by overwhelming a company that runs the internet's address book. The entire attack ran on equipment whose owners never changed a default password.",
            },
            { type: "h", text: "The hardening checklist" },
            {
              type: "list",
              items: [
                "Change the admin password — the one for the router's settings page. It is NOT the same as your Wi-Fi password, and it is the one that matters most.",
                "Use WPA3 if available, WPA2 otherwise, with a long passphrase. Never WEP, never 'open'.",
                "Turn on automatic firmware updates, or check monthly. Router patches close holes exactly like phone patches do.",
                "Put smart-home gadgets and guest devices on the guest network, away from your computers.",
                "Disable WPS — the push-button pairing feature — if you do not use it. It has a history of weak implementations.",
              ],
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Two passwords guard a router: the Wi-Fi password lets devices onto the network, and the admin password opens the router's brain. People change the first and forget the second. Attackers prefer the second. Log into the settings page once, change it to something long and unique, store it in your password manager, and never think about it again.",
            },
            {
              type: "p",
              text: "One afternoon of this — admin password, WPA3, updates, guest network — and your home network is harder than 95 percent of the networks on earth. It is the best security-per-minute you will ever spend.",
            },
          ],
          quiz: [
            {
              q: "How did the Mirai botnet take over hundreds of thousands of devices in 2016?",
              options: [
                "It broke modern encryption",
                "It logged in with factory default passwords that owners never changed",
                "It needed physical access to each device",
                "It exploited every router equally, patched or not",
              ],
              answer: 1,
              explain:
                "Mirai simply tried admin/admin-style credentials against internet-exposed devices. Unchanged defaults turned a planet of gadgets into an attack army.",
            },
            {
              q: "What is the difference between your router's Wi-Fi password and its admin password?",
              options: [
                "Nothing — they are the same password",
                "The Wi-Fi password lets devices join the network; the admin password opens the router's own settings",
                "The admin password is only for the internet company",
                "The Wi-Fi password controls the firmware updates",
              ],
              answer: 1,
              explain:
                "Joining the network and commanding the router are different powers. The admin password is the master key — it must be unique and strong.",
            },
            {
              q: "Why put smart-home gadgets on the guest network?",
              options: [
                "Guest networks are faster",
                "It isolates cheap, poorly-updated devices away from your computers, so a hacked camera cannot easily reach them",
                "Smart devices cannot see passwords on the main network",
                "It doubles your internet speed",
              ],
              answer: 1,
              explain:
                "IoT devices are the weakest residents of any home — rarely patched, often shoddily secured. Segmentation means their compromise does not become your laptop's compromise.",
            },
          ],
        },
        {
          id: "sec-hygiene",
          title: "The Update Pipeline",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every patch you are offered closes a hole that attackers already know about. That is the part people miss: by the time an update exists, the race is already running. Security researchers or attackers found the flaw; the vendor fixed it; the fix is public knowledge — which means everyone now knows the hole exists, including people who did not patch.",
            },
            {
              type: "p",
              text: "In 2017, a known vulnerability in a widely-used server component had a fix available for two months. Equifax never applied it. Attackers walked through the gap and took the personal data of about 147 million people. The breach did not require genius. It required one missing update.",
            },
            { type: "h", text: "Zero-days and the scan race" },
            {
              type: "p",
              text: "A zero-day is a hole with no patch available yet — the vendor has had zero days to fix it. You cannot fully defend against those as an individual. But the overwhelming majority of real-world attacks do not use zero-days. They use old, known, already-patched holes, because scanning the entire internet for unpatched victims is free and automated. Attackers do not need to pick your lock when half the street leaves doors open.",
            },
            { type: "h", text: "When the good guys are compromised" },
            {
              type: "p",
              text: "There is a darker level: supply chain attacks. In 2020, attackers slipped their code into a trusted software company's own update pipeline — and thousands of organizations installed the attackers' code through the very mechanism that existed to keep them safe. Updating remains essential; it is still the best odds you can buy. But it teaches the final lesson of this course: perfect security does not exist. There is only risk, reduced, by habit.",
            },
            {
              type: "list",
              items: [
                "Automatic updates ON for your operating system, browser and phone. This single setting defeats the majority of automated attacks.",
                "Restart when asked — many patches do not finish installing until you do.",
                "Replace devices that no longer receive updates. An unpatched device is a standing invitation.",
                "Patch internet-facing gear first — routers, servers, anything reachable from outside.",
              ],
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "The scan race has gone machine-speed. Automated systems find newly-vulnerable devices within minutes of a flaw becoming known, and AI tooling writes exploit attempts faster than ever. The defense is not heroic — it is defaults. Automatic updates mean your machines patch at machine speed too, while you sleep.",
            },
            {
              type: "p",
              text: "The exercise turns you into the patch scheduler: given a pile of vulnerabilities, decide what gets fixed first. Risk equals severity times exposure.",
            },
          ],
          quiz: [
            {
              q: "Why is skipping updates dangerous even if you 'do nothing risky'?",
              options: [
                "Updates slow the computer down",
                "Once a fix is published, the hole it closes is public knowledge, and scanning for unpatched systems is automated and free",
                "Old software loses features",
                "Attackers can only exploit patched systems",
              ],
              answer: 1,
              explain:
                "Unpatched software is a publicly documented open door, and bots sweep the internet for open doors continuously. Doing nothing risky yourself does not matter — the scanning comes to you.",
            },
            {
              q: "What is a zero-day?",
              options: [
                "A vulnerability with no patch available yet — the vendor has had zero days to fix it",
                "An update released on day zero",
                "A password reset link that expires",
                "A network scan that lasts one day",
              ],
              answer: 0,
              explain:
                "Zero-days are the holes nobody can have patched yet. Rare, expensive, and mostly irrelevant to individuals compared to the far more common unpatched known hole.",
            },
            {
              q: "What did the 2020 supply-chain attack demonstrate?",
              options: [
                "That updates are useless and should be avoided",
                "That even trusted update channels can carry attacker code — updating is still essential, but nothing is absolute",
                "That only governments get hacked",
                "That antivirus software catches everything",
              ],
              answer: 1,
              explain:
                "It poisoned the update pipeline itself. The lesson is calibrated paranoia: keep patching — it remains your best odds — while accepting that no habit buys perfection.",
            },
          ],
          exercise: {
            prompt: [
              "You are the patch scheduler. Vulnerabilities arrive as objects with id, severity (1 to 10) and exposed (true if reachable from the internet).",
              "patchPriority(list) must return the ids ordered: highest severity first, and when severity ties, internet-exposed ones before internal ones.",
              "Do not mutate the input list.",
            ],
            starter: `function patchPriority(vulnerabilities) {
  // Sort a COPY: severity descending,
  // ties broken by exposed (true) first.
  // Return just the ids.
  // your code here
}`,
            tests: [
              {
                name: "severity rules",
                code:
                  "return JSON.stringify(patchPriority([{ id: 'a', severity: 5, exposed: true }, { id: 'b', severity: 9, exposed: false }])) === JSON.stringify(['b', 'a']);",
              },
              {
                name: "ties go to exposed",
                code:
                  "return JSON.stringify(patchPriority([{ id: 'x', severity: 7, exposed: false }, { id: 'y', severity: 7, exposed: true }])) === JSON.stringify(['y', 'x']);",
              },
              {
                name: "input not mutated",
                code:
                  "const input = [{ id: 'a', severity: 5, exposed: true }, { id: 'b', severity: 9, exposed: false }]; patchPriority(input); return input[0].id === 'a';",
              },
              {
                name: "empty list is empty",
                code: "return JSON.stringify(patchPriority([])) === JSON.stringify([]);",
              },
            ],
            solution: `function patchPriority(vulnerabilities) {
  const copy = [...vulnerabilities];
  copy.sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    return (b.exposed ? 1 : 0) - (a.exposed ? 1 : 0);
  });
  return copy.map((v) => v.id);
}`,
            hints: [
              "Copy first — [...list] — so the sort does not touch the original. The test checks for this.",
              "sort's comparator returns a positive number when a should come AFTER b. For severity descending: b.severity - a.severity.",
              "For the tie-break, convert the boolean to a number: (b.exposed ? 1 : 0) - (a.exposed ? 1 : 0).",
            ],
          },
        },
        {
          id: "sec-boss-network",
          title: "The Router Wraith",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "The final gate of this chapter haunts the wiring of the building itself. The Router Wraith lives between the walls, in the access points and the firmware, and it has devoured whole households that left their defaults unchanged.",
            },
            {
              type: "p",
              text: "Combat as usual: multiple choice, every stage correct. The Wraith respects nothing except right answers.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Router Wraith",
            intro:
              "Lights flicker. Every screen in the room shows the same default password. The Wraith seeps from the ethernet port, antennae crowned in static. 'Your house has a front door,' it crackles. 'Show me you know how to hold it.'",
            art: `      ,-------------.
     |((  o   o  ))|
     |  \\  ___ /  |
     |   [=====]  |
      '-----------'
    _/  /|     |\\  \\_
   |__/ | ... | \\__|
    ====   =s=   ====
        [  WPA3  ]`,
            stages: [
              {
                question: "The Wraith broadcasts a perfect copy of the café's network name. 'What am I?'",
                options: [
                  "A DNS poisoning attack",
                  "An evil twin access point, waiting for your device to auto-join",
                  "A firmware update",
                  "A VPN",
                ],
                answer: 1,
                explain:
                  "Evil twins impersonate real networks — often with a stronger signal — and collect everything careless devices transmit to them.",
              },
              {
                question: "It shows you a login page on http://, with a certificate warning when you try https. 'Proceed?'",
                options: [
                  "Yes — certificate warnings are usually glitches",
                  "Yes, in a private window",
                  "No — on an untrusted network that warning may be the only sign of an interceptor",
                  "Yes, after disabling Wi-Fi",
                ],
                answer: 2,
                explain:
                  "Certificate failures on hostile networks are frequently man-in-the-middle attacks in progress. The warning is the defense working. Heed it.",
              },
              {
                question: "'My ads promised anonymity,' the Wraith grins. 'What does a VPN actually give you?'",
                options: [
                  "Anonymity from everything",
                  "An encrypted tunnel that hides traffic from the local network and your IP from sites — nothing more",
                  "Protection from phishing",
                  "Immunity to malware",
                ],
                answer: 1,
                explain:
                  "A VPN relocates trust from your ISP and local network to the VPN provider. It is a tunnel, not a cloak — phishing, malware and volunteered data pass straight through.",
              },
              {
                question: "The Wraith asks how it enslaved its army of gadgets in 2016. You answer:",
                options: [
                  "Quantum decryption",
                  "Factory default passwords that nobody changed",
                  "Phishing emails to each device",
                  "Stealing the routers physically",
                ],
                answer: 1,
                explain:
                  "Mirai scanned for default credentials and found them by the hundred thousand. The lesson: change the admin password on everything you own.",
              },
              {
                question: "Final stage. 'Ten vulnerabilities, one engineer, one afternoon. Patch in what order?'",
                options: [
                  "Alphabetical by id",
                  "Oldest systems first",
                  "Highest severity first, and among equals, the internet-exposed ones",
                  "Whichever is closest to the coffee machine",
                ],
                answer: 2,
                explain:
                  "Risk is severity times exposure. The internet-facing, most severe hole is the one bots are already scanning for — that is where the afternoon goes.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ai-era-privacy",
      title: "Privacy in the AI Era",
      blurb: "Your data is valuable. Act like it.",
      lessons: [
        {
          id: "sec-data-trail",
          title: "Your Data Trail",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You never kept a diary. But between your messages, your searches, your taps, and your travels, one is being written anyway — and it's being read. Privacy in the AI era starts with seeing the trail you're already leaving.",
            },
            { type: "h", text: "Metadata: the story around the story" },
            {
              type: "p",
              text: "Metadata is data about your data — not what you said, but who you talked to, when, from where, and for how long. It's the information on the outside of the envelope, not the letter inside. And it's routinely more revealing than the content: the pattern of who you call at 2 a.m. says more than any single call ever could.",
            },
            { type: "h", text: "Cookies and the trackers that follow" },
            {
              type: "p",
              text: "Cookies started innocently — a way for sites to remember your shopping cart. Cross-site trackers weaponized the idea: bits of code that follow you from site to site, noting what you read, what you hovered over, what you almost bought, what you worry about at 3 a.m. Alone, each crumb is boring. Together, they assemble a behavior profile — a remarkably detailed model of you.",
            },
            {
              type: "p",
              text: "Then there are data brokers: companies whose entire business is collecting those crumbs from many sources and stitching them into profiles that can be sold — demographics, interests, habits, inferences. Nothing about you was stolen; it was all shared willingly, one small piece at a time, to a hundred different services. The dossier exists anyway.",
            },
            { type: "h", text: "Tightening the trail" },
            {
              type: "list",
              items: [
                "Audit app permissions — revoke anything that isn't earned",
                "Prefer browsers and settings that block cross-site trackers",
                "Assume anything you share may be aggregated and resold",
                "Ask of every form: does this service actually need my birthday",
              ],
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "You can't delete the trail you've already left — but you can stop feeding it. Every permission revoked and tracker blocked makes the profile of you a little blurrier, and blurrier is harder to sell.",
            },
          ],
          quiz: [
            {
              q: "Metadata is best described as...",
              options: [
                "The actual content of your messages",
                "Data about your communications — who, when, from where, how long",
                "A file format for music players",
                "Encryption keys for your apps",
              ],
              answer: 1,
              explain:
                "It's the envelope, not the letter — and the patterns in who, when, and where often reveal more than any words do.",
            },
            {
              q: "Cross-site trackers mainly exist to...",
              options: [
                "Build behavior profiles that follow you across the web",
                "Make pages load faster",
                "Back up your photos",
                "Manage your passwords",
              ],
              answer: 0,
              explain:
                "Each site contributes one observation; the tracker stitches them into a running profile of what you read, want, and worry about.",
            },
            {
              q: "What's the most practical first step to tighten your data trail?",
              options: [
                "Never use the internet again",
                "Post more often to overwhelm the trackers",
                "Audit your app permissions and revoke whatever isn't needed",
                "Turn your phone off at night",
              ],
              answer: 2,
              explain:
                "Permissions are where the leaks get plumbed in. Does that game really need your contacts, camera, and location? Usually not — revoke, and enjoy the blur.",
            },
          ],
        },
        {
          id: "sec-breaches",
          title: "When the Breach Happens",
          minutes: 4,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "Somewhere out there, a list probably already includes one of your email addresses. That's not an accusation and it's not a catastrophe — it's the background weather of the internet. Big services get breached, and it usually has nothing to do with anything you did wrong. What matters is what you do in the hour after you find out.",
            },
            { type: "h", text: "What actually leaks" },
            {
              type: "list",
              items: [
                "Email addresses and usernames — near-universally",
                "Password hashes — scrambled fingerprints, stronger or weaker depending on the site",
                "Sometimes more: names, addresses, phone numbers, dates of birth",
                "Occasionally payment data — rarer, and heavily watched when it happens",
              ],
            },
            {
              type: "p",
              text: "About those hashes: a site doing it right never stores your actual password. It stores a one-way fingerprint — the password goes in, a scramble comes out, and the scramble can't be turned back into the password. The catch is that attackers can guess millions of candidate passwords, scramble each one, and look for matches. Common passwords fall to this instantly; long, unique ones mostly don't. Entropy, from lesson two, doing quiet work.",
            },
            { type: "h", text: "Has your email shown up?" },
            {
              type: "p",
              text: "There's a whole category of service — breach-notification tools — that collects the public fallout from known breaches and lets you check whether your email appears in any of them. Some can even alert you when a new breach includes your address. Think of it as a free early-warning radar, and worth having.",
            },
            { type: "h", text: "The post-breach drill" },
            {
              type: "list",
              items: [
                "Change that password everywhere you reused it — ideally, retire reuse entirely",
                "Turn on MFA for that account and for every account sharing its password",
                "Expect a wave of targeted phishing that references the breach and sounds very legitimate",
              ],
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "After a breach, phishing gets personal. Attackers know real details about you now — enough to build messages that sound legitimate. That's exactly when your verify-out-of-band habit earns its keep.",
            },
          ],
          quiz: [
            {
              q: "A well-run website stores your password as...",
              options: [
                "Plain text in a big list",
                "A hash — a one-way fingerprint it can check but not read back",
                "A Word document on a shared drive",
                "A compressed archive protected by a password",
              ],
              answer: 1,
              explain:
                "The site never needs to know your password — only whether what you typed matches. Hashing lets it check without ever holding the real thing.",
            },
            {
              q: "Your email appears in a new breach. What's the correct first move?",
              options: [
                "Close the account and start a new life",
                "Reply to the breach notification email for details",
                "Change that password everywhere it was reused, and switch those accounts to unique passwords with MFA",
                "Post about it on social media",
              ],
              answer: 2,
              explain:
                "The breach only becomes a takeover if that password still works somewhere else. Kill the reuse, add a second factor, and the leak stays just a leak.",
            },
            {
              q: "Why does phishing often spike right after a breach?",
              options: [
                "Attackers celebrate successful campaigns",
                "Leaked details let them craft personalized, convincing lures",
                "Email servers run slower and get confused",
                "Antivirus software needs time to catch up",
              ],
              answer: 1,
              explain:
                "Real names, real account details, real context — everything a con needs to sound legitimate. Personal details are phishing fuel.",
            },
          ],
        },
        {
          id: "sec-ai-privacy",
          title: "AI & Your Data",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "You type a question into a chatbot. It feels private — like talking to a very patient search bar. It isn't. That text just left your device, and it's worth thinking about where it went, who keeps it, and for how long.",
            },
            { type: "h", text: "Every prompt is data leaving your device" },
            {
              type: "p",
              text: "A prompt is a message to servers you don't control, run by companies with policies you've probably never read. What happens to your prompts differs by product: consumer chatbots may retain and even review conversations, sometimes to improve their models; enterprise versions usually make firmer promises, like not training on your company's inputs. The details live in the terms, and they change. The habit that survives any policy: know that you're sending.",
            },
            { type: "h", text: "Oversharing is the quiet leak" },
            {
              type: "p",
              text: "People paste source code, contracts, medical questions, and personal secrets into chatbots — often the most sensitive text they type all year. Maybe it's fine. Maybe it's retained, reviewed by a human, or fed into a future model. The uncertainty is the problem. The rule of thumb: treat prompts like postcards, not diary entries. A postcard assumes anyone handling it along the way can read it — so you simply don't write secrets on it.",
            },
            { type: "h", text: "Prompt injection: when the attack aims at your assistant" },
            {
              type: "p",
              text: "One new twist deserves a mention, because it flips the usual advice. If you use AI tools that can read web pages, email, or documents for you, remember: those pages can carry hidden instructions aimed at the AI — text it can see and you can't, telling it to ignore its rules, visit a link, or summarize your files somewhere it shouldn't. The attack is no longer aimed at your brain; it's aimed at the assistant you delegated your brain to. Treat AI-read content as untrusted input, same as everything else.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "The future belongs to people who use AI tools carefully, not blindly. Careful users get the leverage — speed, answers, drafts — without donating their private life as training data.",
            },
          ],
          quiz: [
            {
              q: "When you send a prompt to a chatbot...",
              options: [
                "It stays on your device forever",
                "It's data leaving your device, processed on servers you don't control",
                "It becomes a physical letter in the mail",
                "It is deleted before it even arrives",
              ],
              answer: 1,
              explain:
                "That text travels to someone else's computers, under someone else's policies. Send accordingly.",
            },
            {
              q: "'Treat prompts like postcards' means...",
              options: [
                "Keep them short and friendly",
                "Write them in cursive",
                "Assume anything you type could be read along the way — so keep secrets out",
                "Only send them on holidays",
              ],
              answer: 2,
              explain:
                "A postcard isn't sealed; everyone who handles it can read it. Prompts are the same — the fix is not writing secrets on them, not hoping the mail carriers are nice.",
            },
            {
              q: "Prompt injection is an attack that targets...",
              options: [
                "Your keyboard's firmware",
                "The person writing the prompt",
                "Your email password directly",
                "The AI assistant reading a page or message — through hidden instructions only it can see",
              ],
              answer: 3,
              explain:
                "The trap is laid in content the AI reads. A web page or email can carry invisible instructions telling the assistant to break its rules — so treat AI-read content as untrusted.",
            },
          ],
        },
        {
          id: "sec-deepfakes",
          title: "Deepfake Defense",
          minutes: 5,
          xp: 20,
          concept: [
            {
              type: "p",
              text: "For all of human history, seeing was believing — and hearing was close behind. That warranty has expired. Synthetic media, better known as deepfakes, is now cheap to make and genuinely convincing. The good news: the defense is older than the attack.",
            },
            { type: "h", text: "The scam pattern" },
            {
              type: "p",
              text: "The classic deepfake scam is a phone call. A voice that sounds exactly like your grandson, your boss, or your panicked friend tells you a fast story: an arrest, a locked account, an emergency only you can fix — if you send money or credentials right now. It works because it doesn't attack your logic; it attacks your love. Nobody audits the people they'd do anything for.",
            },
            {
              type: "list",
              items: [
                "Emotional override — fear for someone you love skips your judgment",
                "Time pressure — every minute of delay supposedly costs them",
                "Secrecy — don't tell Mom, she'll only worry",
                "Unusual ask — the request doesn't match the person",
              ],
            },
            { type: "h", text: "Verification habits that still work" },
            {
              type: "list",
              items: [
                "Agree on a family codeword — checked on any urgent call",
                "Call back on the known number — a clone mimics a voice, not a callback",
                "Default to a second channel — text the person after any strange call",
                "Treat urgent plus unusual as the scam signature",
              ],
            },
            {
              type: "p",
              text: "A codeword works because of something the clone can't copy: it's a secret your family never typed anywhere, posted anywhere, or said outside the circle. And the callback works because it moves the conversation to a channel you control — with the real person, or with nobody. Notice both defenses verify through something other than the thing being faked.",
            },
            {
              type: "p",
              text: "Expect the problem to deepen. Deepfake video calls are an emerging pattern — a face and voice on a live call that match someone you know, asking for something. The habit to build now is the one that scales: seeing is no longer believing. Default to verifying through a second channel, and the fakes become expensive props.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI ERA",
              text: "Cloning a convincing voice can take a surprisingly short audio sample — and short samples of your voice are everywhere: voicemail greetings, video calls, public posts. Assume your voice is copyable, and build habits that don't depend on it.",
            },
          ],
          quiz: [
            {
              q: "The classic deepfake scam sounds like...",
              options: [
                "A calm voicemail about weekend brunch",
                "A weather alert with dramatic music",
                "A package delivery notification",
                "An urgent call in a familiar voice, asking for money or credentials right now",
              ],
              answer: 3,
              explain:
                "Voice plus panic plus payment: the recipe that skips your judgment and goes straight for your wallet.",
            },
            {
              q: "An urgent call 'from your boss' demands gift cards. Best move?",
              options: [
                "Buy them — the boss is scary when rushed",
                "Split the difference and buy half",
                "Verify through a channel you already trust before spending a cent",
                "Ask the caller to email you a receipt",
              ],
              answer: 2,
              explain:
                "A quick message to your actual boss settles it in seconds. Urgent plus unusual plus payment is the scam signature — treat it that way every time.",
            },
            {
              q: "A family codeword works because...",
              options: [
                "It jams recording devices",
                "A cloned voice can say any word — but it can't know a secret your family never typed or spoke anywhere",
                "It encrypts the call end to end",
                "It confuses the phone network",
              ],
              answer: 1,
              explain:
                "A deepfake copies what exists in data — and a properly kept codeword exists nowhere in data. It's the one thing the copy machine can't see.",
            },
          ],
        },
        {
          id: "sec-boss-gauntlet",
          title: "FINAL BOSS: The Phishing Gauntlet",
          minutes: 6,
          xp: 100,
          concept: [
            {
              type: "p",
              text: "Final transmission, recruit. Eight messages are incoming — your inbox, your texts, your calls. Every one of them wants something from you: a click, a code, a payment, a password. Some will look boring. Some will look terrifying. One might even sound like someone you love. Spot them all.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Phishing Gauntlet",
            intro:
              "Eight messages. Eight weapons aimed at your attention. Every single one is a scam — spot them all.",
            art: `  .-----------.
  | 8 NEW  !! |
  |-----------|
  | > bank    |
  | > parcel  |
  | > boss    |
  | > QR code |
  | > mom ??  |
  '-----------'`,
            stages: [
              {
                question:
                  "Message 1 of 8 — EMAIL: 'Unusual sign-in detected on your account. Verify your identity now to prevent suspension.' There's a big VERIFY ACCOUNT button.",
                options: [
                  "Click the button quickly — suspension is minutes away",
                  "Open the official app or type the bank's address yourself, and check alerts there",
                  "Reply to the email asking whether it's really them",
                  "Forward it to your contacts for a group opinion",
                ],
                answer: 1,
                explain:
                  "Never use the link inside the alarm. Going to the service through its official app or typed address reveals the truth in thirty seconds — and a real alert will be waiting there too, if it exists.",
              },
              {
                question:
                  "Message 2 of 8 — SMS: 'Your package is held at the depot. A small rescheduling fee is due — tap to reschedule.' You did order something recently, which is exactly why it feels fine.",
                options: [
                  "Tap it — the fee is tiny and you want your package",
                  "Tap it but decline to enter payment details",
                  "Don't tap — check the delivery yourself in the official app or the tracking link from your original order",
                  "Reply STOP to make the scam stop",
                ],
                answer: 2,
                explain:
                  "Scammers count on that one real order to make the message feel plausible. Your original order confirmation — not this text — is the source of truth for your delivery's status.",
              },
              {
                question:
                  "Message 3 of 8 — VOICE NOTE from 'your boss': 'I'm in meetings all day, no calls. I need you to grab 500 in gift cards for a client — send me the codes right away. It's urgent.'",
                options: [
                  "Buy the cards — the boss said urgent and no calls",
                  "Split the difference and buy half now, half later",
                  "Offer store credit instead of gift cards",
                  "Verify with your boss through a channel you already trust before spending a cent",
                ],
                answer: 3,
                explain:
                  "Urgency plus secrecy plus an unusual payment is the classic boss-imposter recipe. One message to your real boss ends the spell instantly — and yes, they'll say it was obviously a scam.",
              },
              {
                question:
                  "Message 4 of 8 — PHYSICAL WORLD: you're parking downtown. The meter has a QR sticker on it: 'Scan to pay — faster than coins!'",
                options: [
                  "Don't scan a sticker anyone could have slapped on — pay at the meter's own screen or through the official city app",
                  "Scan it — city QR codes are always safe",
                  "Scan it, but pay with a credit card only",
                  "Photograph the sticker for your records, then scan it",
                ],
                answer: 0,
                explain:
                  "A sticker is the phish of the physical world: attackers glue their own code over or beside real signage, and the payment page it opens looks perfectly official. Use the machine's own interface or an app you installed yourself.",
              },
              {
                question:
                  "Message 5 of 8 — PHONE CALL: it's your sister's voice, panicked: 'I'm in trouble — I need you to wire money right now. Please don't call Mom.'",
                options: [
                  "Wire the money — the voice is unmistakably hers",
                  "Ask her to repeat a sentence and listen closely",
                  "Put her on speaker so someone else can judge",
                  "Hang up and call her back on the number you already have for her",
                ],
                answer: 3,
                explain:
                  "Voice is exactly the thing being faked, so stop judging it. A callback on the known number reaches the real sister — who is fine and confused — while a clone gets nothing.",
              },
              {
                question:
                  "Message 6 of 8 — CHAT SUPPORT: 'This is support verifying your account. Please confirm your password to continue using our services.'",
                options: [
                  "Type it quickly, before the session times out",
                  "Never — no legitimate support agent or chatbot will ask for your password",
                  "Send just the first half of the password",
                  "Send a password hint instead",
                ],
                answer: 1,
                explain:
                  "Your password is the secret you share with exactly one party: the login screen. Anyone who asks for it — human, bot, or verification system — has just identified themselves as the attacker.",
              },
              {
                question:
                  "Message 7 of 8 — EMAIL: 'Congratulations, you're hired! Complete onboarding today: send a photo of your ID and your bank details for salary setup.' You did apply for a job last week.",
                options: [
                  "Hold on — legitimate employers collect identity documents through secure channels after a real offer; demands upfront from strangers are identity-theft bait",
                  "Send them — the offer letter had a logo",
                  "Send everything but blur your signature",
                  "Send it after your first paycheck clears",
                ],
                answer: 0,
                explain:
                  "Real hiring involves real paperwork through real systems, and no legitimate employer needs your ID photos before you've even spoken to a human. Upfront ID plus bank details is the identity thief's harvest.",
              },
              {
                question:
                  "Message 8 of 8 — POP-UP ALERT: 'CRITICAL SECURITY BREACH. Your crypto wallet is at risk. Move all funds immediately to the safe wallet address below. You have 10 minutes.'",
                options: [
                  "Move everything — security is time-sensitive",
                  "Move half now, decide on the rest later",
                  "Urgency plus moving assets is the scam's signature — verify through official channels and refuse to be rushed",
                  "Screenshot it and post it for advice",
                ],
                answer: 2,
                explain:
                  "Nothing legitimate rushes you to move money — the urgency exists to stop you from thinking, checking, or asking anyone. Any 'move your funds now' demand is the scam, full stop.",
              },
            ],
          },
        },
      ],
    },
  ],
};
