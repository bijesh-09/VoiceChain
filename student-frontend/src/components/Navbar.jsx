export default function Navbar({ walletAddress, onDisconnect }) {
  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 h-18 px-8 flex items-center justify-between z-40">
      <div className="text-xl font-bold text-white">VoiceChain</div>

      <div className="flex items-center gap-8">
        <button className="text-gray-400 hover:text-white transition-colors px-4 cursor-pointer">
          Home
        </button>
        <button className="text-gray-400 hover:text-white transition-colors px-4 cursor-pointer">
          About
        </button>
        <button className="text-gray-400 hover:text-white transition-colors px-4 cursor-pointer">
          Contact
        </button>
      </div>

      <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-300">{walletAddress}</span>
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
