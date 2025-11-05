import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiConfigPanel } from './components/ApiConfigPanel';
import { ResponseDisplay } from './components/ResponseDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { ConnectionManager } from './components/ConnectionManager';
import { ApiRequest, ApiResponse, HistoryItem, Connection } from './types';
import { analyzeApiResponse } from './services/geminiService';

const App: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [request, setRequest] = useState<ApiRequest>({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        headers: '{\n  "Content-Type": "application/json"\n}',
        body: '',
    });
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);

    // New state for Connection Manager
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isConnectionManagerOpen, setIsConnectionManagerOpen] = useState(false);

    useEffect(() => {
        // Load connections from local storage on initial render
        try {
            const storedConnections = localStorage.getItem('api-bench-connections');
            if (storedConnections) {
                setConnections(JSON.parse(storedConnections));
            }
        } catch (e) {
            console.error("Failed to load connections from localStorage", e);
        }
    }, []);

    const handleSaveConnections = (updatedConnections: Connection[]) => {
        setConnections(updatedConnections);
        try {
            localStorage.setItem('api-bench-connections', JSON.stringify(updatedConnections));
        } catch (e) {
            console.error("Failed to save connections to localStorage", e);
        }
    };

    const handleSendRequest = useCallback(async () => {
        setLoading(true);
        setResponse(null);
        setError(null);
        setGeminiAnalysis(null);

        let parsedHeaders: Record<string, string> = {};
        try {
            if (request.headers.trim()) {
                parsedHeaders = JSON.parse(request.headers);
            }
        } catch (e) {
            setError('Invalid headers: Please provide valid JSON.');
            setLoading(false);
            return;
        }

        const newHistoryItem: HistoryItem = { id: Date.now(), request };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);

        try {
            const startTime = Date.now();
            const res = await fetch(request.url, {
                method: request.method,
                headers: parsedHeaders,
                body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
            });
            const endTime = Date.now();

            const responseBody = await res.text();
            let parsedBody: any;
            try {
                parsedBody = JSON.parse(responseBody);
            } catch (e) {
                parsedBody = responseBody;
            }

            const responseHeaders: Record<string, string> = {};
            res.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: responseHeaders,
                body: parsedBody,
                time: endTime - startTime,
                size: new Blob([responseBody]).size,
            });
        } catch (e: any) {
            let errorMessage = e.message || 'An unknown network error occurred.';
            if (errorMessage.includes('Failed to fetch')) {
                errorMessage += '\n\nThis might be a CORS issue. Please ensure your backend server is configured to accept requests from this origin.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [request]);

    const handleAnalyze = useCallback(async () => {
        if (!response) return;
        setIsAnalyzing(true);
        setGeminiAnalysis(null);
        try {
            const analysis = await analyzeApiResponse(response);
            setGeminiAnalysis(analysis);
        } catch (e: any) {
            setGeminiAnalysis(`Error analyzing response: ${e.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    }, [response]);

    const loadFromHistory = (historyItem: HistoryItem) => {
        setRequest(historyItem.request);
        setResponse(null);
        setError(null);
        setGeminiAnalysis(null);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
            <Header onOpenConnections={() => setIsConnectionManagerOpen(true)} />
            <main className="flex-grow flex p-4 gap-4 overflow-hidden">
                <HistoryPanel 
                    history={history}
                    onSelect={loadFromHistory}
                    onClear={clearHistory}
                    isVisible={isHistoryVisible}
                    onToggle={() => setIsHistoryVisible(!isHistoryVisible)}
                />
                <div className={`flex flex-col gap-4 flex-1 transition-all duration-300 ${isHistoryVisible ? 'ml-0 md:ml-64' : 'ml-0'}`}>
                    <ApiConfigPanel 
                        request={request}
                        setRequest={setRequest}
                        onSend={handleSendRequest}
                        loading={loading}
                    />
                    <ResponseDisplay
                        response={response}
                        loading={loading}
                        error={error}
                        geminiAnalysis={geminiAnalysis}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                    />
                </div>
            </main>
            <ConnectionManager
                isOpen={isConnectionManagerOpen}
                onClose={() => setIsConnectionManagerOpen(false)}
                connections={connections}
                onSave={handleSaveConnections}
            />
        </div>
    );
};

export default App;