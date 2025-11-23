import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[var(--background)] border-t border-white/10 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Attendance Tracker</h3>
                        <p className="text-gray-400 text-sm">By <span className="text-white font-medium">Harshith</span></p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com/Harshith106" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/p-harshith-09b357354/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://harshith-dev.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                            <Globe size={24} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                    <p>&copy; 2025 Attendance Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
