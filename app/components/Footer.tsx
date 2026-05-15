import { Play } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


const Footer = () => {
  return (
<footer className="py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">ReelsPro</h3>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-gray-400 hover:text-reelspro-blue transition-colors">About</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Careers</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Press</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-reelspro-blue transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-reelspro-blue transition-colors">Pricing</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Enterprise</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Help Center</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Tutorials</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Documentation</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Privacy</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Terms</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Cookies</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-reelspro-blue transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <Play className="h-6 w-6 text-reelspro-blue mr-2" fill="#4CC9F0" />
                <span className="text-xl font-bold">
                  Reels<span className="text-reelspro-blue">Pro</span>
                </span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ReelsPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
