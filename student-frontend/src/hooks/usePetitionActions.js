import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { getProgram, getPlatformPDA, getPetitionPDA, getSignaturePDA } from '../utils/anchorClient';

export const usePetitionActions = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createPetition = async (title, description) => {
    const program = getProgram(wallet, connection);
    const [platformPDA] = getPlatformPDA();
    
    const platform = await program.account.platform.fetch(platformPDA);
    const petitionId = platform.totalPetitions.toNumber();

    const [petitionPDA] = getPetitionPDA(petitionId);

    await program.methods
      .createPetition(title, description)//here this createPetition is not the "reatePetition = async (title, description)" we defined above, rather it maps to the create_petition fn in onchain program, the name of this fn can be anything here
      .accounts({//assigning addresses to the accounts to create petition under given accounts , which can only be done by talking fronend ot backend using rpc
        creator: wallet.publicKey,
        petition: petitionPDA,
        platform: platformPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  const signPetition = async (petition) => {
    const program = getProgram(wallet, connection);
    const petitionPDA = petition.address;//here the petition.address represents the pda of current petition, where the address key was assigned with pda looping thorugh total_petitions, beofre when fethcPetitions() called by usePetitions.js

    const [signaturePDA] = getSignaturePDA(petitionPDA, wallet.publicKey);

    await program.methods
      .signPetition()
      .accounts({
        petition: petitionPDA,
        signer: wallet.publicKey,
        signature: signaturePDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  const closePetition = async (petition) => {
    const program = getProgram(wallet, connection);
    const [platformPDA] = getPlatformPDA();
    const petitionPDA = petition.address;

    await program.methods
      .closePetition()
      .accounts({
        platform: platformPDA,
        petition: petitionPDA,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  return { createPetition, signPetition, closePetition }; //can be later destructured in components
};
