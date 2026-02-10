import { useState } from 'react';
import { Copy, ExternalLink, X } from 'lucide-react';

const formatSignedAt = (value) => {
  if (!value) return '—';

  const parsedValue = typeof value?.toNumber === 'function' ? value.toNumber() : Number(value);
  if (!parsedValue) return '—';

  return new Date(parsedValue * 1000).toLocaleString();
};

export default function SignerDetailModal({ signerAddress, signedAt, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!signerAddress) return;

    try {
      await navigator.clipboard.writeText(signerAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const explorerUrl = signerAddress
    ? `https://explorer.solana.com/address/${signerAddress}?cluster=devnet`
    : '#';

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <h3 className="text-xl font-bold text-white">Signer Details</h3>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-400">Wallet Address</p>
            <div className="rounded-lg border border-gray-700 bg-black/40 p-3 break-all text-sm text-gray-200">
              {signerAddress || '—'}
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy address'}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-400">Signed At</p>
            <div className="rounded-lg border border-gray-700 bg-black/40 p-3 text-sm text-gray-200">
              {formatSignedAt(signedAt)}
            </div>
          </div>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View wallet on Solana Explorer
          </a>
        </div>
      </div>
    </div>
  );
}
