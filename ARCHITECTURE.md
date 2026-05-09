smartpact/
├── Anchor.toml                     # Anchor workspace configuration
├── Cargo.toml                      # Workspace Cargo configuration
├── README.md                       # Main docs: deploy address, setup, LI.FI/ElevenLabs info
├── .gitignore                      # Git ignore file
│
├── programs/
│   └── smartpact/                  # The Solana Rust Program
│       ├── Cargo.toml              # Rust program dependencies
│       ├── Xargo.toml              # BPF compilation configuration
│       └── src/
│           ├── lib.rs              # Program entrypoint (declares the module)
│           ├── instructions/       # Instruction handlers
│           │   ├── mod.rs          
│           │   ├── create_pact.rs  # initialise PDA, transfer SOL to escrow
│           │   ├── accept_pact.rs  # set worker pubkey, state -> ACCEPTED
│           │   ├── confirm_pact.rs # release SOL to worker, state -> SETTLED
│           │   └── dispute_pact.rs # freeze escrow, state -> DISPUTED
│           ├── state/              # Account structures (PDAs)
│           │   ├── mod.rs
│           │   ├── pact.rs         # Pact state enum and data
│           │   ├── escrow.rs       # EscrowAccount PDA logic
│           │   ├── ledger.rs       # LedgerEntry PDA (SHA-256 hash chain)
│           │   └── reputation.rs   # Reputation Account PDA per user
│           ├── errors.rs           # Custom program errors (e.g., Unauthorized)
│           └── events.rs           # Program events (e.g., PactCreated, PactSettled)
│
├── tests/
│   └── smartpact.ts                # Anchor test suite (happy path, disputes, constraints)
│
└── app/                            # React + Vite Frontend (Mpilo & Tlhompho)
    ├── package.json                # Frontend dependencies
    ├── vite.config.ts              # Vite configuration
    ├── tailwind.config.js          # Tailwind CSS configuration
    ├── .env                        # Environment variables (VITE_ELEVENLABS_KEY)
    ├── public/                     
    └── src/
        ├── main.tsx                # React entry point
        ├── App.tsx                 # Main layout and React Router setup
        ├── components/             # Reusable UI components
        │   ├── layout/             
        │   │   └── Navbar.tsx      
        │   ├── ui/                 # Shared components
        │   │   ├── PactCard.tsx    
        │   │   ├── StatusBadge.tsx 
        │   │   └── LoadingSpinner.tsx
        │   ├── wallet/             
        │   │   └── WalletMultiButton.tsx # Phantom/Solflare connect
        │   └── integrations/
        │       ├── LifiWidget.tsx        # LI.FI cross-chain reward funding
        │       └── VoiceAgentButton.tsx  # ElevenLabs voice agent
        ├── pages/                  # Main route pages
        │   ├── Dashboard.tsx       # Open pacts, active jobs, completed pacts
        │   ├── CreatePact.tsx      # Form to trigger create_pact
        │   ├── PactDetail.tsx      # Escrow lock UI, state timeline, action buttons
        │   ├── Ledger.tsx          # Public transaction history with hash chain UI
        │   └── Profile.tsx         # User profile and reputation badge
        ├── context/                
        │   ├── WalletProvider.tsx  # Solana wallet adapter provider
        │   └── AnchorProvider.tsx  # Anchor program connection provider
        └── utils/                  
            ├── anchorClient.ts     # IDL loading and program method wrappers
            └── elevenLabsApi.ts    # TTS API integration logic