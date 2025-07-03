'use client';

import React, { useEffect, useState } from 'react';

// Interfaces for the data from /api/admin/moderation/pending
interface BaseModerationDetail {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

interface PendingVideoItem extends BaseModerationDetail {
    title: string;
    description: string; 
    videoUrl: string; // For context, maybe link to it
    thumbnailUrl: string;
    descriptionModerationStatus: 'pending_review'; // Should always be this
    descriptionModerationReason?: string; // AI reason for flagging description
    descriptionAISuggestedCategory?: string;
    // User who uploaded? Not directly on video model, but useful if available via populate in future
}

interface PendingCommentItem extends BaseModerationDetail {
    text: string;
    textModerationStatus: 'pending_review'; // Should always be this
    textModerationReason?: string; // AI reason for flagging text
    textAISuggestedCategory?: string;
    user?: { _id: string; name?: string; email?: string }; // Populated from Comment model
    video?: { _id: string; title?: string }; // Populated from Comment model
}

const AdminModerationPage = () => {
    const [pendingVideos, setPendingVideos] = useState<PendingVideoItem[]>([]);
    const [pendingComments, setPendingComments] = useState<PendingCommentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAiProvider, setSelectedAiProvider] = useState<'gemini' | 'groq'>('gemini');
    const [aiProviderMessage, setAiProviderMessage] = useState<string | null>(null);

    const fetchPendingItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/moderation/pending');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch pending items: ${response.statusText}`);
            }
            const data = await response.json();
            setPendingVideos(data.pendingVideos || []);
            setPendingComments(data.pendingComments || []);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingItems();
    }, []);

    const handleModerationAction = async (
        contentType: 'videos' | 'comments',
        contentId: string,
        status: 'approved' | 'rejected',
        moderatorReason?: string
    ) => {
        setAiProviderMessage(null); // Clear previous message
        if (selectedAiProvider === 'groq') {
            setAiProviderMessage(
                `Groq AI is a demo feature. Action processed using the default AI (Gemini). For full Groq integration, please contact contact2abhaygupta@gmail.com.`
            );
            // In a real scenario with multiple AI, you might pass selectedAiProvider to the backend
            // For now, the backend defaults to Gemini as per lib/aiModeration.ts modifications
        }

        try {
            const response = await fetch(`/api/admin/moderation/${contentType}/${contentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status, moderatorReason }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update status for ${contentType}/${contentId}`);
            }
            
            // Refresh data after action
            alert(`Successfully ${status} ${contentType.slice(0,-1)} ${contentId}`); // Basic feedback
            fetchPendingItems(); // Re-fetch to update lists

        } catch (err) {
            console.error("Moderation action failed:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while updating status');
            alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`); // Basic error feedback
        }
    };

    const handleApprove = (contentType: 'videos' | 'comments', contentId: string) => {
        handleModerationAction(contentType, contentId, 'approved');
    };

    const handleReject = (contentType: 'videos' | 'comments', contentId: string) => {
        // For Phase 1, we can use a prompt or a default reason.
        // A more sophisticated UI could have a modal for the reason.
        const reason = prompt("Enter reason for rejection (optional):");
        handleModerationAction(contentType, contentId, 'rejected', reason || undefined);
    };

    if (isLoading) {
        return <div className="container mx-auto p-4">Loading moderation queue...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Content Moderation Queue</h1>

            <div className="mb-6 p-3 border rounded-md bg-gray-50">
                <h3 className="text-md font-semibold mb-2">AI Provider Choice (Demo)</h3>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => { setSelectedAiProvider('gemini'); setAiProviderMessage(null); }}
                        className={`px-3 py-1 rounded text-sm font-medium 
                                    ${selectedAiProvider === 'gemini' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Gemini (Default)
                    </button>
                    <button 
                        onClick={() => setSelectedAiProvider('groq')}
                        className={`px-3 py-1 rounded text-sm font-medium 
                                    ${selectedAiProvider === 'groq' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Groq (Demo)
                    </button>
                </div>
                {selectedAiProvider === 'groq' && (
                     <p className="mt-2 text-sm text-purple-700">
                         Note: Groq AI is for demonstration. Actions will be processed using Gemini.
                         For full Groq integration, email: <a href="mailto:contact2abhaygupta@gmail.com" className="underline">contact2abhaygupta@gmail.com</a>.
                     </p>
                )}
            </div>

            {aiProviderMessage && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded text-sm">
                    {aiProviderMessage}
                </div>
            )}

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">Error during last action: {error}</div>}

            <section>
                <h2 className="text-xl font-semibold mb-3">Pending Video Descriptions ({pendingVideos.length})</h2>
                {pendingVideos.length === 0 ? (
                    <p>No video descriptions currently pending review.</p>
                ) : (
                    <ul className="space-y-4">
                        {pendingVideos.map(video => (
                            <li key={video._id} className="p-3 border rounded-md shadow-sm bg-white">
                                <h3 className="font-semibold">Video Title: {video.title}</h3>
                                <p className="text-xs text-gray-500 mb-1">ID: {video._id}</p>
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">Description: <span className="font-mono">{video.description}</span></p>
                                <p className="text-sm mt-1">AI Category: <span className="font-semibold text-orange-600">{video.descriptionAISuggestedCategory || 'N/A'}</span></p>
                                <p className="text-sm">AI Reason: <span className="text-gray-600">{video.descriptionModerationReason || 'N/A'}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Last Updated: {video.updatedAt ? new Date(video.updatedAt).toLocaleString() : 'N/A'}</p>
                                <div className="mt-3 space-x-2">
                                    <button 
                                        onClick={() => handleApprove('videos', video._id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject('videos', video._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Pending Comments ({pendingComments.length})</h2>
                {pendingComments.length === 0 ? (
                    <p>No comments currently pending review.</p>
                ) : (
                    <ul className="space-y-4">
                        {pendingComments.map(comment => (
                            <li key={comment._id} className="p-3 border rounded-md shadow-sm bg-white">
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">Comment: <span className="font-mono">"{comment.text}"</span></p>
                                <p className="text-xs text-gray-500 mb-1">ID: {comment._id}</p>
                                <p className="text-sm">User: <span className="font-semibold">{comment.user?.name || comment.user?._id || 'Unknown User'}</span></p>
                                <p className="text-sm">On Video: <span className="font-semibold">{comment.video?.title || comment.video?._id || 'Unknown Video'}</span></p>
                                <p className="text-sm mt-1">AI Category: <span className="font-semibold text-orange-600">{comment.textAISuggestedCategory || 'N/A'}</span></p>
                                <p className="text-sm">AI Reason: <span className="text-gray-600">{comment.textModerationReason || 'N/A'}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Commented At: {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A'}</p>
                                <div className="mt-3 space-x-2">
                                    <button 
                                        onClick={() => handleApprove('comments', comment._id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject('comments', comment._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default AdminModerationPage; 