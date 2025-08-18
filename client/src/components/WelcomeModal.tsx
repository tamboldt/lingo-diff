interface WelcomeModalProps {
  onClose: () => void;
  onShowExample: () => void;
}

export const WelcomeModal = ({ onClose, onShowExample }: WelcomeModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Lingo-Diff Pro!</h1>
        <p className="text-gray-600 mb-6">
          Professional text comparison and analysis tool. Get instant technical metrics, visual differences, and AI-powered insights for text quality evaluation.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Features:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-8">
          <li><strong>Technical Constraints:</strong> SMS byte limits, mobile UI space, character limits.</li>
          <li><strong>Smart Metrics:</strong> UTF-8 byte counts, script detection, text expansion analysis.</li>
          <li><strong>Visual Diff:</strong> Character-level comparison with immediate feedback.</li>
          <li><strong>AI Analysis:</strong> Generate expert prompts for LLM quality evaluation.</li>
          <li><strong>Universal Design:</strong> Perfect for localization, content editing, and document comparison.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onShowExample}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Try Example
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