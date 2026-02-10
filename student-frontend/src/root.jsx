import { StrictMode, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

import './index.css';
import App from './App.jsx';

export const Root = () => {
    //usememo is used to prevent recreating OBJECTS on every render so that the rpc, and walletadapters wont change everytime it is created
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);//endpoint is a string that holds the solana devnet cluster api irl
    const wallets = useMemo(//here ()=>[] return array of wallet adapter objects, [] means the objects are created only once
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network: 'devnet' }),
        ],
        []
    );

    return (
        <StrictMode>
            {/* endpoint is passed to connection provider to connect to solana devnet */}
            <ConnectionProvider endpoint={endpoint}>
                {/* wallets is the wallet adapter that user will connect, autoConnect means if user had connected beoforre, it will auto connect */}
                <WalletProvider wallets={wallets} autoConnect>
                    {/* wallet modal ui provided by solana */}
                    <WalletModalProvider>
                        <App />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </StrictMode>
    );
};
