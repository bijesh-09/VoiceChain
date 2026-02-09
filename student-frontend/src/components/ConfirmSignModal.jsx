import { AlertTriangle } from 'lucide-react';

export default function ConfirmSignModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="w-96 bg-gray-900 border border-orange-500/30 rounded-xl p-6 shadow-xl shadow-orange-500/20">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Confirm Signature</h3>
          <p className="text-sm text-gray-300 mb-6">
            Your signature will be permanently recorded on Solana. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
