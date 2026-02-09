import { Users } from 'lucide-react';

export default function PetitionCard({ petition, onClick }) {
  const getPreview = (text) => {
    if (!text) return '';
    if (text.length <= 120) return text;
    return text.substring(0, 120) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-200 cursor-pointer"
    >
      <h3 className="text-xl font-bold text-white truncate">
        {petition.isClosed && <span className="text-red-400 text-sm mr-2">[CLOSED]</span>}
        {petition.title}
      </h3>
      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
        {getPreview(petition.description)}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          Created by {petition.creatorDisplay}
        </span>
        <div className="flex items-center gap-1 text-sm text-teal-400">
          <Users className="w-4 h-4" />
          <span>{petition.signatureCount} signatures</span>
        </div>
      </div>
    </div>
  );
}
