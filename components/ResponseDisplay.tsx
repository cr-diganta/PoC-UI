import React, { useState } from 'react';
import { ApiResponse } from '../types';
import { Icon } from './Icon';

interface ResponseDisplayProps {
    response: ApiResponse | null;
    loading: boolean;
    error: string | null;
    geminiAnalysis: string | null;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

type Tab = 'Body' | 'Headers' | 'AI Analysis';

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, loading, error, geminiAnalysis, onAnalyze, isAnalyzing }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Body');

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-400';
        if (status >= 300 && status < 400) return 'text-yellow-400';
        if (status >= 400 && status < 500) return 'text-orange-400';
        if (status >= 500) return 'text-red-400';
        return 'text-gray-400';
    };

    const renderContent = () => {
        if (loading) {
            return <LoadingState />;
        }
        if (error) {
            return <ErrorState message={error} />;
        }
        if (response) {
            return (
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-2 flex-wrap gap-2 border-b border-gray-700">
                       <div className="flex items-center gap-4">
                           <span className={`font-bold ${getStatusColor(response.status)}`}>
                               Status: {response.status} {response.statusText}
                           </span>
                           <span className="text-gray-400">Time: <span className="font-mono text-white">{response.time}ms</span></span>
                           <span className="text-gray-400">Size: <span className="font-mono text-white">{(response.size / 1024).toFixed(2)} KB</span></span>
                       </div>
                       <button
                            onClick={onAnalyze}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors"
                       >
                           {isAnalyzing ? <Icon name="loader" className="w-4 h-4 animate-spin" /> : <Icon name="sparkles" className="w-4 h-4" />}
                           <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}</span>
                       </button>
                    </div>

                    <div className="px-4 pt-2">
                        <div className="flex border-b border-gray-700">
                           <TabButton name="Body" activeTab={activeTab} setActiveTab={setActiveTab} />
                           <TabButton name="Headers" activeTab={activeTab} setActiveTab={setActiveTab} count={Object.keys(response.headers).length} />
                           <TabButton name="AI Analysis" activeTab={activeTab} setActiveTab={setActiveTab} hasContent={!!geminiAnalysis || isAnalyzing} />
                        </div>
                    </div>
                    
                    <div className="flex-grow p-4 overflow-auto">
                        {activeTab === 'Body' && <JsonViewer data={response.body} />}
                        {activeTab === 'Headers' && <HeadersViewer headers={response.headers} />}
                        {activeTab === 'AI Analysis' && <AnalysisViewer analysis={geminiAnalysis} loading={isAnalyzing} />}
                    </div>
                </div>
            );
        }
        return <InitialState />;
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex-1 flex flex-col min-h-[300px]">
            {renderContent()}
        </div>
    );
};

const TabButton: React.FC<{ name: Tab, activeTab: Tab, setActiveTab: (tab: Tab) => void, count?: number, hasContent?: boolean }> = ({ name, activeTab, setActiveTab, count, hasContent }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === name
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {name}
        {typeof count !== 'undefined' && <span className="ml-2 bg-gray-600 text-gray-200 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>}
        {name === "AI Analysis" && hasContent && <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>}
    </button>
);

const InitialState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Icon name="rocket" className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">Ready to Launch</h3>
        <p>Configure your request and hit 'Send' to see the response here.</p>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Icon name="loader" className="w-12 h-12 animate-spin mb-4 text-blue-500" />
        <p className="text-lg">Fetching response...</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
        <Icon name="alert-triangle" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">Request Failed</h3>
        <p className="font-mono bg-gray-900 p-2 rounded-md text-sm whitespace-pre-wrap">{message}</p>
    </div>
);

const JsonViewer: React.FC<{ data: any }> = ({ data }) => {
    const formattedJson = JSON.stringify(data, null, 2);
    const syntaxHighlight = (json: string) => {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'text-green-400'; // string
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-cyan-400'; // key
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-purple-400'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-gray-500'; // null
            } else {
                 cls = 'text-yellow-400'; // number
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    };
    
    return (
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-mono overflow-auto h-full w-full">
            <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(formattedJson) }} />
        </pre>
    );
};

const HeadersViewer: React.FC<{ headers: Record<string, string> }> = ({ headers }) => (
    <div className="font-mono text-sm space-y-1">
        {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex">
                <span className="font-semibold text-cyan-400 w-1/4 truncate">{key}:</span>
                <span className="text-green-400 flex-1 break-all">{value}</span>
            </div>
        ))}
    </div>
);

const AnalysisViewer: React.FC<{ analysis: string | null, loading: boolean }> = ({ analysis, loading }) => {
    if (loading) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Icon name="sparkles" className="w-12 h-12 animate-pulse mb-4 text-purple-500" />
                <p className="text-lg">Gemini is analyzing the response...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Icon name="sparkles" className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold">No Analysis Yet</h3>
                <p>Click 'Analyze with Gemini' to get AI-powered insights.</p>
            </div>
        )
    }

    // A very basic markdown to HTML converter
    const formattedAnalysis = analysis
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') // Bold
        .replace(/`(.*?)`/g, '<code class="bg-gray-700 text-yellow-300 px-1 py-0.5 rounded">$1</code>') // Inline code
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-blue-400 mt-4 mb-2">$1</h3>') // H3
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-blue-300 mt-6 mb-3">$1</h2>') // H2
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-blue-200 mt-8 mb-4">$1</h1>') // H1
        .replace(/\n/g, '<br />'); // Newlines


    return (
        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formattedAnalysis }} />
    );
};