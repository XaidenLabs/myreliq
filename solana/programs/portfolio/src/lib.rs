use anchor_lang::prelude::*;

declare_id!("PorFwoRk1111111111111111111111111111111111Por");

#[program]
pub mod portfolio {
    use super::*;

    pub fn publish_portfolio(
        ctx: Context<PublishPortfolio>,
        version: u64,
        hash: [u8; 32],
    ) -> Result<()> {
        let record = &mut ctx.accounts.portfolio_record;
        record.authority = ctx.accounts.authority.key();
        record.version = version;
        record.hash = hash;
        record.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn register_issuer(ctx: Context<RegisterIssuer>, name: String) -> Result<()> {
        require!(name.len() <= 64, PortfolioError::NameTooLong);
        let issuer = &mut ctx.accounts.issuer;
        issuer.authority = ctx.accounts.authority.key();
        issuer.name = name;
        issuer.bump = ctx.bumps["issuer"];
        Ok(())
    }

    pub fn issue_credential(
        ctx: Context<IssueCredential>,
        student: Pubkey,
        reference: [u8; 32],
    ) -> Result<()> {
        let credential = &mut ctx.accounts.credential;
        credential.issuer = ctx.accounts.issuer.key();
        credential.student = student;
        credential.reference = reference;
        credential.issued_at = Clock::get()?.unix_timestamp;
        credential.bump = ctx.bumps["credential"];
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(version: u64)]
pub struct PublishPortfolio<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + PortfolioRecord::SIZE,
        seeds = [b"portfolio", authority.key().as_ref(), &version.to_le_bytes()],
        bump
    )]
    pub portfolio_record: Account<'info, PortfolioRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterIssuer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Issuer::SIZE,
        seeds = [b"issuer", authority.key().as_ref()],
        bump
    )]
    pub issuer: Account<'info, Issuer>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(student: Pubkey, reference: [u8; 32])]
pub struct IssueCredential<'info> {
    #[account(mut, has_one = authority)]
    pub issuer: Account<'info, Issuer>,
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Credential::SIZE,
        seeds = [
            b"credential",
            issuer.key().as_ref(),
            student.as_ref(),
            &reference
        ],
        bump
    )]
    pub credential: Account<'info, Credential>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PortfolioRecord {
    pub authority: Pubkey,
    pub version: u64,
    pub hash: [u8; 32],
    pub updated_at: i64,
}

impl PortfolioRecord {
    pub const SIZE: usize = 32 + 8 + 32 + 8;
}

#[account]
pub struct Issuer {
    pub authority: Pubkey,
    pub name: String,
    pub bump: u8,
}

impl Issuer {
    pub const SIZE: usize = 32 + 4 + 64 + 1;
}

#[account]
pub struct Credential {
    pub issuer: Pubkey,
    pub student: Pubkey,
    pub reference: [u8; 32],
    pub issued_at: i64,
    pub bump: u8,
}

impl Credential {
    pub const SIZE: usize = 32 + 32 + 32 + 8 + 1;
}

#[error_code]
pub enum PortfolioError {
    #[msg("Issuer name exceeds 64 characters")]
    NameTooLong,
}
