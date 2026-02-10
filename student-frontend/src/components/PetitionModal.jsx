import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import ConfirmSignModal from './ConfirmSignModal';
import ClosePetitionConfirmModal from './ClosePetitionConfirmModal';
import SignerDetailModal from './SignerDetailModal';
import { useSignatureCheck } from '../hooks/useSignatureCheck';
import { getProgram } from '../utils/anchorClient';

const toBase58 = (value) => {
  if (!value) return '';
  if (typeof value.toBase58 === 'function') return value.toBase58();
  return String(value);
};

const shortenAddress = (address) => {
  if (!address) return '—';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value.toNumber === 'function') return value.toNumber();
  return Number(value);
};

const formatSignedAt = (value) => {
  const ts = toNumber(value);
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleString();
};

export default function PetitionModal({
  petition,
  walletAddress,
  onClose,
  onSign,
  onClosePetition,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [signing, setSigning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [justSigned, setJustSigned] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [signaturesLoading, setSignaturesLoading] = useState(false);
  const [signaturesError, setSignaturesError] = useState(null);
  const [selectedSigner, setSelectedSigner] = useState(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  const { hasSigned, checking, recheck } = useSignatureCheck(petition.address);

  const creatorAddress = toBase58(petition.creator);
  const isCreator = creatorAddress === walletAddress;
  const isClosed = petition.isClosed;
  const isSigned = hasSigned || justSigned;

  const fetchSignatures = useCallback(async () => {
    if (!wallet.publicKey || !petition.address) {
      setSignatures([]);
      return;
    }

    setSignaturesLoading(true);
    setSignaturesError(null);

    try {
      const program = getProgram(wallet, connection);
      const signatureAccountClient = program.account?.signature;

      if (!signatureAccountClient?.all) {
        setSignatures([]);
        return;
      }

      const signatureAccounts = await signatureAccountClient.all([
        {
          memcmp: {
            // Signature account: discriminator (8) + signer (32) = 40 bytes before current_petition
            offset: 40,
            bytes: petition.address.toBase58(),
          },
        },
      ]);

      const mappedSignatures = signatureAccounts
        .map((item) => ({
          signer: toBase58(item.account.signer),
          signedAt: item.account.signedAt ?? item.account.signed_at,
        }))
        .sort((a, b) => toNumber(b.signedAt) - toNumber(a.signedAt));

      setSignatures(mappedSignatures);
    } catch (error) {
      console.error('Error fetching signature list:', error);
      setSignaturesError('Could not load signature list right now.');
      setSignatures([]);
    } finally {
      setSignaturesLoading(false);
    }
  }, [connection, petition.address, wallet]);

  useEffect(() => {
    fetchSignatures();
  }, [fetchSignatures]);

  const handleSignClick = () => {
    if (!isSigned && !isClosed) {
      setShowConfirm(true);
    }
  };

  const handleConfirmSign = async () => {
    setShowConfirm(false);
    setSigning(true);
    try {
      await onSign(petition);
      await recheck();
      setJustSigned(true);
      await fetchSignatures();
    } finally {
      setSigning(false);
    }
  };

  const handleCloseClick = () => {
    setShowCloseConfirm(true);
  };

  const handleConfirmClose = async () => {
    setShowCloseConfirm(false);
    setClosing(true);
    try {
      await onClosePetition(petition);
    } finally {
      setClosing(false);
    }
  };

  const visibleSignatures = useMemo(() => signatures.slice(0, 20), [signatures]);
  const hiddenSignaturesCount = Math.max(signatures.length - visibleSignatures.length, 0);

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white pr-4">{petition.title}</h2>
            <div className="flex items-center gap-3">
              {isCreator && !isClosed && (
                <button
                  onClick={handleCloseClick}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-all"
                >
                  {closing ? 'Closing...' : 'Close Petition'}
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
              Created by{' '}
              <button
                type="button"
                onClick={() => setSelectedSigner({ signer: creatorAddress, signedAt: null })}
                className="text-teal-400 hover:text-teal-300 transition-colors"
              >
                {shortenAddress(creatorAddress)}
              </button>{' '}
              on {petition.createdDate}
            </div>

            {isClosed && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-semibold">
                  This petition has been closed by the creator.
                </p>
              </div>
            )}

            <div className="text-lg font-semibold text-teal-400">
              {petition.signatureCount} signatures
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400 font-medium">Recent signatures</div>

              {signaturesLoading && (
                <div className="text-sm text-gray-500">Loading signatures...</div>
              )}

              {!signaturesLoading && signaturesError && (
                <div className="text-sm text-red-400">{signaturesError}</div>
              )}

              {!signaturesLoading && !signaturesError && visibleSignatures.length === 0 && (
                <div className="text-sm text-gray-500">No signatures yet.</div>
              )}

              {!signaturesLoading && !signaturesError && visibleSignatures.length > 0 && (
                <div className="space-y-2">
                  {visibleSignatures.map((signature, index) => (
                    <button
                      key={`${signature.signer}-${index}`}
                      type="button"
                      onClick={() => setSelectedSigner(signature)}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 hover:border-teal-500/40 transition-colors"
                    >
                      <span className="text-sm text-gray-300">{shortenAddress(signature.signer)}</span>
                      <span className="text-xs text-gray-500">{formatSignedAt(signature.signedAt)}</span>
                    </button>
                  ))}

                  {hiddenSignaturesCount > 0 && (
                    <div className="text-xs text-gray-500">+{hiddenSignaturesCount} more...</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-t border-gray-700">
            <div className="text-xs text-yellow-400/80 mb-3">
              ⚠️ Your signature will be permanently recorded on Solana. This action cannot be undone.
            </div>
            <button
              onClick={handleSignClick}
              disabled={isSigned || signing || checking || isClosed}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
                isSigned
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-not-allowed'
                  : isClosed
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : signing
                  ? 'bg-teal-600/50 cursor-wait'
                  : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30'
              }`}
            >
              {isSigned ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Signed ✓
                </span>
              ) : isClosed ? (
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

      {showCloseConfirm && (
        <ClosePetitionConfirmModal
          onConfirm={handleConfirmClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      {selectedSigner && (
        <SignerDetailModal
          signerAddress={selectedSigner.signer}
          signedAt={selectedSigner.signedAt}
          onClose={() => setSelectedSigner(null)}
        />
      )}
    </>
  );
}
