import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const BunkCalculator = () => {
    const [formData, setFormData] = useState({
        totalClasses: '',
        attendedClasses: '',
        desiredPercentage: 75,
        classesPerWeek: ''
    });

    const [result, setResult] = useState(null);
    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
        if (formData.totalClasses && formData.attendedClasses) {
            const total = parseInt(formData.totalClasses);
            const attended = parseInt(formData.attendedClasses);
            if (total > 0) {
                setCurrentPercentage(((attended / total) * 100).toFixed(2));
            }
        }
    }, [formData.totalClasses, formData.attendedClasses]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateBunk = () => {
        const T = parseInt(formData.totalClasses);
        const A = parseInt(formData.attendedClasses);
        const D = parseInt(formData.desiredPercentage);
        const W = parseInt(formData.classesPerWeek);

        if (!T || !A || !D || !W) return;

        // Formula: B_max = Floor(A + W - (D/100) * (T + W))
        const maxBunk = Math.floor(A + W - (D / 100) * (T + W));

        setResult(maxBunk);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="mb-6">
                    <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                </div>

                <GlassCard className="p-8 border-t border-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <Calculator size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Attendance Strategist</h1>
                        <p className="text-gray-400">Optimize your schedule. Calculate exactly how many classes you can afford to miss while staying on track.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Total Classes Held</label>
                            <input
                                type="number"
                                name="totalClasses"
                                value={formData.totalClasses}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/50 transition-all"
                                placeholder="e.g., 100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Classes Attended</label>
                            <input
                                type="number"
                                name="attendedClasses"
                                value={formData.attendedClasses}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/50 transition-all"
                                placeholder="e.g., 80"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Desired Percentage (%)</label>
                            <input
                                type="number"
                                name="desiredPercentage"
                                value={formData.desiredPercentage}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/50 transition-all"
                                placeholder="e.g., 75"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Classes Per Week</label>
                            <input
                                type="number"
                                name="classesPerWeek"
                                value={formData.classesPerWeek}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/50 transition-all"
                                placeholder="e.g., 10"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="text-gray-400 text-sm">
                            Current Attendance: <span className={`font-bold ${currentPercentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>{currentPercentage}%</span>
                        </div>
                        <Button onClick={calculateBunk} size="lg" className="w-full md:w-auto min-w-[200px]">
                            Calculate
                        </Button>
                    </div>

                    {result !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-6 rounded-xl border ${result >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} text-center`}
                        >
                            <h3 className="text-lg font-medium text-white mb-2">Result</h3>
                            {result >= 0 ? (
                                <p className="text-gray-200">
                                    You can safely skip <span className="text-3xl font-bold text-green-400 mx-2">{result}</span> classes this week.
                                </p>
                            ) : (
                                <p className="text-gray-200">
                                    You cannot skip any classes. You need to attend <span className="text-3xl font-bold text-red-400 mx-2">{Math.abs(result)}</span> more classes to reach your target.
                                </p>
                            )}
                        </motion.div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex items-start gap-3 text-gray-400 text-sm">
                            <Info size={20} className="shrink-0 text-[var(--accent)] mt-0.5" />
                            <p>
                                This calculator assumes you attend all other classes in the week except the ones you skip.
                                Formula: B<sub>max</sub> = Floor(A + W - (D/100) × (T + W))
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default BunkCalculator;
