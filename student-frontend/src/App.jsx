import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import HomePage from './components/HomePage';
import WalletConnect from './components/WalletConnect';

const WALLET_NAME_MAP = {//object to map wallet types to their adapter names
  phantom: 'Phantom',
  solflare: 'Solflare',
};

function App() {
  const wallet = useWallet();//useWallet is a hook that we got from WalletProvider in main.jsx, it gives us access to the wallet state and functions like connect, disconnect, select etc
  //wallet is the connected wallet that user selected

  const handleConnect = useCallback(//useCallback prevents recreating FUNCTIONS on every render, so the function is only created once and its reference is the same on every render, this is good for performance and also prevents unnecessary re-renders of child components that depend on this function
    async (walletType) => {//walletType is passed from the WalletConnectjsx when user selects a wallet adaapter
      const walletName = WALLET_NAME_MAP[walletType];//map the walletType to its adapter name
      if (!walletName) return;//if walletType is not in the map, return
      wallet.select(walletName);//here happens the real mapping of walletType to corressponding walletAdapter
      await wallet.connect();//pops up the wallet adapter extension
    },
    [wallet]//this is the function"useWallet()" that is created only once by the useCallback
  );

  const handleDisconnect = useCallback(async () => {
    await wallet.disconnect();
  }, [wallet]);
  //up to here only defining the functions to connect and disconnect wallet, the actual connection logic is handled by the wallet adapter and the useWallet hook


  if (!wallet.connected) {//if wallet isnt connected, display walletconnect component
    return <WalletConnect onConnect={handleConnect} />;
  }

  return (
    <HomePage
      walletAddress={wallet.publicKey?.toBase58() ?? ''}//passing connected wallet addr to the homepage ui
      onDisconnect={handleDisconnect}
    />
  );
}

export default App;
