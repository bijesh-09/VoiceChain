import { useMemo, useState, useEffect } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import Navbar from './Navbar';
import PetitionCard from './PetitionCard';
import PetitionModal from './PetitionModal';
import CreatePetitionModal from './CreatePetitionModal';
import AboutPage from './AboutPage';

import { usePetitions } from '../hooks/usePetitions';
import { usePetitionActions } from '../hooks/usePetitionActions';
import { useInitializePlatform } from '../hooks/useInitializePlatform';

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
  const { platformExists, checking, initializing, checkPlatformExists, initializePlatform } = useInitializePlatform();

  const [selectedPetition, setSelectedPetition] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [initError, setInitError] = useState(null);

  const [currentPage, setCurrentPage] = useState('home');
  const [targetPage, setTargetPage] = useState('home');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    checkPlatformExists();
  }, [walletAddress, checkPlatformExists]);

  useEffect(() => {
    if (targetPage === currentPage) return;

    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 0);

    const timer = setTimeout(() => {
      setCurrentPage(targetPage);
      setVisible(true);
    }, 200);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(timer);
    };
  }, [targetPage, currentPage]);

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

  const handleInitializePlatform = async () => {
    setInitError(null);
    try {
      await initializePlatform();
      await checkPlatformExists();
      await refetch();
    } catch (error) {
      const message = String(error?.message ?? 'Failed to initialize platform');

      if (message.toLowerCase().includes('already in use')) {
        await checkPlatformExists();
        await refetch();
        return;
      }

      setInitError(message);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Navbar
        walletAddress={walletAddress}
        onDisconnect={onDisconnect}
        currentPage={targetPage}
        onNavigate={setTargetPage}
      />

      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Powered by Solana Blockchain
            </div>

            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Student Petitions
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your voice, permanently recorded. Signatures that cannot be erased.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {checking && (
              <div className="text-gray-400 animate-pulse">Checking platform status...</div>
            )}

            {platformExists === false && (
              <div className="w-full max-w-2xl space-y-4">
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Platform Not Initialized
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        This platform needs to be initialized first. The wallet that initializes
                        becomes the permanent admin with special permissions.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleInitializePlatform}
                    disabled={initializing}
                    className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {initializing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Initializing Platform...
                      </span>
                    ) : (
                      '🚀 Initialize Platform (Admin Only)'
                    )}
                  </button>

                  {initError && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                      {initError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {platformExists === true && currentPage === 'home' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-2xl shadow-teal-500/50 hover:shadow-teal-500/70 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 text-lg">✨ Create Petition</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {currentPage === 'about' ? (
          <AboutPage />
        ) : (
          <div className="relative max-w-4xl mx-auto px-4 pb-20">
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading petitions...</p>
              </div>
            )}

            {!loading && platformExists === false && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-500 text-lg">
                  Initialize the platform to start creating petitions
                </p>
              </div>
            )}

            {!loading && platformExists === true && displayPetitions.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl mb-4">
                  <Sparkles className="w-8 h-8 text-teal-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No petitions yet</p>
                <p className="text-gray-600 text-sm">Be the first to create one!</p>
              </div>
            )}

            <div className="space-y-4">
              {displayPetitions.map((petition) => (
                <PetitionCard
                  key={petition.address?.toBase58?.() ?? petition.address}
                  petition={petition}
                  onClick={() => setSelectedPetition(petition)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPetition && (
        <PetitionModal
          petition={selectedPetition}
          walletAddress={walletAddress}
          onClose={() => setSelectedPetition(null)}
          onSign={handleSignPetition}
          onClosePetition={handleClosePetition}
        />
      )}

      {showCreateModal && platformExists === true && (
        <CreatePetitionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePetition}
        />
      )}
    </div>
  );
}
