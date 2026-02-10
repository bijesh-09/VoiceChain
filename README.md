# VoiceChain
### Student petitions. On-chain. Permanent.
**Submitted to Superteam Nepal University Tour Mini-Hack**

## The Problem
In many Nepal colleges, student petitions are usually run through Google Forms or paper sheets. These systems are easy to ignore, easy to manipulate, and hard to verify. There is no cryptographic proof that a signer is real, no tamper-proof history, and no transparent way for students to confirm whether their voice was actually recorded.

## The Solution
VoiceChain is a decentralized student petition platform built on Solana Devnet. Students connect their wallet (Phantom or Solflare), create petitions, and sign them on-chain. Every signature is a permanent, publicly verifiable blockchain record that cannot be silently edited, faked, or deleted.

## Live Demo
> LiveWebsite url: [link]  
> Demo video: [link]  
> Program on Solana Explorer: https://explorer.solana.com/address/2W5dbkzx4H6iLLeXH1syvmjHusFnQHbL9tbjQ6VGVB4j?cluster=devnet

## Features
- Wallet connection (Phantom + Solflare)
- View all petitions fetched from on-chain (newest first)
- Create petition via modal with character limits and validation
- Sign petition with wallet transaction confirmation
- `Signed ✓` state when user already signed (checked via signature PDA)
- Confirmation modal before signing (“permanent and cannot be undone”)
- Close petition action (visible for creator; authorized rules enforced on-chain)
- Recent signer list in petition modal (up to 20 shown)
- Click signer wallet to view full address + open Solana Explorer link
- Platform initialization UI if platform is not initialized
- About page with architecture overview
- Smooth page transitions between Home and About views

## How It Works
A wallet acts as the user identity. When a user creates or signs a petition, they approve a blockchain transaction. The Anchor program writes petition and signature data into deterministic PDA accounts. Signature PDAs are unique per `(petition, signer)` pair, so protocol-level double signing is prevented. Because all state is on Solana, anyone can independently verify records on Solana Explorer.

## Architecture
```text
[User Wallet]
     |
     v
[React Frontend]
     |
     v
[Anchor Program on Solana Devnet]
     |
     +--> [Platform PDA]
     +--> [Petition PDA Accounts]
     +--> [Signature PDA Accounts]
```

VoiceChain uses three core account types. `Platform` is a singleton that stores admin address and total petition count. `Petition` stores petition metadata (title, description, creator, count, timestamp, active status). `Signature` stores signer, petition reference, and signed timestamp. PDA seeds guarantee deterministic addresses and prevent duplicate signature entries for the same signer/petition pair.

## Tech Stack
| Layer | Technology |
|---|---|
| Blockchain Network | Solana Devnet |
| Smart Contract | Anchor (Rust) |
| Frontend | React + Vite + JavaScript |
| Styling | Tailwind CSS v4 |
| Wallet Integration | `@solana/wallet-adapter-react` (Phantom / Solflare) |
| Blockchain Client | `@coral-xyz/anchor`, `@solana/web3.js` |

## Local Setup
### Prerequisites
- Node.js v18+
- Yarn
- Phantom or Solflare browser extension
- Wallet network set to **Solana Devnet**
- Devnet SOL in wallet (faucet: https://faucet.solana.com)

### If you want to run locally
```bash
git clone https://github.com/bijesh-09/VoiceChain.git
cd student-voice/student-frontend
npm install
npm run dev
```

Then open: `http://localhost:5173`  
Connect wallet (Devnet) and start using the app.

> Note: The Anchor program is already deployed to Devnet. You do **not** need to build/deploy the Rust program locally to use the frontend.

### Otherwise 
Visit:
```bash

```
Connect your wallet(Phantom or Solflare) on Devnet mode and start using the app.

## Project Structure
```text
student-voice/
├── programs/student-voice/src/lib.rs   # Anchor on-chain program logic
├── Anchor.toml                         # Anchor workspace + cluster config
├── student-frontend/
│   ├── src/
│   │   ├── components/                # React UI components (modals, pages, navbar, cards)
│   │   ├── hooks/                     # Data/action hooks for petitions, signatures, platform init
│   │   ├── utils/                     # anchorClient.js (program client + PDA derivation)
│   │   ├── App.jsx                    # Top-level app wallet-gated UI switch
│   │   ├── root.jsx                   # Wallet provider setup
│   │   └── main.jsx                   # React app bootstrap
│   └── package.json                   # Frontend dependencies + scripts
```

## Why Solana
VoiceChain needs trustless, verifiable records for student participation. A centralized server can be altered, hidden, or taken down, while on-chain data is durable and auditable. Wallet signatures provide cryptographic proof of participation tied to real transactions. Solana makes this practical for student use with fast confirmations and low fees on Devnet.

## About the Builder
[Bijesh Karanjit] — CS student at Samriddhi College, Nepal.  
Built solo for the Superteam Nepal University Tour Mini-Hack.
