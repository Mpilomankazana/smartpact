use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("4k4btq9LN1e2cCGepBA2yFEmm4U8t2Wa1E3t92BpcbUs");

#[program]
pub mod smartpact {
    use super::*;

    // ── Issue #4 ─────────────────────────────────────────────
    pub fn create_pact(
        ctx: Context<CreatePact>,
        title: String,
        description: String,
        reward: u64,
        deadline: i64,
    ) -> Result<()> {
        let clock = Clock::get()?;

        require!(reward > 0, SmartPactError::RewardMustBePositive);
        require!(deadline > clock.unix_timestamp, SmartPactError::DeadlineMustBeInFuture);
        require!(title.len() <= 64, SmartPactError::TitleTooLong);
        require!(description.len() <= 256, SmartPactError::DescriptionTooLong);

        // Lock SOL into escrow PDA
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.poster.to_account_info(),
                    to:   ctx.accounts.escrow.to_account_info(),
                },
            ),
            reward,
        )?;

        let pact        = &mut ctx.accounts.pact;
        pact.poster      = ctx.accounts.poster.key();
        pact.worker      = None;
        pact.title       = title.clone();
        pact.description = description;
        pact.reward      = reward;
        pact.deadline    = deadline;
        pact.state       = PactState::Open;
        pact.created_at  = clock.unix_timestamp;
        pact.bump        = ctx.bumps.pact;

        // Ledger: record creation (Issue #6)head -5 programs/smartpact/src/lib.rs
        let entry       = &mut ctx.accounts.ledger_entry;
        entry.pact      = pact.key();
        entry.action    = LedgerAction::Created;
        entry.actor     = ctx.accounts.poster.key();
        entry.timestamp = clock.unix_timestamp;
        entry.prev_hash = [0u8; 32];
        entry.seq       = 0;
        entry.bump      = ctx.bumps.ledger_entry;

        emit!(PactCreated {
            pact:     pact.key(),
            poster:   pact.poster,
            title,
            reward,
            deadline,
        });

        Ok(())
    }

    // ── Issue #5 ─────────────────────────────────────────────
    pub fn accept_pact(ctx: Context<AcceptPact>, seq: u64) -> Result<()> {
        let clock = Clock::get()?;

        let pact = &mut ctx.accounts.pact;
        require!(pact.state == PactState::Open, SmartPactError::InvalidState);
        require!(
            ctx.accounts.worker.key() != pact.poster,
            SmartPactError::PosterCannotBeWorker
        );

        pact.worker = Some(ctx.accounts.worker.key());
        pact.state  = PactState::Accepted;

        let entry       = &mut ctx.accounts.ledger_entry;
        entry.pact      = pact.key();
        entry.action    = LedgerAction::Accepted;
        entry.actor     = ctx.accounts.worker.key();
        entry.timestamp = clock.unix_timestamp;
        entry.prev_hash = ctx.accounts.prev_entry.prev_hash; // simplified hash chain
        entry.seq       = seq;
        entry.bump      = ctx.bumps.ledger_entry;

        emit!(PactAccepted {
            pact:   pact.key(),
            worker: ctx.accounts.worker.key(),
        });

        Ok(())
    }
}

// ── Accounts ──────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreatePact<'info> {
    #[account(mut)]
    pub poster: Signer<'info>,

    // Issue #2 — Pact PDA
    #[account(
        init,
        payer = poster,
        space = Pact::LEN,
        seeds = [b"pact", poster.key().as_ref(), title.as_bytes()],
        bump,
    )]
    pub pact: Account<'info, Pact>,

    // Issue #3 — Escrow PDA (raw lamport vault)
    #[account(
        mut,
        seeds = [b"escrow", poster.key().as_ref(), title.as_bytes()],
        bump,
    )]
    /// CHECK: raw lamport escrow, no data stored
    pub escrow: UncheckedAccount<'info>,

    // Issue #6 — first LedgerEntry for this pact
    #[account(
        init,
        payer = poster,
        space = LedgerEntry::LEN,
        seeds = [b"ledger", pact.key().as_ref(), &0u64.to_le_bytes()],
        bump,
    )]
    pub ledger_entry: Account<'info, LedgerEntry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seq: u64)]
pub struct AcceptPact<'info> {
    #[account(mut)]
    pub worker: Signer<'info>,

    #[account(
        mut,
        seeds = [b"pact", pact.poster.as_ref(), pact.title.as_bytes()],
        bump = pact.bump,
    )]
    pub pact: Account<'info, Pact>,

    #[account(
        init,
        payer = worker,
        space = LedgerEntry::LEN,
        seeds = [b"ledger", pact.key().as_ref(), &seq.to_le_bytes()],
        bump,
    )]
    pub ledger_entry: Account<'info, LedgerEntry>,

    /// Previous ledger entry for hash chaining
    pub prev_entry: Account<'info, LedgerEntry>,

    pub system_program: Program<'info, System>,
}

// ── State ─────────────────────────────────────────────────────

// Issue #2
#[account]
pub struct Pact {
    pub poster:      Pubkey,         // 32
    pub worker:      Option<Pubkey>, // 33
    pub title:       String,         // 4 + 64
    pub description: String,         // 4 + 256
    pub reward:      u64,            // 8
    pub deadline:    i64,            // 8
    pub state:       PactState,      // 1
    pub created_at:  i64,            // 8
    pub bump:        u8,             // 1
}

impl Pact {
    pub const LEN: usize = 8 + 32 + 33 + (4+64) + (4+256) + 8 + 8 + 1 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PactState {
    Open,
    Accepted,
    Completed,
    Settled,
    Disputed,
}

// Issue #6
#[account]
pub struct LedgerEntry {
    pub pact:      Pubkey,        // 32
    pub action:    LedgerAction,  // 1
    pub actor:     Pubkey,        // 32
    pub timestamp: i64,           // 8
    pub prev_hash: [u8; 32],      // 32
    pub seq:       u64,           // 8
    pub bump:      u8,            // 1
}

impl LedgerEntry {
    pub const LEN: usize = 8 + 32 + 1 + 32 + 8 + 32 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LedgerAction {
    Created,
    Accepted,
    Completed,
    Settled,
    Disputed,
}

// ── Events ────────────────────────────────────────────────────

#[event]
pub struct PactCreated {
    pub pact:     Pubkey,
    pub poster:   Pubkey,
    pub title:    String,
    pub reward:   u64,
    pub deadline: i64,
}

#[event]
pub struct PactAccepted {
    pub pact:   Pubkey,
    pub worker: Pubkey,
}

// ── Errors ────────────────────────────────────────────────────

#[error_code]
pub enum SmartPactError {
    #[msg("Reward must be greater than 0")]
    RewardMustBePositive,
    #[msg("Deadline must be in the future")]
    DeadlineMustBeInFuture,
    #[msg("Title exceeds 64 characters")]
    TitleTooLong,
    #[msg("Description exceeds 256 characters")]
    DescriptionTooLong,
    #[msg("Pact is not in the required state for this action")]
    InvalidState,
    #[msg("Poster cannot be the worker")]
    PosterCannotBeWorker,
}