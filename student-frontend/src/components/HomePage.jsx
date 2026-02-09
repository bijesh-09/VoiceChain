import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import PetitionCard from './PetitionCard';
import PetitionModal from './PetitionModal';
import CreatePetitionModal from './CreatePetitionModal';

// Mock petition data
const initialPetitions = [
  {
    id: 1,
    title: 'Extend Library Hours to Midnight',
    description: 'We, the undergraduate students of this university, petition for extended library hours until midnight during exam periods. Current closing time at 10 PM is insufficient for students who need quiet study spaces. Many students live in noisy dorms and rely on the library for focused work. Extended hours would significantly improve academic performance and reduce stress during finals.',
    creator: '3xK7...mP9Q',
    createdDate: 'Feb 5, 2026',
    signatures: 47,
    signers: [
      '3xK7...mP9Q', '5aL2...nB3K', '7pM9...kX4L', '2dK5...wQ8R',
      '9fN3...yT6P', '4hJ8...zM2V', '6gR4...cN9D', '1tY7...bF5W',
      '8sD2...vL3Q', '3kP6...mH7X', '5wT9...nJ4K', '7bQ2...rP8M',
      '2nV5...dL6Y', '9cF3...gT2Z', '4xM8...jW9P', '6qL4...hN3R',
      '1rK7...fB5D', '8wP2...kM6V', '3dT5...nQ9L', '5yJ9...cX2H'
    ],
    isClosed: false
  },
  {
    id: 2,
    title: 'Implement Mandatory Mental Health Days',
    description: 'This petition calls for the implementation of 3 mandatory mental health days per semester that do not count against attendance. Student mental health is at crisis levels nationwide. Providing designated mental health days would reduce stigma and allow students to prioritize wellbeing without academic penalty. This policy would demonstrate institutional commitment to student wellness.',
    creator: '5aL2...nB3K',
    createdDate: 'Feb 3, 2026',
    signatures: 132,
    signers: [
      '5aL2...nB3K', '3xK7...mP9Q', '9fN3...yT6P', '2dK5...wQ8R',
      '7pM9...kX4L', '4hJ8...zM2V', '1tY7...bF5W', '6gR4...cN9D',
      '8sD2...vL3Q', '3kP6...mH7X', '5wT9...nJ4K', '7bQ2...rP8M',
      '2nV5...dL6Y', '9cF3...gT2Z', '4xM8...jW9P', '6qL4...hN3R',
      '1rK7...fB5D', '8wP2...kM6V', '3dT5...nQ9L', '5yJ9...cX2H'
    ],
    isClosed: false
  },
  {
    id: 3,
    title: 'Ban Single-Use Plastics on Campus',
    description: 'We petition the administration to ban all single-use plastics from campus facilities by Fall 2026. This includes plastic water bottles, utensils, straws, and food containers. Our university should lead in environmental sustainability. Reusable alternatives exist and the environmental impact of plastic waste is devastating. Join us in making our campus plastic-free.',
    creator: '7pM9...kX4L',
    createdDate: 'Feb 1, 2026',
    signatures: 89,
    signers: [
      '7pM9...kX4L', '3xK7...mP9Q', '5aL2...nB3K', '9fN3...yT6P',
      '2dK5...wQ8R', '4hJ8...zM2V', '6gR4...cN9D', '1tY7...bF5W',
      '8sD2...vL3Q', '3kP6...mH7X', '5wT9...nJ4K', '7bQ2...rP8M',
      '2nV5...dL6Y', '9cF3...gT2Z', '4xM8...jW9P', '6qL4...hN3R',
      '1rK7...fB5D', '8wP2...kM6V', '3dT5...nQ9L', '5yJ9...cX2H'
    ],
    isClosed: false
  },
  {
    id: 4,
    title: 'Add Vegan Options to All Dining Halls',
    description: 'Currently only 2 of 8 dining halls offer consistent vegan options. We demand accessible plant-based meals in every dining facility. Students with dietary restrictions, ethical concerns, and health needs deserve equal access to nutritious food. This is a matter of equity and inclusion.',
    creator: '2dK5...wQ8R',
    createdDate: 'Jan 30, 2026',
    signatures: 156,
    signers: [
      '2dK5...wQ8R', '5aL2...nB3K', '3xK7...mP9Q', '9fN3...yT6P',
      '7pM9...kX4L', '4hJ8...zM2V', '1tY7...bF5W', '6gR4...cN9D',
      '8sD2...vL3Q', '3kP6...mH7X', '5wT9...nJ4K', '7bQ2...rP8M',
      '2nV5...dL6Y', '9cF3...gT2Z', '4xM8...jW9P', '6qL4...hN3R',
      '1rK7...fB5D', '8wP2...kM6V', '3dT5...nQ9L', '5yJ9...cX2H'
    ],
    isClosed: false
  },
  {
    id: 5,
    title: 'Free Public Transportation for Students',
    description: 'Petition for free city bus passes for all enrolled students. Transportation costs are a significant financial burden. Many students cannot afford cars and bus fares add up quickly. Free transit would improve access to jobs, internships, and city resources. Peer institutions already provide this essential service.',
    creator: '9fN3...yT6P',
    createdDate: 'Jan 28, 2026',
    signatures: 203,
    signers: [
      '9fN3...yT6P', '2dK5...wQ8R', '5aL2...nB3K', '3xK7...mP9Q',
      '7pM9...kX4L', '4hJ8...zM2V', '6gR4...cN9D', '1tY7...bF5W',
      '8sD2...vL3Q', '3kP6...mH7X', '5wT9...nJ4K', '7bQ2...rP8M',
      '2nV5...dL6Y', '9cF3...gT2Z', '4xM8...jW9P', '6qL4...hN3R',
      '1rK7...fB5D', '8wP2...kM6V', '3dT5...nQ9L', '5yJ9...cX2H'
    ],
    isClosed: false
  }
];

export default function HomePage({ walletAddress, onDisconnect }) {
  const [petitions, setPetitions] = useState(initialPetitions);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePetition = (newPetition) => {
    const petition = {
      id: petitions.length + 1,
      ...newPetition,
      creator: walletAddress,
      createdDate: 'Feb 8, 2026',
      signatures: 0,
      signers: [],
      isClosed: false
    };
    setPetitions([petition, ...petitions]);
    setShowCreateModal(false);
  };

  const handleSignPetition = (petitionId) => {
    setPetitions(petitions.map(p => {
      if (p.id === petitionId && !p.signers.includes(walletAddress)) {
        return {
          ...p,
          signatures: p.signatures + 1,
          signers: [...p.signers, walletAddress]
        };
      }
      return p;
    }));
  };

  const handleClosePetition = (petitionId) => {
    setPetitions(petitions.map(p => {
      if (p.id === petitionId) {
        return { ...p, isClosed: true };
      }
      return p;
    }));
    setSelectedPetition(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar walletAddress={walletAddress} onDisconnect={onDisconnect} />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center relative" style={{ height: '60vh', marginTop: '72px' }}>
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
        {petitions.map(petition => (
          <PetitionCard
            key={petition.id}
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
