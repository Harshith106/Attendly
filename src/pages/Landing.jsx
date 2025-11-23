import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, PieChart, UserCheck, Calculator, Smartphone } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Landing = () => {
    const features = [
        { icon: <Zap size={20} />, text: "Fast & Secure Attendance Scraping" },
        { icon: <PieChart size={20} />, text: "Beautiful Attendance Analytics" },
        { icon: <UserCheck size={20} />, text: "Real-time Progress & Feedback" },
        { icon: <Calculator size={20} />, text: "Smart Attendance Strategist" },
        { icon: <Smartphone size={20} />, text: "Mobile-Friendly Modern UI" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)]/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)]/20 blur-[120px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-12 py-12">

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-3xl text-center"
                >
                    <GlassCard className="p-8 md:p-12 border-2 border-white/5">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
                        >
                            <span className="text-gradient">Attendance Tracker</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-gray-200 mb-2 font-medium"
                        >
                            Your smart companion for accurate, stress-free attendance planning.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-gray-400 mb-8"
                        >
                            Effortless Attendance Management for Students
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-left max-w-lg mx-auto space-y-4 mb-10"
                        >
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + (index * 0.1) }}
                                    className="flex items-center gap-3 text-gray-300"
                                >
                                    <span className="text-[var(--accent)] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                                        {feature.icon}
                                    </span>
                                    {feature.text}
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <Link to="/login">
                                <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                                    Get Started
                                </Button>
                            </Link>
                        </motion.div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;
