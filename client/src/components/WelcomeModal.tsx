import { useTranslation } from 'react-i18next';
import { FEATURES } from '../config/features';

interface WelcomeModalProps {
  onClose: () => void;
  onShowExample: () => void;
}

export const WelcomeModal = ({ onClose, onShowExample }: WelcomeModalProps) => {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : { t: (key: string) => key.split('.').pop() || key };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('welcome.title')}</h1>
        <p className="text-gray-600 mb-6">
          {t('welcome.description')}
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('welcome.keyFeatures')}</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-8">
          <li>{t('welcome.feature1')}</li>
          <li>{t('welcome.feature2')}</li>
          <li>{t('welcome.feature3')}</li>
          <li>{t('welcome.feature4')}</li>
          <li>{t('welcome.feature5')}</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onShowExample}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {t('welcome.tryExample')}
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            {t('welcome.getStarted')}
          </button>
        </div>
      </div>
    </div>
  );
}; 