use anchor_lang::prelude::*;

declare_id!("9FtQSzVqHYN7zb5QsyoUNgNatUEvx1MqywwakwdJjTNp");

#[program]
pub mod temp_backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
