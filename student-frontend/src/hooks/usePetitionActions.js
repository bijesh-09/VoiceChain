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
      .createPetition(title, description)
      .accounts({
        creator: wallet.publicKey,
        petition: petitionPDA,
        platform: platformPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  const signPetition = async (petition) => {
    const program = getProgram(wallet, connection);
    const petitionPDA = petition.address;

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

  return { createPetition, signPetition, closePetition };
};
