import React from 'react';

const AdminSettingsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin AI Settings (Conceptual)</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="mb-4">
          This page is a placeholder for future AI moderation settings.
        </p>
        <p className="mb-4">
          In a future version, administrators might be able to configure AI providers (e.g., select between Gemini, Groq, or other models), adjust sensitivity thresholds, or manage other AI-related parameters from here.
        </p>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <p className="font-bold">Demonstration Purposes</p>
          <p>
            Currently, these UI elements and options are for demonstration and conceptual illustration only. The system defaults to using the Gemini API for content moderation.
          </p>
        </div>
        <p>
          For information on available AI services, custom configurations, or to integrate additional AI providers like Groq, please contact: <a href="mailto:contact2abhaygupta@gmail.com" className="text-blue-600 hover:underline">contact2abhaygupta@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default AdminSettingsPage; 