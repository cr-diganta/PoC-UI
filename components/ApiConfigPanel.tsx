
import React, { useState } from 'react';
import { ApiRequest, HttpMethod } from '../types';
import { Icon } from './Icon';

interface ApiConfigPanelProps {
    request: ApiRequest;
    setRequest: React.Dispatch<React.SetStateAction<ApiRequest>>;
    onSend: () => void;
    loading: boolean;
}

const httpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
type Tab = 'Headers' | 'Body';

const getMethodColor = (method: HttpMethod) => {
    switch (method) {
        case 'GET': return 'text-green-400';
        case 'POST': return 'text-blue-400';
        case 'PUT': return 'text-yellow-400';
        case 'PATCH': return 'text-orange-400';
        case 'DELETE': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

export const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({ request, setRequest, onSend, loading }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Headers');

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRequest(prev => ({ ...prev, method: e.target.value as HttpMethod }));
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest(prev => ({ ...prev, url: e.target.value }));
    };

    const handleHeadersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRequest(prev => ({ ...prev, headers: e.target.value }));
    };

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRequest(prev => ({ ...prev, body: e.target.value }));
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center p-2 border-b border-gray-700 gap-2">
                <select
                    value={request.method}
                    onChange={handleMethodChange}
                    className={`bg-gray-900 border-none rounded-md px-3 py-2 font-mono font-bold focus:ring-2 focus:ring-blue-500 appearance-none ${getMethodColor(request.method)}`}
                >
                    {httpMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={request.url}
                    onChange={handleUrlChange}
                    placeholder="https://api.example.com/data"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
                <button
                    onClick={onSend}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="send" className="w-5 h-5" />}
                    <span>{loading ? 'Sending...' : 'Send'}</span>
                </button>
            </div>
            
            <div className="px-4 pt-2">
                <div className="flex border-b border-gray-700">
                    <TabButton name="Headers" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Body" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            <div className="flex-grow p-4 min-h-[200px]">
                {activeTab === 'Headers' && (
                    <JsonEditor value={request.headers} onChange={handleHeadersChange} placeholder='{ "Authorization": "Bearer ..." }' />
                )}
                {activeTab === 'Body' && (
                    <JsonEditor value={request.body} onChange={handleBodyChange} placeholder='{ "key": "value" }' />
                )}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: Tab, activeTab: Tab, setActiveTab: (tab: Tab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === name
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {name}
    </button>
);

const JsonEditor: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string }> = ({ value, onChange, placeholder }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full p-2 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        spellCheck="false"
    />
);
   