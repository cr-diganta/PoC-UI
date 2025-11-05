import React, { useState, useEffect } from 'react';
import { Connection, ConnectionType, ConnectionDetails } from '../types';
import { Modal } from './Modal';
import { Icon } from './Icon';

interface ConnectionFormProps {
    connection: Connection | null;
    onSave: (connection: Connection) => void;
    onClose: () => void;
}

const connectionTypes: ConnectionType[] = ['PostgreSQL', 'MongoDB', 'Redis', 'Milvus'];

const getFieldsForType = (type: ConnectionType): (keyof ConnectionDetails)[] => {
    switch(type) {
        case 'PostgreSQL': return ['host', 'port', 'user', 'password', 'dbname'];
        case 'MongoDB': return ['uri'];
        case 'Redis': return ['host', 'port', 'password', 'db'];
        case 'Milvus': return ['host', 'port'];
        default: return [];
    }
};


export const ConnectionForm: React.FC<ConnectionFormProps> = ({ connection, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<ConnectionType>('PostgreSQL');
    const [details, setDetails] = useState<ConnectionDetails>({});

    useEffect(() => {
        if (connection) {
            setName(connection.name);
            setType(connection.type);
            setDetails(connection.details);
        } else {
            // Reset form for new connection
            setName('');
            setType('PostgreSQL');
            setDetails({});
        }
    }, [connection]);
    
    const handleDetailChange = (field: keyof ConnectionDetails, value: string) => {
        setDetails(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: connection?.id || crypto.randomUUID(),
            name,
            type,
            details,
        });
    };

    const fields = getFieldsForType(type);

    return (
        <Modal isOpen={true} onClose={onClose} title={connection ? 'Edit Connection' : 'Add New Connection'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="conn-name" className="block text-sm font-medium text-gray-300 mb-1">Connection Name</label>
                    <input 
                        id="conn-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="My Production DB"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="conn-type" className="block text-sm font-medium text-gray-300 mb-1">Connection Type</label>
                    <select
                        id="conn-type"
                        value={type}
                        onChange={e => {
                            setType(e.target.value as ConnectionType);
                            setDetails({}); // Reset details when type changes
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        {connectionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                
                <hr className="border-gray-600" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map(field => (
                        <div key={field}>
                            <label htmlFor={`detail-${field}`} className="block text-sm font-medium text-gray-300 mb-1 capitalize">{field.replace('dbname', 'Database')}</label>
                            <input
                                id={`detail-${field}`}
                                type={field.includes('password') ? 'password' : 'text'}
                                value={(details as any)[field] || ''}
                                onChange={e => handleDetailChange(field, e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder={field === 'uri' ? 'mongodb://...' : ''}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700" disabled={!name}>
                        Save Connection
                    </button>
                </div>
            </form>
        </Modal>
    );
};
