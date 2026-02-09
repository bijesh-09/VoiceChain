import { useState } from 'react';
import WalletSelectModal from './WalletSelectModal';

export default function WalletConnect({ onConnect }) {
  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = () => {
    setShowModal(true);
  };

  const handleWalletSelect = (walletType) => {
    setShowModal(false);
    onConnect(walletType);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative">
      <div className="text-center px-4">
        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4">
          Make Your Voice Heard
        </h1>
        <p className="text-lg text-gray-400 mt-4 mb-8">
          Petitions on-chain. Signatures that can't be erased.
        </p>
        <button
          onClick={handleConnectClick}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg shadow-teal-500/50 hover:shadow-xl hover:shadow-teal-500/70 transition-all duration-200"
        >
          Connect Wallet
        </button>
      </div>

      <div className="absolute bottom-8 text-sm text-gray-500">
        Powered by Solana Devnet
      </div>

      {showModal && (
        <WalletSelectModal
          onSelect={handleWalletSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
