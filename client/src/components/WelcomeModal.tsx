interface WelcomeModalProps {
  onClose: () => void;
  onShowExample: () => void;
}

export const WelcomeModal = ({ onClose, onShowExample }: WelcomeModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Lingo-Diff!</h1>
        <p className="text-gray-600 mb-6">
          A powerful tool designed for localization managers. Quickly compare translation candidates and generate expert-level analysis prompts for your favorite AI.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">How to Use:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-8">
          <li>Enter your original English <strong>Source Term</strong>.</li>
          <li>Provide <strong>Translation Context</strong> (e.g., "This is a button on a website").</li>
          <li>Paste the two <strong>Translation Candidates</strong> you want to compare.</li>
          <li>Review the real-time <strong>Visual Diff</strong> on the right.</li>
          <li>Click <strong>"Copy Prompt for AI Analysis"</strong> to get a detailed prompt to paste into ChatGPT, Claude, or other LLMs.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onShowExample}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Show Me a Quick Example
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Got It, Let's Start!
          </button>
        </div>
      </div>
    </div>
  );
}; 