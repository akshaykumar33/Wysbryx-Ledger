import { PerQuestionScore } from "./store";

export interface TeamMemberNotes {
  candidateName: string;
  aliases: string[];
  whatsClicking: string;
  relatableTrap: string;
  nextMove: string[];
  isBlank?: boolean;
}

export interface TeamEvaluationProfile {
  candidateName: string;
  aliases: string[];
  role?: string;
  department?: string;
  overallScore: number;
  percentage: number;
  grade: "AI Master" | "AI Power User" | "AI Practitioner" | "AI Novice" | "AI Resistant" | "Not Evaluated";
  decisionResult: "Strong Hire" | "Hire" | "Lean Hire" | "Lean Reject" | "Reject";
  status: "Draft" | "Completed" | "In Review";
  executiveSynthesis: string;
  primaryAITools?: string[];
  aiVelocityMultiplier?: string;
  scores: Record<string, PerQuestionScore>;
  notes: TeamMemberNotes;
  isBlank?: boolean;
}

export const TEAM_NOTES_PROFILES: Record<string, TeamEvaluationProfile> = {
  // ── 1. Adil (Aadil Raza) ──────────────────────────────────────────────────
  "aadil": {
    candidateName: "Aadil raza",
    aliases: ["aadil raza", "aadil", "adil", "adil raza"],
    role: "AI Research Engineer",
    department: "AI R&D",
    overallScore: 85,
    percentage: 85,
    grade: "AI Master",
    decisionResult: "Strong Hire",
    status: "Completed",
    primaryAITools: ["Google Antigravity", "Claude 3.5 Sonnet"],
    aiVelocityMultiplier: "3.5x speed boost",
    executiveSynthesis: "Adil knows his tools inside out. He uses Antigravity with clear context and gets clean, working code back on the first try. He just needs to make sure he doesn't accept changes too quickly without checking edge cases.",
    notes: {
      candidateName: "Aadil raza",
      aliases: ["aadil raza", "aadil", "adil", "adil raza"],
      whatsClicking: "You use Antigravity really well and give it all the background info it needs upfront. You don't ask vague questions—you set clear rules and get clean code back on the first try.",
      relatableTrap: "Because the tool is so fast and capable, it's easy to skim generated code and assume everything works without double-checking tricky edge cases or looking out for broken types.",
      nextMove: [
        "Before approving changes, ask: 'Point out any edge cases or things that might break in this diff.'",
        "Share your daily prompt setup and workflow tips with the team so others can learn.",
        "Have the tool write unit tests for every new file it generates instead of checking by hand.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 9,
        evidence: "Gives clear instructions, sets boundaries, and provides good examples. Very little back-and-forth needed.",
        observedStrength: "Gives complete context upfront so the AI rarely guesses wrong.",
        recommendation: "Run a short demo for the team on how you set up your prompt context.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 8,
        evidence: "Builds clean code with AI and checks the types before moving on.",
        observedStrength: "Doesn't blindly trust code—checks imports and types.",
        recommendation: "Ask the AI to generate automated tests along with feature code.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 9,
        evidence: "Drops clean error logs into chat and resolves bugs in a few minutes.",
        observedStrength: "Finds the root cause fast by giving the model the exact error details.",
        recommendation: "Keep doing this and save common debug prompts to share with teammates.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 9,
        evidence: "Uses keyboard shortcuts and in-editor AI smoothly; gets work done more than 3x faster.",
        observedStrength: "Very fast daily workflow with in-editor AI shortcuts.",
        recommendation: "Help show new hires how to get their editor set up with AI.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 8,
        evidence: "Understands how AI tools work under the hood, including function calling and tools.",
        observedStrength: "Strong practical grasp of how modern AI coding tools work.",
        recommendation: "Start experimenting with multi-step background tasks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Keeps all passwords, API keys, and private customer info out of prompts.",
        observedStrength: "Very safe with company secrets and credentials.",
        recommendation: "Remind teammates to keep their local env files out of chat.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 2. Rohit Jacob ────────────────────────────────────────────────────────
  "rohit_jacob": {
    candidateName: "Rohit Jacob",
    aliases: ["rohit jacob", "rohit@wysbryx.com"],
    role: "Fullstack Developer",
    department: "Platform",
    overallScore: 33,
    percentage: 33,
    grade: "AI Novice",
    decisionResult: "Lean Reject",
    status: "In Review",
    primaryAITools: ["ChatGPT Free (Browser Tab)"],
    aiVelocityMultiplier: "1.1x speed boost",
    executiveSynthesis: "Rohit is eager to use AI but relies only on the free ChatGPT website. Without access to our codebase, he spends too much time copying, pasting, and fixing outdated code. Moving to an in-editor tool will immediately help.",
    notes: {
      candidateName: "Rohit Jacob",
      aliases: ["rohit jacob", "rohit@wysbryx.com"],
      whatsClicking: "You're curious and you reach for AI every day to ask quick syntax questions, understand confusing error messages, and get past initial blockers.",
      relatableTrap: "Using only the free ChatGPT website in a browser tab is slowing you down. Because it can't see your project files, you have to keep copying and pasting back and forth, and the AI keeps guessing the wrong versions.",
      nextMove: [
        "Switch to an in-editor tool (like Antigravity or Cursor) so the AI can see your project files directly.",
        "Give the AI clear context: tell it what framework version you're on and what you want back.",
        "Never paste real passwords, API keys, or customer data into free web chats.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 3,
        evidence: "Asks short questions in web chat without giving the project setup or file context.",
        observedStrength: "Wants to use AI to unblock daily work.",
        recommendation: "Stop using standalone web chat—use an integrated tool that knows your project.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 4,
        evidence: "Pastes code by hand from the browser; often runs into syntax errors and version mismatches.",
        observedStrength: "Checks code before pasting into the project.",
        recommendation: "Let an in-editor tool write code right where it belongs with proper types.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 4,
        evidence: "Pastes small error snippets into chat without the stack trace or background details.",
        observedStrength: "Uses AI when an error looks unfamiliar.",
        recommendation: "Paste the whole error stack trace so the AI doesn't have to guess.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 3,
        evidence: "Constantly switching back and forth between browser tabs and VS Code wastes time.",
        observedStrength: "Keeps an open mindset toward AI.",
        recommendation: "Set up keyboard shortcuts inside your code editor to stay focused.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 2,
        evidence: "Hasn't worked with modern AI tools, agents, or function schemas yet.",
        observedStrength: "",
        recommendation: "Join an internal team demo to see how modern editor tools work.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 4,
        evidence: "Using a public web chat carries risk if passwords or customer info get pasted by accident.",
        observedStrength: "Knows basic security basics.",
        recommendation: "Stick to company-approved tools that keep code and credentials private.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 3. Sunil P ────────────────────────────────────────────────────────────
  "sunil": {
    candidateName: "Sunil P",
    aliases: ["sunil p", "sunil"],
    role: "Backend Architect",
    department: "Platform",
    overallScore: 25,
    percentage: 25,
    grade: "AI Resistant",
    decisionResult: "Reject",
    status: "Draft",
    primaryAITools: ["Manual SQL Workbench", "No AI"],
    aiVelocityMultiplier: "1.0x (No AI used)",
    executiveSynthesis: "Sunil doesn't use AI at all. He writes, pastes, and confirms all SQL queries manually by hand. While his care for data safety is great, writing boilerplate queries manually is slowing him down.",
    notes: {
      candidateName: "Sunil P",
      aliases: ["sunil p", "sunil"],
      whatsClicking: "You care deeply about data safety. Checking every SQL script by hand before running it makes sure nothing gets accidentally wiped or broken.",
      relatableTrap: "You aren't using any AI tools. Spending hours hand-crafting routine SQL scripts, checking syntax, and scanning result rows by eye takes a lot of time and gets tiring fast.",
      nextMove: [
        "Use AI for query tuning: paste a slow query and ask for better index suggestions.",
        "Let the AI build fake test data so you don't have to build test datasets by hand.",
        "Have AI draft safe migration scripts that roll back cleanly if anything fails.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 2,
        evidence: "Doesn't prompt AI; writes and looks up everything by hand.",
        observedStrength: "Very solid grasp of SQL and database basics.",
        recommendation: "Try asking AI to write repetitive SQL queries and boilerplate table scripts.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 3,
        evidence: "Writes all database queries manually; doesn't use AI code generation.",
        observedStrength: "Takes database changes seriously and checks everything manually.",
        recommendation: "Use AI to double-check SQL syntax and generate safety checks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 2,
        evidence: "Fixes slow queries by trial and error without using AI diagnostic help.",
        observedStrength: "Good hands-on understanding of SQL mechanics.",
        recommendation: "Paste your EXPLAIN query plans into Claude or Antigravity for instant index tips.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 2,
        evidence: "Manual workflow with zero AI acceleration; spending extra time on routine scripts.",
        observedStrength: "Methodical and careful approach to work.",
        recommendation: "Try a database tool with AI built in to speed up daily schema tasks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 1,
        evidence: "Has not explored AI tools, vector search, or database AI integrations.",
        observedStrength: "",
        recommendation: "Look into vector search basics to connect your database skills with AI.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 5,
        evidence: "Safe because no code is shared with external tools, but lacks automated checks.",
        observedStrength: "Zero risk of leaking credentials since nothing is pasted into external chats.",
        recommendation: "Learn how to sanitize queries so you can safely use AI for review.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 4. Dhaval ─────────────────────────────────────────────────────────────
  "dhaval": {
    candidateName: "Dhaval",
    aliases: ["dhaval", "dhaval@wysbryx.com"],
    role: "Senior Software Engineer",
    department: "Engineering",
    overallScore: 85,
    percentage: 85,
    grade: "AI Master",
    decisionResult: "Strong Hire",
    status: "Completed",
    primaryAITools: ["Antigravity", "Cursor", "Claude 3.5 Sonnet"],
    aiVelocityMultiplier: "3.2x speed boost",
    executiveSynthesis: "Dhaval gives the AI crystal-clear context every single time. He explains the setup, rules, and edge cases upfront, getting great code back quickly. His only trap is writing prompts that are too long when the tool could just read the files directly.",
    notes: {
      candidateName: "Dhaval",
      aliases: ["dhaval", "dhaval@wysbryx.com"],
      whatsClicking: "You give the AI super clear context every time. You explain the setup, the rules, and the edge cases upfront, so you get solid code back right away without endless back-and-forth.",
      relatableTrap: "Because you know so much detail, you sometimes write huge, multi-paragraph prompts explaining everything manually. That takes more time than letting the tool inspect your files directly.",
      nextMove: [
        "Let the tool read your repo files instead of typing out every detail by hand in every prompt.",
        "Try giving the AI bigger tasks to work on in steps with automated checks.",
        "Show the team a simple example of how you set up context before starting a prompt.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 9,
        evidence: "Very clear prompts: includes rules, schemas, and expected outputs so the model gets it right.",
        observedStrength: "Clear context framing; the model rarely gets confused.",
        recommendation: "Share your standard prompt structure with other engineers on the team.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 9,
        evidence: "Expects clean code from the tool; asks for tests and type safety upfront.",
        observedStrength: "High quality output with automated tests included.",
        recommendation: "Keep holding the AI to this high standard across all pull requests.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Provides complete error context and steps to reproduce when fixing bugs with AI.",
        observedStrength: "Gives the AI the right background to pinpoint bugs quickly.",
        recommendation: "Try feeding memory and performance profiles into AI when debugging.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Uses AI daily across features and gets work done more than 3x faster.",
        observedStrength: "Consistently fast output with very few bugs.",
        recommendation: "Try running background scripts to automate repetitive checks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 8,
        evidence: "Understands how AI models handle context, files, and multi-step tasks.",
        observedStrength: "Good understanding of tool limitations and context limits.",
        recommendation: "Help design automated prompts for our CI pipeline.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 9,
        evidence: "Never leaks secrets; keeps API keys in local config files and scrubs sensitive info.",
        observedStrength: "Very careful about keeping company data safe.",
        recommendation: "Help check prompt templates across the team for secret leaks.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 5. Deepak Rajput / Deepak Rajat ── SET TO 50 AS REQUESTED ─────────────
  "deepak": {
    candidateName: "Deepak Rajat",
    aliases: ["deepak rajat", "deepak rajput", "deepak"],
    role: "Backend Architect",
    department: "Engineering",
    overallScore: 50,
    percentage: 50,
    grade: "AI Practitioner",
    decisionResult: "Lean Hire",
    status: "Completed",
    primaryAITools: ["Claude 3.5 Sonnet", "Cursor"],
    aiVelocityMultiplier: "1.5x speed boost",
    executiveSynthesis: "Deepak has great engineering fundamentals, but his habit of manually reading and editing every single word the AI writes holds him at 50/100. To speed up, he needs to let automated tests verify the code instead of reading every line himself.",
    notes: {
      candidateName: "Deepak Rajput",
      aliases: ["deepak rajat", "deepak rajput", "deepak"],
      whatsClicking: "Your coding fundamentals are very strong. You can tell within seconds if code is clean or messy, and you never let bad logic slip into production.",
      relatableTrap: "Because your standards are high, you feel the need to manually read, edit, and tweak every single line the AI produces. That takes up all your time, slows your output, and turns you into your own bottleneck.",
      nextMove: [
        "Let the tool do the checking: instead of reading line by line, tell the AI to write unit tests and edge cases to prove the code works.",
        "Don't worry about formatting every variable by hand; let the linter and tests handle it.",
        "Try accepting a small feature generated with tests without rewriting it line-by-line.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 5,
        evidence: "Writes good prompts with high technical accuracy, but over-specifies small details.",
        observedStrength: "Very clear idea of how good code should look.",
        recommendation: "Prompt for tests and outcomes instead of micromanaging the exact code syntax.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 5,
        evidence: "Manually reviews and rewrites almost every line the AI generates, capping his speed.",
        observedStrength: "Code that gets merged is clean and well-structured.",
        recommendation: "Have the AI write unit tests to verify the code instead of reading every word yourself.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 5,
        evidence: "Good at finding bugs, but often fixes them manually instead of letting AI do it.",
        observedStrength: "Deep knowledge of backend systems and logic flaws.",
        recommendation: "Give the AI the full stack trace and let it draft the fix first.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 5,
        evidence: "Manual review habits slow him down; currently getting ~1.5x speedup.",
        observedStrength: "High quality output with near-zero bugs.",
        recommendation: "Shift from manual line reading to running test suites to save hours every sprint.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 5,
        evidence: "Knows architecture well, but hasn't integrated autonomous AI tools into his daily work.",
        observedStrength: "Great understanding of backend system architecture.",
        recommendation: "Try delegating routine tasks to an AI coding agent with test checks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 5,
        evidence: "Very careful about credentials and keeps secrets safe.",
        observedStrength: "Careful security mindset with local env files.",
        recommendation: "Keep using sanitized test data when testing AI outputs.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 6. V Bharath Jinda (Bharath) ── EXPLICITLY KEPT BLANK ────────────────
  "bharath": {
    candidateName: "V Bharath Jinda",
    aliases: ["v bharath jinda", "bharath jinda", "bharath"],
    role: "Senior Software Engineer",
    department: "Platform",
    overallScore: 0,
    percentage: 0,
    grade: "Not Evaluated",
    decisionResult: "Lean Hire",
    status: "Draft",
    isBlank: true,
    executiveSynthesis: "",
    notes: {
      candidateName: "V Bharath Jinda",
      aliases: ["v bharath jinda", "bharath jinda", "bharath"],
      whatsClicking: "",
      relatableTrap: "",
      nextMove: [],
      isBlank: true,
    },
    scores: {},
  },

  // ── 7. Sigireddy Viswesh (Vishwesh) ── EXPLICITLY KEPT BLANK ───────────
  "vishwesh": {
    candidateName: "Sigireddy Viswesh",
    aliases: ["sigireddy viswesh", "viswesh", "vishwesh"],
    role: "Fullstack Developer",
    department: "Engineering",
    overallScore: 0,
    percentage: 0,
    grade: "Not Evaluated",
    decisionResult: "Lean Hire",
    status: "Draft",
    isBlank: true,
    executiveSynthesis: "",
    notes: {
      candidateName: "Sigireddy Viswesh",
      aliases: ["sigireddy viswesh", "viswesh", "vishwesh"],
      whatsClicking: "",
      relatableTrap: "",
      nextMove: [],
      isBlank: true,
    },
    scores: {},
  },

  // ── 8. Bhavnesh Chamare (From PDF Page 1) ─────────────────────────────────
  "bhavnesh": {
    candidateName: "Bhavnesh Chamare",
    aliases: ["bhavnesh chamare", "bhavnesh"],
    role: "AI Research Engineer",
    department: "AI R&D",
    overallScore: 78,
    percentage: 78,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["In-Editor Chat", "Claude 3.5 Sonnet"],
    aiVelocityMultiplier: "2.6x speed boost",
    executiveSynthesis: "Bhavnesh frames questions well and gets what he needs quickly. He uses AI as a solid sounding board. He's comfortable with in-editor chat, but will unlock more speed by trying out automated scripts.",
    notes: {
      candidateName: "Bhavnesh Chamare",
      aliases: ["bhavnesh chamare", "bhavnesh"],
      whatsClicking: "You have a solid intuition for how to frame problems so the AI gets what you need on the first pass. You use it well as a sounding board to talk through edge cases and check your own work before submitting it.",
      relatableTrap: "Standard in-editor chat prompts work so reliably for you that it's easy to stay in that comfort zone. You hold back a bit on exploring multi-step agent scripts or CLI automations simply because everyday prompting already delivers steady results.",
      nextMove: [
        "Share a couple of your everyday sanity-check prompts with the team.",
        "Try setting up a few basic automation scripts without stressing about making them perfect on the first run.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 9,
        evidence: "Frames problems clearly so the AI delivers what is needed on the first try.",
        observedStrength: "Good instinct for explaining what needs to be built.",
        recommendation: "Share your everyday check prompts with the team.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 8,
        evidence: "Checks code before submitting; uses AI to review logic and catch tricky edge cases.",
        observedStrength: "Checks his own work carefully before opening a PR.",
        recommendation: "Have the model generate automated test cases.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Uses AI as an interactive partner to talk through confusing errors.",
        observedStrength: "Quick at talking through confusing error messages.",
        recommendation: "Paste full error traces right into the prompt.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 7,
        evidence: "Steady in-editor chat usage, but hasn't tried automated scripts yet.",
        observedStrength: "Very consistent daily editor chat workflow.",
        recommendation: "Try out a simple automation script without worrying about perfection.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Knows how AI tools work; ready to explore multi-step tasks.",
        observedStrength: "Good grasp of everyday AI tools.",
        recommendation: "Build a simple multi-step script for routine tasks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Keeps private keys and credentials out of prompts.",
        observedStrength: "Good safety habits with project data.",
        recommendation: "Keep local ignore rules up to date.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 9. Surendra Patel (From PDF Page 1) ───────────────────────────────────
  "surendra": {
    candidateName: "Surendra Kumar Patel",
    aliases: ["surendra kumar patel", "surendra patel", "surendra"],
    role: "Frontend Specialist",
    department: "Platform",
    overallScore: 72,
    percentage: 72,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["GitHub Copilot", "Claude Chat"],
    aiVelocityMultiplier: "2.4x speed boost",
    executiveSynthesis: "Surendra gets right down to business and uses AI well for boilerplate and syntax. His main trap is assuming edge cases are handled because the code looks clean on top. Next step: feed stack traces directly into chat.",
    notes: {
      candidateName: "Surendra Patel",
      aliases: ["surendra kumar patel", "surendra patel", "surendra"],
      whatsClicking: "You get right down to business and use AI well to knock out boilerplate, clear up simple syntax issues, and keep momentum going when starting a task. You're also very receptive to picking up new workflow habits.",
      relatableTrap: "Prompts lean heavily toward the happy path. When code looks clean on top, it's easy to assume the edge cases are covered, leaving verification to be handled manually later. It's also easy to fall back to manual print statements when pasting the actual error log into the model would resolve it much faster.",
      nextMove: [
        "Have the model test the logic: Before wrapping up, ask: 'Give me 3 realistic edge cases where this logic will break.'",
        "Keep secrets safe: Make sure local ignore rules are set up so staging credentials and environment configs stay off external servers.",
        "Feed stack traces: When something fails, drop the actual runtime trace into chat instead of tracing it solely with logs.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 7,
        evidence: "Builds boilerplate fast; needs to ask the AI to test corner cases too.",
        observedStrength: "Gets new tasks started quickly with AI assistance.",
        recommendation: "Ask: 'Give me 3 realistic edge cases where this will break.'",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Generates clean starter code; sometimes assumes edge cases are handled because surface code looks neat.",
        observedStrength: "Fast at knocking out boilerplate.",
        recommendation: "Have the model write tests for corner cases before writing code.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 7,
        evidence: "Sometimes uses manual print statements instead of dropping the error into chat.",
        observedStrength: "Keeps at a problem until it's fixed.",
        recommendation: "Paste the actual error log into the chat for a faster fix.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Picks up new AI habits easily and applies suggestions right away.",
        observedStrength: "Very open to trying new workflow habits.",
        recommendation: "Set up keyboard shortcuts to test errors faster.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Understands API contracts and handles straightforward integrations.",
        observedStrength: "Good understanding of API connections.",
        recommendation: "Try having the AI draft input validation schemas.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 7,
        evidence: "Needs to make sure local ignore rules keep test credentials off external servers.",
        observedStrength: "Responsive to security tips.",
        recommendation: "Check that staging credentials stay off external servers.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 10. Prem Manchina (From PDF Page 1) ───────────────────────────────────
  "prem": {
    candidateName: "Prem Manchina",
    aliases: ["prem manchina", "prem"],
    role: "Fullstack Developer",
    department: "Platform",
    overallScore: 74,
    percentage: 74,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["Cursor", "GitHub Copilot"],
    aiVelocityMultiplier: "2.7x speed boost",
    executiveSynthesis: "Prem connects services and builds boilerplate fast without overthinking. His trap is pasting real sample data into chat and assuming async calls never hang. Next step: scrub data and ask how code behaves on timeouts.",
    notes: {
      candidateName: "Prem Manchina",
      aliases: ["prem manchina", "prem"],
      whatsClicking: "You're fast at knocking out boilerplate, wiring up connections, and getting services talking to each other without overthinking it.",
      relatableTrap: "When you're focused on unblocking a tricky flow quickly, it's tempting to paste real sample payloads right into prompts. The model also tends to sound confident about simple asynchronous tasks while completely ignoring retries or silent network timeouts.",
      nextMove: [
        "Scrub mock data before prompting: Always sanitize real payloads and IDs before pasting into chat.",
        "Ask the model specifically: 'How does this logic behave if the downstream connection hangs or times out?'",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Wires up services quickly; prompts are direct and focused on getting it running.",
        observedStrength: "Gets services talking to each other without overthinking.",
        recommendation: "Ask: 'How does this behave if the downstream connection hangs or times out?'",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Builds functional service connections; needs to ensure retries aren't forgotten.",
        observedStrength: "Fast connection wiring between different services.",
        recommendation: "Make sure all generated API calls include proper timeout handling.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Fixes connection and integration bugs fast using AI.",
        observedStrength: "Quick turnaround on service connection issues.",
        recommendation: "Test how code handles dropped connections during chat sessions.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Great momentum on sprint tickets; gets work done almost 3x faster.",
        observedStrength: "Stays unblocked and moves quickly.",
        recommendation: "Save reusable prompt templates for common API connections.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Good understanding of API endpoints and service communication.",
        observedStrength: "Practical grasp of API connections.",
        recommendation: "Look into retry queues for handling failed requests.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 6,
        evidence: "Sometimes tempted to paste real sample payloads when in a rush to fix something.",
        observedStrength: "Knows real data shouldn't be shared.",
        recommendation: "Scrub mock data before prompting; use fake IDs and clean dummy data.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 11. Umesh Prasad (From PDF Page 2) ────────────────────────────────────
  "umesh": {
    candidateName: "Umesh Prasad",
    aliases: ["umesh prasad", "umesh"],
    role: "QA Automation Lead",
    department: "Quality Assurance",
    overallScore: 79,
    percentage: 79,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["Cursor", "Claude 3.5 Sonnet"],
    aiVelocityMultiplier: "2.8x speed boost",
    executiveSynthesis: "Umesh has an instinct for spotting bugs and uses AI to unpack messy error reports fast. His trap is letting AI test only the happy path. Next step: ask AI to act like a user trying to break the feature.",
    notes: {
      candidateName: "Umesh Prasad",
      aliases: ["umesh prasad", "umesh"],
      whatsClicking: "You have an instinct for spotting inconsistencies and use AI well to unpack messy bug reports and get to the core problem fast.",
      relatableTrap: "AI defaults to happy-path test scenarios, missing the messy, unpredictable ways real users actually interact with a product unless you push it out of that comfort zone.",
      nextMove: [
        "Flip the prompt perspective: 'Act like a user actively trying to break this feature or bypass rules—what edge cases would you hit?' Use those directly to build automated test suites.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Unpacks messy bug reports quickly by asking AI targeted diagnostic questions.",
        observedStrength: "Great instinct for spotting bugs and weird corner cases.",
        recommendation: "Flip the perspective: 'Act like a user actively trying to break this feature.'",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 8,
        evidence: "Generates solid test suites; needs to make sure tests cover messy user behavior.",
        observedStrength: "Strong automated test coverage.",
        recommendation: "Ask AI to generate tests specifically for unexpected and invalid user inputs.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 9,
        evidence: "Turns confusing bug reports into reproducible test cases in minutes.",
        observedStrength: "Top-tier bug isolation and test reproduction.",
        recommendation: "Share your bug triage prompt flow with other QA engineers.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Builds automated test suites almost 3x faster with AI assist.",
        observedStrength: "Reliable automated quality checks.",
        recommendation: "Run automated AI test checks directly in our CI pipeline.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Understands end-to-end testing and browser automation thoroughly.",
        observedStrength: "Solid understanding of test runner setups.",
        recommendation: "Experiment with AI agents that run regression checks automatically.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Makes sure test databases and tokens never use real production data.",
        observedStrength: "Careful about separating test and live credentials.",
        recommendation: "Keep using dummy tokens for all test scripts.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 12. Jeremiah Sunny (From PDF Page 2) ──────────────────────────────────
  "jeremia": {
    candidateName: "Jeremia Sunny",
    aliases: ["jeremia sunny", "jeremiah sunny", "jeremia", "jeremiah"],
    role: "Senior Software Engineer",
    department: "Engineering",
    overallScore: 76,
    percentage: 76,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["v0.dev", "Cursor"],
    aiVelocityMultiplier: "3.0x speed boost",
    executiveSynthesis: "Jeremiah turns prototypes around fast and loves seeing screens take shape. His trap is letting PR diffs quietly grow massive and wasting time on made-up props. Next step: keep PRs small and refactor views into clean helper utilities.",
    notes: {
      candidateName: "Jeremiah Sunny",
      aliases: ["jeremia sunny", "jeremiah sunny", "jeremia", "jeremiah"],
      whatsClicking: "You turn prototypes around quickly, iterate fast, and love seeing work take shape on screen without hesitation.",
      relatableTrap: "Because generating new screens feels effortless, pull requests can quietly grow into massive diffs before you notice. It's also easy to lose time when the model invents props or methods that sound real but don't exist in the library.",
      nextMove: [
        "Keep PRs intentionally small and focused.",
        "Use the assistant to refactor complex component logic into clean helper utilities rather than generating entire massive views in one pass.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Iterates UI mockups and frontend screens rapidly with AI visual prompts.",
        observedStrength: "Turns UI ideas into working screens faster than almost anyone.",
        recommendation: "Ask the AI to break massive screens into small, reusable helper files.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Builds large screens quickly, but occasionally wastes time on made-up props.",
        observedStrength: "Fast implementation of user interfaces.",
        recommendation: "Double-check library prop names against real TypeScript definitions.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Fixes UI styling and component state bugs quickly with AI help.",
        observedStrength: "Quick at diagnosing frontend styling and state issues.",
        recommendation: "Paste component props into chat before asking for new views.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Fastest prototype turnaround in the frontend squad (~3x speed boost).",
        observedStrength: "High creative momentum and rapid screen generation.",
        recommendation: "Keep pull requests small to make peer reviews easy.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Good at component layout; working on keeping state management clean.",
        observedStrength: "Clean component layouts with Tailwind.",
        recommendation: "Keep server and client components cleanly separated.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Cleans assets and URLs properly; no private credentials leaked.",
        observedStrength: "Good frontend data handling.",
        recommendation: "Make sure all generated forms validate inputs properly.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 13. Himanshu Verma (From PDF Page 2) ──────────────────────────────────
  "himanshu": {
    candidateName: "Himanshu Verma",
    aliases: ["himanshu verma", "himanshu"],
    role: "AI Research Engineer",
    department: "AI R&D",
    overallScore: 75,
    percentage: 75,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["Claude 3.5 Sonnet", "Cursor"],
    aiVelocityMultiplier: "2.5x speed boost",
    executiveSynthesis: "Himanshu likes clean code and uses AI well to skip boring boilerplate. His trap is accepting outdated packages suggested by older model training data. Next step: mention exact SDK versions in prompts.",
    notes: {
      candidateName: "Himanshu Verma",
      aliases: ["himanshu verma", "himanshu"],
      whatsClicking: "You appreciate clean structure and use AI effectively to bypass repetitive boilerplate and initial setup work.",
      relatableTrap: "The model routinely suggests outdated methods or deprecated packages that break modern SDKs. It also tends to nest hierarchies much deeper than necessary if left unchecked.",
      nextMove: [
        "Mention your exact platform and SDK versions in your prompts.",
        "Focus the model on writing unit tests for core logic rather than letting it decide structural layout.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Skips boilerplate and project setup cleanly with structured instructions.",
        observedStrength: "Appreciates clean structure and avoids messy initial code.",
        recommendation: "Always name your exact SDK and library version in the first prompt.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Occasionally accepts outdated methods or overly nested folders from older AI training data.",
        observedStrength: "Fast initial project scaffolding.",
        recommendation: "Tell the AI to keep folder structures flat and modern.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Spots version conflicts and package errors quickly.",
        observedStrength: "Good at resolving package version mismatches.",
        recommendation: "Use AI to update outdated method calls automatically.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Steady daily AI usage to bypass repetitive setup work (~2.5x speed boost).",
        observedStrength: "Disciplined daily workflow.",
        recommendation: "Decide your own file layout instead of letting the AI guess.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Understands service boundaries and library contracts.",
        observedStrength: "Clean interface setups.",
        recommendation: "Write automated checks for external library wrappers.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Checks npm package names carefully before installing them.",
        observedStrength: "Careful about installing made-up or hallucinated packages.",
        recommendation: "Keep running automated package security audits.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 14. Parameswar R (From PDF Page 2) ────────────────────────────────────
  "parmeshwar": {
    candidateName: "Parmeshwar R",
    aliases: ["parmeshwar r", "parameswar r", "parmeshwar", "parameswar"],
    role: "QA Automation Lead",
    department: "Quality Assurance",
    overallScore: 77,
    percentage: 77,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["Cursor", "Python CLI"],
    aiVelocityMultiplier: "2.7x speed boost",
    executiveSynthesis: "Parameswar loves practical automations that take away boring manual work. His trap is AI scripts that forget to clean up background processes. Next step: ask for resilient fallback selectors and clean teardown logic.",
    notes: {
      candidateName: "Parameswar R",
      aliases: ["parmeshwar r", "parameswar r", "parmeshwar", "parameswar"],
      whatsClicking: "You like pragmatic automations that remove repetitive manual work and can put together scripts and task runners quickly from scratch.",
      relatableTrap: "Automation scripts written by AI are notorious for omitting proper cleanup on unexpected errors, leaving background processes lingering. They also lean on brittle selectors that break whenever a target page shifts slightly.",
      nextMove: [
        "Ask the model to provide resilient fallback selectors.",
        "Always make it verify that teardown logic executes cleanly even during unexpected failures.",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Builds practical automation scripts from scratch to eliminate manual tasks.",
        observedStrength: "Focuses on building tools that save people real time.",
        recommendation: "Ask the model for resilient fallback selectors that won't break on small UI tweaks.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Puts together scripts quickly; occasionally needs to remind AI to close background tasks.",
        observedStrength: "Fast turnaround on automation task runners.",
        recommendation: "Always make sure cleanup code runs even when a script crashes.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Debugs flaky test runs and timing bugs with AI diagnostic help.",
        observedStrength: "Good at troubleshooting asynchronous test failures.",
        recommendation: "Drop error traces right into chat for instant timing fixes.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Saves hours every week by automating repetitive manual tests (~2.7x speedup).",
        observedStrength: "Pragmatic, time-saving automation mindset.",
        recommendation: "Package helpful scripts so the rest of the team can run them easily.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Knows how headless browser runners and background processes run.",
        observedStrength: "Solid grasp of test automation setups.",
        recommendation: "Add automatic container cleanup after test runs finish.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 8,
        evidence: "Ensures test credentials in scripts never have live production access.",
        observedStrength: "Keeps test scripts limited to safe, non-destructive roles.",
        recommendation: "Use short-lived staging tokens for automated test runs.",
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // ── 15. Harsh Raj (From PDF Page 3) ───────────────────────────────────────
  "harsh": {
    candidateName: "Harsh Raj",
    aliases: ["harsh raj", "harsh"],
    role: "Senior Software Engineer",
    department: "Engineering",
    overallScore: 78,
    percentage: 78,
    grade: "AI Power User",
    decisionResult: "Hire",
    status: "Completed",
    primaryAITools: ["Cursor", "Claude 3.5 Sonnet"],
    aiVelocityMultiplier: "2.9x speed boost",
    executiveSynthesis: "Harsh is a versatile problem solver who unblocks himself quickly. His trap is slipping into autocomplete mode and trusting code just because it looks right. Next step: ask the model to poke holes in diffs before committing.",
    notes: {
      candidateName: "Harsh Raj",
      aliases: ["harsh raj", "harsh"],
      whatsClicking: "You're a versatile troubleshooter who moves across different problems easily and uses the assistant to clear routine obstacles without getting stuck.",
      relatableTrap: "Moving fast makes it easy to slip into autocomplete mode—trusting generated code because it looks plausible rather than asking the model to poke holes in it. Fast local debugging can also lead to accidentally sharing sensitive config keys in the chat.",
      nextMove: [
        "Ensure local ignore rules are active so configs stay local.",
        "Before committing, ask the tool: 'Point out any potential unhandled exceptions, race conditions, or null errors in this diff.'",
      ],
    },
    scores: {
      q_ai_prompting: {
        rating: 8,
        evidence: "Handles different types of problems easily; uses AI to unblock hurdles fast.",
        observedStrength: "Versatile troubleshooter who rarely stays stuck on a bug.",
        recommendation: "Ask: 'Point out any unhandled errors or null checks in this diff.'",
        updatedAt: new Date().toISOString(),
      },
      q_ai_codegen: {
        rating: 7,
        evidence: "Moves fast, which sometimes leads to trusting generated code without poking holes in it.",
        observedStrength: "High coding speed across different parts of the stack.",
        recommendation: "Don't just accept code that looks clean; ask the model to stress-test it.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_debug: {
        rating: 8,
        evidence: "Fixes tricky operational bugs quickly by combining local knowledge with AI prompts.",
        observedStrength: "Fast turnaround on daily bug fixes.",
        recommendation: "Save helpful debug prompts for common issues.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_workflow: {
        rating: 8,
        evidence: "Jumps between different tasks smoothly and gets work done almost 3x faster.",
        observedStrength: "High agility across different tasks.",
        recommendation: "Add a quick pre-commit sanity check prompt to your daily workflow.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_systems: {
        rating: 7,
        evidence: "Comfortable across frontend, backend, and build tools.",
        observedStrength: "Broad engineering versatility across the stack.",
        recommendation: "Spend time modeling race conditions and concurrency.",
        updatedAt: new Date().toISOString(),
      },
      q_ai_security: {
        rating: 7,
        evidence: "Fast local debugging sometimes risks pasting config keys; needs to keep ignore rules on.",
        observedStrength: "Takes security feedback constructively.",
        recommendation: "Make sure local config files and secret keys are always ignored.",
        updatedAt: new Date().toISOString(),
      },
    },
  },
};

/**
 * Finds matching team notes and pre-filled evaluation data for any candidate name or email.
 */
export function getTeamNotesProfileForCandidate(nameOrEmail: string): TeamEvaluationProfile | null {
  const norm = nameOrEmail.trim().toLowerCase();

  for (const key of Object.keys(TEAM_NOTES_PROFILES)) {
    const profile = TEAM_NOTES_PROFILES[key];
    if (
      profile.aliases.some((alias) => norm === alias || norm.includes(alias) || alias.includes(norm))
    ) {
      return profile;
    }
  }
  return null;
}
