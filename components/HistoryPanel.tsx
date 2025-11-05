
import React from 'react';
import { HistoryItem } from '../types';
import { Icon } from './Icon';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onClear: () => void;
    isVisible: boolean;
    onToggle: () => void;
}

const getMethodColorClass = (method: string) => {
    switch (method) {
        case 'GET': return 'bg-green-600/20 text-green-300';
        case 'POST': return 'bg-blue-600/20 text-blue-300';
        case 'PUT': return 'bg-yellow-600/20 text-yellow-300';
        case 'PATCH': return 'bg-orange-600/20 text-orange-300';
        case 'DELETE': return 'bg-red-600/20 text-red-300';
        default: return 'bg-gray-600/20 text-gray-300';
    }
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, isVisible, onToggle }) => {
    return (
        <>
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 w-64 flex flex-col transition-transform duration-300 ease-in-out z-10 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">History</h2>
                    <div className="flex items-center gap-2">
                         <button onClick={onClear} title="Clear History" className="p-1 text-gray-400 hover:text-white transition-colors" disabled={history.length === 0}>
                            <Icon name="trash" className="w-5 h-5" />
                        </button>
                        <button onClick={onToggle} title="Close History" className="p-1 text-gray-400 hover:text-white transition-colors md:hidden">
                            <Icon name="x" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {history.length > 0 ? (
                    <ul className="flex-grow overflow-y-auto">
                        {history.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelect(item)}
                                    className="w-full text-left p-3 hover:bg-gray-700 transition-colors flex flex-col gap-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getMethodColorClass(item.request.method)}`}>
                                            {item.request.method}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 break-all truncate">{item.request.url}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 h-full text-gray-500">
                        <Icon name="clock" className="w-12 h-12 mb-2" />
                        <p className="text-sm">Your request history will appear here.</p>
                    </div>
                )}
            </aside>
            <button 
                onClick={onToggle} 
                title={isVisible ? "Hide History" : "Show History"}
                className="hidden md:block fixed top-1/2 left-0 transform -translate-y-1/2 p-2 bg-gray-800 border border-l-0 border-gray-700 rounded-r-lg transition-transform duration-300 ease-in-out z-20"
                style={{ transform: isVisible ? 'translate(16rem, -50%)' : 'translate(0, -50%)' }}
            >
                <Icon name={isVisible ? "chevron-left" : "chevron-right"} className="w-5 h-5" />
            </button>
        </>
    );
};
   