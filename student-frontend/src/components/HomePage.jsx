import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import PetitionCard from './PetitionCard';
import PetitionModal from './PetitionModal';
import CreatePetitionModal from './CreatePetitionModal';

import { usePetitions } from '../hooks/usePetitions';
import { usePetitionActions } from '../hooks/usePetitionActions';

const toBase58 = (value) => {
  if (!value) return '';
  if (typeof value.toBase58 === 'function') return value.toBase58();
  return String(value);
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value.toNumber === 'function') return value.toNumber();
  return Number(value);
};

const formatDate = (value) => {
  const ts = toNumber(value);
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleDateString();
};

const shortenAddress = (address) => {
  if (!address) return '—';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function HomePage({ walletAddress, onDisconnect }) {
  const { petitions, loading, refetch } = usePetitions();
  const { createPetition, signPetition, closePetition } = usePetitionActions();

  const [selectedPetition, setSelectedPetition] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const displayPetitions = useMemo(() => {
    return petitions.map((petition) => {
      const creatorAddress = toBase58(petition.creator);
      const signatureCount = toNumber(petition.signatureCount ?? petition.signature_count);
      const createdDate = formatDate(petition.createdAt ?? petition.created_at);
      const isActive =
        petition.isActive !== undefined
          ? petition.isActive
          : petition.is_active !== undefined
          ? petition.is_active
          : true;

      return {
        ...petition,
        creatorAddress,
        creatorDisplay: shortenAddress(creatorAddress),
        signatureCount,
        createdDate,
        isClosed: !isActive,
      };
    });
  }, [petitions]);

  const handleCreatePetition = async ({ title, description }) => {
    await createPetition(title, description);
    await refetch();
    setShowCreateModal(false);
  };

  const handleSignPetition = async (petition) => {
    await signPetition(petition);
    await refetch();
  };

  const handleClosePetition = async (petition) => {
    await closePetition(petition);
    await refetch();
    setSelectedPetition(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar walletAddress={walletAddress} onDisconnect={onDisconnect} />

      {/* Hero Section */}
      <div
        className="bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center relative"
        style={{ height: '60vh', marginTop: '72px' }}
      >
        <h1 className="text-5xl font-bold text-white mb-6">Student Petitions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg shadow-teal-500/30 transition-all duration-200"
        >
          Create Petition
        </button>
        <div className="absolute bottom-8 animate-bounce text-gray-600">
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Petitions Feed */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {loading && (
          <div className="text-gray-400 text-center py-8">Loading petitions...</div>
        )}

        {!loading && displayPetitions.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No petitions yet. Be the first to create one.
          </div>
        )}

        {displayPetitions.map((petition) => (
          <PetitionCard
            key={petition.address?.toBase58?.() ?? petition.address}
            petition={petition}
            onClick={() => setSelectedPetition(petition)}
          />
        ))}
      </div>

      {/* Petition Modal */}
      {selectedPetition && (
        <PetitionModal
          petition={selectedPetition}
          walletAddress={walletAddress}
          onClose={() => setSelectedPetition(null)}
          onSign={handleSignPetition}
          onClosePetition={handleClosePetition}
        />
      )}

      {/* Create Petition Modal */}
      {showCreateModal && (
        <CreatePetitionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePetition}
        />
      )}
    </div>
  );
}
