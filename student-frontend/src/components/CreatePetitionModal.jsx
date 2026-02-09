import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function CreatePetitionModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;

    setCreating(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    onCreate({
      title: title.trim(),
      description: description.trim()
    });

    setCreating(false);
  };

  const canCreate = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create New Petition</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Title</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                placeholder="Enter petition title..."
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-full outline-none transition-colors"
                maxLength={200}
              />
              <div className="absolute right-3 top-3 text-xs text-gray-500">
                {title.length} / 200
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Description</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
                placeholder="Describe your petition in detail..."
                rows={6}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-full outline-none transition-colors resize-none"
                maxLength={5000}
              />
              <div className="absolute right-3 top-3 text-xs text-gray-500">
                {description.length} / 5000
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
            <p className="text-sm text-teal-400">
              ℹ️ Your petition will be permanently stored on-chain and cannot be edited after creation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/90 backdrop-blur-lg px-6 py-4 border-t border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate || creating}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              !canCreate || creating
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {creating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </span>
            ) : (
              'Create Petition'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
