import { X } from 'lucide-react';

export default function WalletSelectModal({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50">
      <div className="w-96 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Select Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelect('phantom')}
            className="w-full rounded-lg bg-gray-800/50 border border-gray-700 p-4 hover:bg-gray-700/50 hover:border-teal-500 transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-semibold">Phantom</span>
          </button>

          <button
            onClick={() => onSelect('solflare')}
            className="w-full rounded-lg bg-gray-800/50 border border-gray-700 p-4 hover:bg-gray-700/50 hover:border-teal-500 transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-semibold">Solflare</span>
          </button>
        </div>
      </div>
    </div>
  );
}
