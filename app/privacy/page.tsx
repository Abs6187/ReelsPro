import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-8">
          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Introduction</h2>
            <p className="text-gray-300">
              At ReelsPro, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this 
              privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the platform.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Personal Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Name and email address</li>
                <li>Profile information</li>
                <li>Content you upload</li>
                <li>Comments and interactions</li>
                <li>Payment information</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Pages visited</li>
                <li>Time and date of visits</li>
                <li>Device information</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational security measures to protect your 
              personal information from unauthorized access, disclosure, alteration, and destruction. 
              However, please note that no method of transmission over the Internet or electronic 
              storage is 100% secure.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Your Rights</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
            </ul>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:<br />
              Email: privacy@reelspro.com<br />
              Address: 123 Creator Street, Digital City, DC 12345, United States
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date.<br /><br />
              Last Updated: May 7, 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 
