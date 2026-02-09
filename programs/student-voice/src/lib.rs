use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("2W5dbkzx4H6iLLeXH1syvmjHusFnQHbL9tbjQ6VGVB4j");

#[program]
pub mod student_voice {
    use super::*;//imports all the modules of the parent module which is rn the whole program module, to this scope 

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.admin_address = ctx.accounts.admin.key();
        platform.total_petitions = 0;
        platform.created_at = Clock::get()?.unix_timestamp as u64;
        msg!("Platform initialized with admin: {}", platform.admin_address);
        Ok(())
    }

    //the contexts in the fn arg defines the account's address, simply the accounts that this fn is gonna need
    //later on we provide the pda of accounts to the fns in frontend that maps to these onchain fns, so that we can fetch the account through rpc
    pub fn create_petition(ctx: Context<CreatePetition>, title: String, description: String) -> Result<()> {
        require!(title.len() > 0 && title.len() <= 200, ErrorCode::InvalidTitle);
        require!(description.len() > 0 && description.len() <= 5000, ErrorCode::InvalidDescription);

        let petition = &mut ctx.accounts.petition;
        let platform = &mut ctx.accounts.platform;
        let seed = platform.total_petitions;

        petition.id = seed;
        petition.seed = seed;
        petition.creator = ctx.accounts.creator.key();
        petition.title = title;
        petition.description = description;
        petition.signature_count = 0;
        petition.created_at = Clock::get()?.unix_timestamp as u64;
        petition.is_active = true;

        platform.total_petitions += 1;
        msg!("Petition created with id: {}", petition.id);
        Ok(())
    }

    pub fn sign_petition(ctx: Context<SignPetition>) -> Result<()> {
        require!(ctx.accounts.petition.is_active, ErrorCode::PetitionNotActive);
        let petition = &mut ctx.accounts.petition;
        let signature = &mut ctx.accounts.signature;

        signature.signer = ctx.accounts.signer.key();
        signature.current_petition = petition.key();
        signature.signed_at = Clock::get()?.unix_timestamp as u64;
        petition.signature_count += 1;

        msg!(
            "Petition signed! Petition: {}, Signer: {}, Total signatures: {}", 
            petition.title,
            signature.signer,
            petition.signature_count
        );
        Ok(())
    }

    pub fn close_petition(ctx: Context<ClosePetition>) -> Result<()> {
        let petition = &mut ctx.accounts.petition;
        let platform = &ctx.accounts.platform;
        let authority = &ctx.accounts.authority;
        
        require!(authority.key() == petition.creator || authority.key() == platform.admin_address, ErrorCode::Unauthorized);
        petition.is_active = false;
        msg!("Petition closed! Petition: {}, Closed by: {}", petition.title, authority.key());
        Ok(())
    }
}

//defininf the data fields of accounts
//only one account struct can be defined under one #[account] macro, same goes for derived account macro
#[account]
pub struct Platform {
    pub admin_address: Pubkey,
    pub total_petitions: u64,
    pub created_at: u64,
}

impl Platform {
    pub const LEN: usize = 8 + 32 + 8 + 8;
}

#[account]
pub struct Petition {
    pub id: u64,
    pub seed: u64,
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub signature_count: u64,
    pub created_at: u64,
    pub is_active: bool,
}

impl Petition {
    pub const LEN: usize = 8 + 8 + 8 + 32 + (4 + 200) + (4 + 5000) + 8 + 8 + 1;
}

#[account]
pub struct Signature {
    pub signer: Pubkey,
    pub current_petition: Pubkey,
    pub signed_at: u64,
}

impl Signature {
    pub const LEN: usize = 8 + 32 + 32 + 8;
}
#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,//admin is the signer when init platform, and is mutable, cuz signging transaction costs sol, or lamports modification
    pub system_program: Program<'info, System>,//this is not mutable, cuz only one acc under #account macro
    #[account(init, payer = admin, space = Platform::LEN, seeds = [b"platform"], bump)]//constants like Platform::LEN are available in all scopes
    pub platform: Account<'info, Platform>,//creating platform account with the "platform" seed
}

#[derive(Accounts)]
pub struct CreatePetition<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    // needed "petition" as well as total_petitions to make current petition unique
    #[account(init, payer = creator, space = Petition::LEN, seeds = [b"petition", platform.total_petitions.to_le_bytes().as_ref()], bump)]
    pub petition: Account<'info, Petition>,
    #[account(mut, seeds = [b"platform"], bump)]
    pub platform: Account<'info, Platform>,//needed platform account to incrememnt total petitions later on in the fn
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SignPetition<'info> {
    #[account(
        mut,
        seeds = [b"petition", petition.seed.to_le_bytes().as_ref()],
        bump
    )]
    pub petition: Account<'info, Petition>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = Signature::LEN,
        seeds = [
            b"signature",//needed petition address, and signer address to make each signature unique
            petition.key().as_ref(),
            signer.key().as_ref()
        ],
        bump
    )]
    pub signature: Account<'info, Signature>,//signature account represents a unique signature
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClosePetition<'info> {
    #[account(
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,//if authority is admin
    #[account(
        mut,
        seeds = [b"petition", petition.seed.to_le_bytes().as_ref()],
        bump
    )]
    pub petition: Account<'info, Petition>,//if authority is creator
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Title must be between 1 and 200 characters")]
    InvalidTitle,
    #[msg("Description must be between 1 and 5000 characters")]
    InvalidDescription,
    #[msg("This petition is no longer accepting signatures")]
    PetitionNotActive,
    #[msg("You don't have permission to perform this action")]
    Unauthorized,
}