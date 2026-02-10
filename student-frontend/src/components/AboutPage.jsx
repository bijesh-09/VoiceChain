export default function AboutPage() {
  const techStack = ['Solana', 'Anchor', 'React', 'Vite', 'Tailwind CSS', 'Phantom Wallet'];

  return (
    <section className="max-w-5xl mx-auto px-4 pb-24">
      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl p-8 md:p-10 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">About VoiceChain</h2>
          <p className="text-lg text-gray-200">
            Built by <span className="text-teal-400 font-semibold">Bijesh Karanjit</span>
          </p>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            A CS student from Samriddhi College, Nepal. <br />
            Currently working on getting a frontend web dev intern. Main goal: Machine learning <br />
            Good project done by me: <br />
            Project1: https://github.com/Samriddhi-HTML-Group-Project/TravelPlanner -- Uses firebase authentication, and firestore (built by 50% me, 50% team) <br />
            Project2: https://github.com/bijesh-09/VoiceChain -- ts is repo of this dApp lol <br />
            Habits: Always asking WHY behind the How's <br />
            Interests: wanna learn singing,boy enjoys watching animes
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">dApp Architecture</h3>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
              <div className="rounded-xl border border-teal-500/50 bg-gray-900 px-4 py-3 text-white font-medium">
                User Wallet
              </div>
              <span className="text-teal-300 text-lg">→</span>
              <div className="rounded-xl border border-teal-500/50 bg-gray-900 px-4 py-3 text-white font-medium">
                React Frontend
              </div>
              <span className="text-teal-300 text-lg">→</span>
              <div className="rounded-xl border border-teal-500/50 bg-gray-900 px-4 py-3 text-white font-medium text-center">
                Anchor Program on Solana Devnet
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-teal-300 text-2xl">↓</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
              <div className="rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-center text-gray-200">
                Platform PDA Account
              </div>
              <div className="rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-center text-gray-200">
                Petition PDA Accounts
              </div>
              <div className="rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-center text-gray-200">
                Signature PDA Accounts
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center">
            <span className="text-teal-400 font-medium">PDA</span> means Program Derived Address — a deterministic Solana account address generated from seeds and your program ID.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full border border-gray-700 bg-black/40 text-gray-200 text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
