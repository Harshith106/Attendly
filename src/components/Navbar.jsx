import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const location = useLocation();



    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                            <GraduationCap size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Attendance Tracker</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Login button removed */}
                    </div>

                    {/* Mobile Menu Button */}

                </div>
            </div>

            {/* Mobile Menu */}

        </nav>
    );
};

export default Navbar;
