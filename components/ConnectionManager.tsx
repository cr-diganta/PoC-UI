import React, { useState } from 'react';
import { Connection } from '../types';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { ConnectionForm } from './ConnectionForm';

interface ConnectionManagerProps {
    isOpen: boolean;
    onClose: () => void;
    connections: Connection[];
    onSave: (connections: Connection[]) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ isOpen, onClose, connections, onSave }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
    const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error' | 'testing', message: string }>>({});
    const [testEndpoint, setTestEndpoint] = useState('http://localhost:8000/test-connection');

    const handleOpenForm = (conn: Connection | null) => {
        setEditingConnection(conn);
        setIsFormOpen(true);
    };

    const handleSaveConnection = (connection: Connection) => {
        let updatedConnections;
        if (connections.some(c => c.id === connection.id)) {
            updatedConnections = connections.map(c => c.id === connection.id ? connection : c);
        } else {
            updatedConnections = [...connections, connection];
        }
        onSave(updatedConnections);
        setIsFormOpen(false);
        setEditingConnection(null);
    };

    const handleDeleteConnection = (id: string) => {
        if (window.confirm("Are you sure you want to delete this connection?")) {
            onSave(connections.filter(c => c.id !== id));
        }
    };
    
    const handleTestConnection = async (connection: Connection) => {
        setTestResults(prev => ({ ...prev, [connection.id]: { status: 'testing', message: 'Testing...' } }));
        try {
            const response = await fetch(testEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connection),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || 'Test failed');

            setTestResults(prev => ({ ...prev, [connection.id]: { status: 'success', message: result.message || 'Connection successful!' } }));
        } catch (error: any) {
            let errorMessage = error.message || 'An unknown error occurred.';
            if (errorMessage.includes('Failed to fetch')) {
                errorMessage = 'Failed to fetch. This is likely a CORS issue. Make sure your test endpoint server allows requests from this origin.';
            }
            setTestResults(prev => ({ ...prev, [connection.id]: { status: 'error', message: errorMessage } }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Connection Manager">
            <div className="flex flex-col gap-6">
                <div>
                    <label htmlFor="test-endpoint" className="block text-sm font-medium text-gray-300 mb-1">Connection Test Endpoint</label>
                    <input 
                        type="url" 
                        id="test-endpoint"
                        value={testEndpoint}
                        onChange={(e) => setTestEndpoint(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., http://localhost:8000/test-connection"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your backend endpoint that accepts a POST request with connection details to test.</p>
                </div>
                 <div className="flex justify-end">
                    <button onClick={() => handleOpenForm(null)} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <Icon name="zap" className="w-4 h-4" /> Add New Connection
                    </button>
                </div>
                <div className="space-y-3">
                    {connections.length > 0 ? connections.map(conn => (
                        <div key={conn.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-bold text-white">{conn.name}</span>
                                    <span className="text-xs text-gray-400">{conn.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleTestConnection(conn)} className="p-2 text-gray-300 hover:text-blue-400 transition-colors" title="Test Connection">
                                       {testResults[conn.id]?.status === 'testing' ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="zap" className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => handleOpenForm(conn)} className="p-2 text-gray-300 hover:text-yellow-400 transition-colors" title="Edit"><Icon name="edit" className="w-5 h-5" /></button>
                                    <button onClick={() => handleDeleteConnection(conn.id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors" title="Delete"><Icon name="trash" className="w-5 h-5" /></button>
                                </div>
                            </div>
                            {testResults[conn.id] && (
                                <p className={`mt-2 text-xs p-2 rounded ${
                                    testResults[conn.id].status === 'success' ? 'bg-green-900/50 text-green-300' : 
                                    testResults[conn.id].status === 'error' ? 'bg-red-900/50 text-red-300' :
                                    'bg-blue-900/50 text-blue-300'
                                }`}>
                                    {testResults[conn.id].message}
                                </p>
                            )}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">No connections saved yet. Add one to get started!</p>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <ConnectionForm 
                    connection={editingConnection}
                    onSave={handleSaveConnection}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </Modal>
    );
};