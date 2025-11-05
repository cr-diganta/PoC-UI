import React from 'react';

interface IconProps {
    name: string;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const icons: { [key: string]: React.ReactElement } = {
        zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
        github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
        send: <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />,
        loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
        sparkles: <path d="M16.5 10.5 18 9l-1.5-1.5L18 6l-1.5-1.5L15 6l-1.5-1.5L12 6l-1.5-1.5L9 6 7.5 7.5 9 9l-1.5 1.5L9 12l1.5 1.5L12 12l1.5 1.5L15 12l1.5 1.5zM12 21l-1.5-1.5L9 21l-1.5-1.5L6 21l-1.5-1.5L6 18l-1.5-1.5L6 15l1.5 1.5L9 15l1.5 1.5L12 15l1.5 1.5L15 15l1.5-1.5L18 15l-1.5 1.5L18 18l-1.5 1.5L18 21l-1.5-1.5L15 21l-1.5-1.5z" />,
        rocket: <path d="M4.5 16.5c-1.5 1.5-3 1.5-4.5 0s-1.5-3 0-4.5L10.5 2l10 10-16 4.5z" /><path d="m15 13-1.5 1.5M12.5 15.5 11 17" /><path d="m20 2-1 1" /><path d="m14 8-1 1" />,
        'alert-triangle': <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />,
        clock: <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />,
        trash: <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />,
        x: <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />,
        'chevron-left': <polyline points="15 18 9 12 15 6" />,
        'chevron-right': <polyline points="9 18 15 12 9 6" />,
        database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>,
        edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
};
