import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import ConfirmSignModal from './ConfirmSignModal';

export default function PetitionModal({ petition, walletAddress, onClose, onSign, onClosePetition }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [signing, setSigning] = useState(false);

  const hasSigned = petition.signers.includes(walletAddress);
  const isCreator = petition.creator === walletAddress;
  const displayedSigners = petition.signers.slice(0, 20);
  const remainingSigners = petition.signatures - displayedSigners.length;

  const handleSignClick = () => {
    if (!hasSigned && !petition.isClosed) {
      setShowConfirm(true);
    }
  };

  const handleConfirmSign = async () => {
    setShowConfirm(false);
    setSigning(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSign(petition.id);
    setSigning(false);
  };

  const handleCloseClick = () => {
    if (window.confirm('Are you sure you want to close this petition? This action cannot be undone.')) {
      onClosePetition(petition.id);
    }
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white pr-4">{petition.title}</h2>
            <div className="flex items-center gap-3">
              {isCreator && !petition.isClosed && (
                <button
                  onClick={handleCloseClick}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-all"
                >
                  Close Petition
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
            <p className="text-base text-gray-300 leading-relaxed" style={{ lineHeight: '1.6' }}>
              {petition.description}
            </p>

            <div className="text-sm text-gray-500">
              Created by {petition.creator} on {petition.createdDate}
            </div>

            {petition.isClosed && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-semibold">This petition has been closed by the creator.</p>
              </div>
            )}

            <div className="text-lg font-semibold text-teal-400">
              {petition.signatures} signatures
            </div>

            {/* Signers Section */}
            {petition.signers.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Signatures</h3>
                <div className="grid grid-cols-2 gap-2">
                  {displayedSigners.map((signer, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 px-3 py-2 rounded-lg text-sm text-gray-400 font-mono"
                    >
                      {signer}
                    </div>
                  ))}
                </div>
                {remainingSigners > 0 && (
                  <div className="text-sm text-gray-500 mt-2 text-center">
                    + {remainingSigners} more
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-t border-gray-700">
            <div className="text-xs text-yellow-400/80 mb-3">
              ⚠️ Your signature will be permanently recorded on Solana. This action cannot be undone.
            </div>
            <button
              onClick={handleSignClick}
              disabled={hasSigned || signing || petition.isClosed}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
                hasSigned
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-not-allowed'
                  : petition.isClosed
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : signing
                  ? 'bg-teal-600/50 cursor-wait'
                  : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30'
              }`}
            >
              {hasSigned ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Signed ✓
                </span>
              ) : petition.isClosed ? (
                'Petition Closed'
              ) : signing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing...
                </span>
              ) : (
                'Sign Petition'
              )}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmSignModal
          onConfirm={handleConfirmSign}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
