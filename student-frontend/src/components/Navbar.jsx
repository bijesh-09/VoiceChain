export default function Navbar({ walletAddress, onDisconnect, currentPage, onNavigate }) {
  const shortAddress =
    walletAddress && walletAddress.length > 8
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
      : walletAddress;

  return (
    <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 h-20 px-8 flex items-center justify-between z-50">
      <div className="text-xl font-bold text-white">VoiceChain</div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('home')}
          className={`px-4 pb-1 transition-colors border-b-2 ${
            currentPage === 'home'
              ? 'text-white border-teal-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`px-4 pb-1 transition-colors border-b-2 ${
            currentPage === 'about'
              ? 'text-white border-teal-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          About
        </button>
      </div>

      <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-300">{shortAddress}</span>
        <button
          onClick={onDisconnect}
          className="text-xs text-gray-500 hover:text-red-400 ml-2 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </nav>
  );
}
