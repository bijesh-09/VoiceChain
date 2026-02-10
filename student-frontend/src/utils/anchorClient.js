import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../student_voice.json';
import { Buffer } from 'buffer';

//this file contains the methods that will be used in hooks

//idl: represents the instructions and accoutns defined in the program deployed on chain, in a json strucutre 
console.log('IDL loaded:', idl); // DEBUG: Check if IDL is actually loaded
const idlAddress = idl.address ?? idl.metadata?.address;

if (!idlAddress) {
  throw new Error('IDL address is missing. Ensure the frontend IDL is up to date.');
}

export const PROGRAM_ID = new PublicKey(idlAddress);//get the program_id using idl


//provider is the current user wallet and connection to the solana network, it is used to send transactions and interact with the program
//connection: simply a gateway for frontend to talk with solana devnet's node(program deployed on chain)
export const getProvider = (wallet, connection) =>
  new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });

//program is the client side instance of the on chain profram, it is obtained using idl, programid and provider so that the instance of program is available to the current user to interact with all the fns of the on chaain porgram
export const getProgram = (wallet, connection) => {
  const provider = getProvider(wallet, connection);
  return new anchor.Program(idl, PROGRAM_ID, provider);
};

//PDAs are simply the addresses of the accounts defined in onchain proram
//platformpda is derived from the seed "platform" and the program id, same logic as in lib.rs 
export const getPlatformPDA = () => {
  return PublicKey.findProgramAddressSync([Buffer.from('platform')], PROGRAM_ID);
};

//seedbuffer represents the petition id in buffer format
export const getPetitionPDA = (petitionId) => {
  const seed = anchor.BN.isBN(petitionId) ? petitionId : new anchor.BN(petitionId);
  const seedBuffer = seed.toArrayLike(Buffer, 'le', 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('petition'), seedBuffer],
    PROGRAM_ID
  );
};

//signaturepda is derived from the seed "signature", petitionpda and signer public key, same logic as in lib.rs
export const getSignaturePDA = (petitionPDA, signerPublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('signature'),
      petitionPDA.toBuffer(),
      signerPublicKey.toBuffer(),
    ],
    PROGRAM_ID
  );
};
