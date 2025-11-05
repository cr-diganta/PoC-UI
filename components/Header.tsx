import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
    onOpenConnections: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConnections }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Icon name="zap" className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">API Test Bench & AI Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
                 <button
                    onClick={onOpenConnections}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <Icon name="database" className="w-4 h-4" />
                    Connections
                </button>
                <a
                    href="https://github.com/google/generative-ai-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <Icon name="github" className="w-4 h-4" />
                    View Source
                </a>
            </div>
        </header>
    );
};
