import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import Image from 'next/image';

const TelegramConnectForm = ({ onClose }: { onClose: () => void }) => {
  const [botToken, setBotToken] = useState('');
  const [baseURL, setBaseURL] = useState('https://api.telegram.org');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Telegram Bot Token:', botToken);
    console.log('Base URL:', baseURL);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white w-[600px] rounded-lg shadow-lg relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Image src="/telegram.svg" alt="Telegram" width={35} height={35} priority />
          <div>
            <h2 className="text-lg font-semibold">Telegram Account</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Telegram API</span>
          </div>
        </div>
        <div className="absolute top-7 right-5 flex items-center gap-5">
          <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
            <Trash2 size={20} />
          </button>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex">
          <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-black dark:hover:text-white cursor-pointer font-medium bg-gray-200 dark:bg-gray-700 p-2 rounded">Connection</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer p-2">Sharing</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer p-2">Details</li>
            </ul>
          </div>
          <div className="w-3/4 p-6">
            <form onSubmit={handleSubmit}>
              <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2">Access Token</label>
              <input
                type="password"
                placeholder="Enter Telegram Bot Token"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mb-4 text-black dark:text-white"
              />
              <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2">Base URL</label>
              <input
                type="text"
                value={baseURL}
                disabled
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mb-4 text-black dark:text-white"
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-black dark:bg-white text-white dark:text-black p-2 rounded w-20">Save</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramConnectForm;
