window.PORTFOLIO_DATA = {
  profile: {
    name: "Andrzej Lis",
    title: "Senior / Lead Software Engineer",
    positioning: "Java / Kotlin Backend Engineer",
    location: "Kraków, Poland",
    email: "andrzej.lis3@gmail.com",
    github: "https://github.com/lisu188",
    linkedin: "https://www.linkedin.com/in/andrzej-lis-1b4830a6/",
    cv: "assets/Andrzej-Lis-CV.pdf",
    avatar: "https://avatars.githubusercontent.com/u/7967861?v=4",
    years: "12+",
    summary: "Senior software engineer focused on JVM backend architecture, cloud systems and technical leadership. My work spans production Java/Kotlin services, concurrency and distributed systems, with hands-on depth in C++, performance engineering, game technology and reverse engineering."
  },
  heroSignals: [
    { value: "12+", label: "years building production software" },
    { value: "Java / Kotlin", label: "primary backend specialization" },
    { value: "Kafka / JMS", label: "messaging and integration experience" },
    { value: "2h → 30m", label: "CI/CD build-time improvement" }
  ],
  capabilities: [
    {
      title: "JVM",
      emphasis: true,
      items: ["Java", "Kotlin", "JVM internals", "Concurrency", "Bytecode investigation"]
    },
    {
      title: "Backend",
      emphasis: true,
      items: ["Spring Boot", "Spring Framework", "Hibernate", "REST", "Dependency Injection", "Design Patterns"]
    },
    {
      title: "Messaging & integration",
      emphasis: true,
      items: ["Kafka", "JMS / ActiveMQ", "WebSocket", "OAuth", "Asynchronous jobs"]
    },
    {
      title: "Data",
      items: ["Oracle", "PostgreSQL", "MongoDB", "Firestore"]
    },
    {
      title: "Delivery",
      items: ["Gradle", "Maven", "TeamCity", "Jenkins", "CI/CD", "Docker", "Cloud Run"]
    },
    {
      title: "Systems",
      items: ["C++", "C17", "Python", "SDL2", "pybind11", "Reverse engineering"]
    }
  ],
  flagship: {
    name: "WinRisk",
    repo: "https://github.com/lisu188/winrisk",
    eyebrow: "Java backend architecture",
    summary: "Modernized a Java strategy-game engine into a concurrent Spring Boot application with REST command handling, real-time WebSocket state updates and a React/TypeScript client. The same engine supports deterministic headless simulation, automated testing and CI quality gates.",
    decisions: [
      "Keep the Java game engine independent from the web layer.",
      "Synchronize state per game session instead of using one global lock.",
      "Version state monotonically so clients can reject reordered real-time updates.",
      "Package backend and React client into one deployable Spring Boot artifact."
    ],
    quality: ["JUnit", "integration tests", "JaCoCo gate", "CI smoke test", "deterministic simulations"],
    tags: ["Java", "Spring Boot", "REST", "STOMP/WebSocket", "Concurrency", "Gradle"]
  },
  kotlinCase: {
    name: "Spotify Web API Demo",
    repo: "https://github.com/lisu188/spotify-web-api-demo",
    eyebrow: "Kotlin / cloud backend",
    summary: "Built a Kotlin/Spring backend that combines Spotify and Last.fm data through OAuth integrations and asynchronous processing. It runs on GCP with Cloud Run, Firestore and Secret Manager, with optional AI-assisted music classification.",
    decisions: [
      "Cloud Run for a simple stateless HTTP deployment surface.",
      "Firestore as the persisted source of truth for jobs, tokens and refresh state.",
      "Secret Manager and Application Default Credentials instead of shipping service-account keys.",
      "Bounded background parallelism and explicit caching choices for external API workloads."
    ],
    tags: ["Kotlin", "Spring Boot", "Java 21", "GCP", "Cloud Run", "Firestore", "Docker"]
  },
  jvmLab: {
    name: "JVM Experiments",
    repo: "https://github.com/lisu188/jexperiments",
    summary: "20+ focused Java and Kotlin experiments exploring bytecode, concurrency, JVM behavior and language/runtime internals.",
    topics: ["Kotlin suspend state machines", "value-class boxing", "Kotlin metadata", "Java lambda bytecode", "CompletableFuture", "Flow.Publisher", "thread pools", "BCEL"]
  },
  experience: [
    {
      period: "Aug 2020 — Present",
      title: "Lead Software Engineer / Resource Manager",
      company: "EPAM Systems · client: Google / Google Fiber",
      technical: "Design and implement features in a large internal Java codebase for Google Fiber, working directly with the client technical lead and stakeholders on architecture, delivery risks and outcomes.",
      secondary: "Lead a small delivery team while supporting staffing, feedback and engineer development across the engagement.",
      stack: ["Java 8", "large-scale codebase", "feature design", "delivery ownership"]
    },
    {
      period: "Jan 2019 — Jul 2020",
      title: "Team Leader / Scrum Master / Software Engineer",
      company: "Sabre · Crew Manager",
      technical: "Designed and developed a training module as a microservice with Kafka-based communication and delivered automated duty-assignment backend features.",
      secondary: "Provided technical guidance, coordinated across teams and mentored engineers.",
      stack: ["Java 8", "Spring Boot", "Kafka", "Oracle", "MongoDB"]
    },
    {
      period: "Feb 2017 — Dec 2018",
      title: "Software Engineer",
      company: "j-labs · client: Sabre / Crew Manager",
      technical: "Delivered Spring/JMS backend functionality, including forwarding database transaction snapshots as JMS messages. Built internal tooling for build monitoring and failure diagnostics.",
      secondary: "Led CI/CD improvements that reduced build time from about two hours to about thirty minutes.",
      stack: ["Java 8", "Spring", "Hibernate", "JMS / ActiveMQ", "TeamCity"]
    },
    {
      period: "Apr 2015 — Jan 2017",
      title: "Software Engineer",
      company: "j-labs · client: Sabre / AirCrews",
      technical: "Worked on a legacy Java/C++ airline crewing system, implemented APIS format extensions and became technical owner of an ESB component.",
      secondary: "Migrated repositories from SVN to Git and supported adoption within the team.",
      stack: ["Java 5–7", "C++11", "WebLogic", "Oracle", "Git"]
    },
    {
      period: "Aug 2013 — Mar 2015",
      title: "Software Engineer",
      company: "Motorola Solutions · Unified Event Manager",
      technical: "Implemented product features across Java/JEE backend and UI components, ported a Java WebStart UI from Unix to Windows and implemented JMS/WebSocket communication between JavaScript and Java services.",
      secondary: "Contributed to a structured network-infrastructure backend view.",
      stack: ["Java 7", "Java/JEE", "JMS", "WebSocket", "PostgreSQL"]
    }
  ],
  impactStory: {
    title: "Cutting the CI feedback loop from 2 hours to 30 minutes",
    problem: "A long-running client program had CI/CD builds taking roughly two hours, slowing feedback and diagnosis.",
    intervention: "Led delivery-pipeline improvements and built internal tooling to monitor builds and improve failure diagnostics.",
    outcome: "Build time dropped to roughly thirty minutes — about a 4× improvement in feedback speed."
  },
  architectureDecisions: [
    {
      title: "Separate domain from delivery",
      source: "WinRisk",
      repo: "https://github.com/lisu188/winrisk",
      decision: "Keep domain/game logic independent from Spring and the browser client.",
      tradeoff: "A stricter boundary adds adapters, but keeps the core deterministic, testable and reusable."
    },
    {
      title: "Explicit consistency for realtime updates",
      source: "WinRisk",
      repo: "https://github.com/lisu188/winrisk",
      decision: "Use per-session synchronization plus monotonic state versions.",
      tradeoff: "Clients must understand versions, but reordered WebSocket delivery no longer defines correctness."
    },
    {
      title: "Cloud-managed persistence and secrets",
      source: "Spotify Web API Demo",
      repo: "https://github.com/lisu188/spotify-web-api-demo",
      decision: "Use Firestore, Secret Manager and ADC around a Cloud Run service.",
      tradeoff: "Tighter GCP integration reduces local symmetry but simplifies operational secret and state management."
    },
    {
      title: "Expose a native engine to automation",
      source: "Fall of Nouraajd",
      repo: "https://github.com/lisu188/fall-of-nouraajd",
      decision: "Expose the C++ engine through pybind11/Python and a headless MCP surface.",
      tradeoff: "The binding layer adds maintenance cost, but unlocks scripted testing, inspection and automated walkthroughs."
    }
  ],
  breadth: [
    {
      category: "Systems / game engineering",
      name: "Fall of Nouraajd",
      repo: "https://github.com/lisu188/fall-of-nouraajd",
      image: "https://raw.githubusercontent.com/lisu188/fall-of-nouraajd/main/screenshots/nouraajd-exploration.png",
      imageAlt: "Fall of Nouraajd map exploration interface",
      summary: "Building a dark-fantasy RPG as a systems-engineering project: a custom C++ engine, Python gameplay layer, SDL2 rendering and pybind11 integration, supported by headless automation, content validation and a 90% eligible-line coverage gate.",
      tags: ["C++", "Python", "SDL2", "pybind11", "CMake", "Automation"]
    },
    {
      category: "Reverse engineering",
      name: "Clash Disassembly",
      repo: "https://github.com/lisu188/clash-disassembly",
      summary: "Reverse-engineering and reconstructing a Windows 95 game from its original binary. The project maps 4,070 recovered functions into 138 independently compiled C17 translation units and validates behavior against the original assembly.",
      tags: ["Assembly", "C17", "SDL", "4,070 functions", "138 translation units"]
    },
    {
      category: "Native performance",
      name: "CLife & vstd",
      repo: "https://github.com/lisu188/clife",
      secondaryRepo: "https://github.com/lisu188/vstd",
      summary: "Performance-focused C++ work spanning cellular automata, compact simulation data structures, reproducible benchmarks, concurrency and reusable low-level utilities.",
      tags: ["C++", "Performance", "Benchmarks", "Concurrency"]
    },
    {
      category: "Simulation / graphics",
      name: "Boid3D",
      repo: "https://github.com/lisu188/boid3d",
      image: "https://raw.githubusercontent.com/lisu188/boid3d/main/boid3d/icon.png",
      imageAlt: "Boid3D project icon from the repository",
      summary: "Godot 4 flocking simulation implementing cohesion, alignment and separation with a spatial hash so agents query nearby neighbours instead of testing the entire flock.",
      tags: ["Godot", "Simulation", "Spatial hash", "Boids"]
    },
    {
      category: "ML / research experiments",
      name: "Neural Backend",
      repo: "https://github.com/lisu188/neural-backend",
      summary: "An archived TensorFlow/Flask classifier exploring pattern recognition and signature dynamics, retained as part of a longer-running interest in machine-learning research.",
      tags: ["Historical", "TensorFlow 1.x", "Flask", "Pattern recognition"]
    }
  ],
  education: [
    {
      institution: "AGH University of Krakow",
      program: "B.Eng. (Engineer), Computer Science",
      period: "2014–2019",
      detail: "Thesis: User identification based on signature dynamics"
    },
    {
      institution: "Jagiellonian University in Kraków",
      program: "Additional studies listed on LinkedIn",
      period: "2021–2025",
      detail: "The public profile lists attendance dates; program and degree are not specified."
    }
  ],
  certifications: [
    "Kotlin for Java Developers",
    "Parallel and Concurrent Programming with Java 1",
    "Reactive Java 9",
    "First Look: Java 10 and Java 11",
    "Building Your Team"
  ],
  principles: [
    {
      title: "Design for change",
      text: "Keep boundaries explicit and components replaceable. Prefer simple interfaces and clear ownership over abstractions that make the next change harder."
    },
    {
      title: "Make consistency explicit",
      text: "Define synchronization, ordering and consistency rules directly instead of relying on timing or incidental framework behavior."
    },
    {
      title: "Reproduce before you fix",
      text: "Understand and reproduce behavior before changing it — whether debugging a distributed service, profiling native code or reverse-engineering an undocumented binary."
    },
    {
      title: "Make changes measurable",
      text: "Use automated tests, end-to-end validation and performance benchmarks to turn refactoring from guesswork into a controlled engineering process."
    },
    {
      title: "Go below the framework",
      text: "Bytecode experiments, native code and reverse engineering are useful tools when abstractions stop explaining the system."
    }
  ],
  taxonomy: [
    "Backend / JVM",
    "Cloud / Integration",
    "JVM internals",
    "Systems / Native",
    "Reverse engineering",
    "Simulation / Game tech",
    "ML / Research experiments"
  ]
};