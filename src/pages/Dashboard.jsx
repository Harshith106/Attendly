import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { PieChart, CheckCircle, AlertCircle, CheckSquare, Square, User, LogOut, TrendingUp, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { attendanceData } = location.state || {};

    // Redirect if no data (e.g. direct access)
    useEffect(() => {
        if (!attendanceData) {
            navigate('/login');
        }
    }, [attendanceData, navigate]);

    if (!attendanceData) return null;

    const studentInfo = {
        name: attendanceData.student_name,
        rollNumber: attendanceData.roll_number,
    };

    // Transform API courses to match component structure
    const courses = useMemo(() => {
        return attendanceData.courses.map((c, index) => ({
            id: index,
            name: c.name,
            attended: c.attended,
            conducted: c.conducted
        }));
    }, [attendanceData]);

    // State for selected courses (default to all selected)
    const [selectedCourses, setSelectedCourses] = useState(courses.map(c => c.id));

    // Toggle course selection
    const toggleCourse = (id) => {
        setSelectedCourses(prev =>
            prev.includes(id)
                ? prev.filter(cId => cId !== id)
                : [...prev, id]
        );
    };

    // Select All / Deselect All
    const toggleAll = () => {
        if (selectedCourses.length === courses.length) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(courses.map(c => c.id));
        }
    };

    // Calculate dynamic stats (Aggregate for Selected)
    const stats = useMemo(() => {
        const selected = courses.filter(c => selectedCourses.includes(c.id));
        const totalAttended = selected.reduce((acc, curr) => acc + curr.attended, 0);
        const totalConducted = selected.reduce((acc, curr) => acc + curr.conducted, 0);
        const percentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(2) : 0;

        return {
            attended: totalAttended,
            conducted: totalConducted,
            percentage: parseFloat(percentage)
        };
    }, [selectedCourses]);

    // Calculate total stats (Static - All Courses)
    const totalStats = useMemo(() => {
        const totalAttended = courses.reduce((acc, curr) => acc + curr.attended, 0);
        const totalConducted = courses.reduce((acc, curr) => acc + curr.conducted, 0);
        const percentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(2) : 0;

        return {
            attended: totalAttended,
            conducted: totalConducted,
            percentage: parseFloat(percentage)
        };
    }, []);

    const getStatusColor = (percentage) => {
        if (percentage >= 75) return "text-emerald-400";
        if (percentage >= 65) return "text-amber-400";
        return "text-rose-400";
    };

    const getStatusBadge = (percentage) => {
        if (percentage >= 75) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
        if (percentage >= 65) return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]";
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
                        <p className="text-gray-400 mt-1 text-lg">Welcome back, <span className="text-[var(--accent)] font-semibold">{studentInfo.name}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-3">
                            <div className="p-1.5 bg-white/10 rounded-full">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="text-white font-mono font-medium">{studentInfo.rollNumber}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/login')}
                            className="rounded-full"
                        >
                            <LogOut size={18} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </motion.div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* Hero Card: Overall Attendance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-3 lg:col-span-2 row-span-2"
                    >
                        <GlassCard className="h-full flex flex-col justify-between p-8 relative overflow-hidden group border-[var(--accent)]/30">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className="mb-4 inline-flex p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
                                        <PieChart size={28} />
                                    </div>
                                    <h3 className="text-gray-400 font-medium text-lg">Overall Attendance</h3>
                                    <p className="text-sm text-gray-500">Across all subjects</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusBadge(totalStats.percentage)}`}>
                                    {totalStats.percentage >= 75 ? "Safe Zone" : "Shortage"}
                                </div>
                            </div>

                            <div className="relative z-10 mt-8">
                                <div className={`text-7xl sm:text-8xl font-bold tracking-tighter ${getStatusColor(totalStats.percentage)} drop-shadow-2xl`}>
                                    {totalStats.percentage}%
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Secondary Hero: Selected Aggregate */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-3 lg:col-span-2"
                    >
                        <GlassCard className="h-full p-6 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp size={20} className="text-[var(--primary)]" />
                                    <h3 className="text-gray-300 font-medium">Selected Aggregate</h3>
                                </div>
                                <div className={`text-4xl font-bold ${getStatusColor(stats.percentage)}`}>
                                    {stats.percentage}%
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Based on {selectedCourses.length} courses</p>
                            </div>

                            {/* Mini Progress Circle or Visual */}
                            <div className="relative z-10 h-16 w-16 rounded-full border-4 border-white/5 flex items-center justify-center">
                                <div className={`h-12 w-12 rounded-full ${stats.percentage >= 75 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Small Stat: Attended */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-1"
                    >
                        <GlassCard className="h-full p-6 flex flex-col justify-center hover:bg-white/5 transition-colors">
                            <div className="mb-3 text-emerald-400">
                                <CheckCircle size={24} />
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.attended}</div>
                            <p className="text-sm text-gray-500">Classes Attended</p>
                        </GlassCard>
                    </motion.div>

                    {/* Small Stat: Conducted */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-1"
                    >
                        <GlassCard className="h-full p-6 flex flex-col justify-center hover:bg-white/5 transition-colors">
                            <div className="mb-3 text-blue-400">
                                <BookOpen size={24} />
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.conducted}</div>
                            <p className="text-sm text-gray-500">Classes Conducted</p>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Course List Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Course Details</h2>
                            <p className="text-gray-400 text-sm">Manage your selection to calculate potential attendance</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleAll}
                            className="text-[var(--accent)] hover:text-white hover:bg-[var(--accent)]/10"
                        >
                            {selectedCourses.length === courses.length ? 'Deselect All' : 'Select All'}
                        </Button>
                    </div>

                    {/* Desktop View: Floating Rows */}
                    <div className="hidden md:block space-y-3">
                        {courses.map((course) => {
                            const percentage = course.conducted > 0 ? ((course.attended / course.conducted) * 100).toFixed(2) : 0;
                            const isSelected = selectedCourses.includes(course.id);

                            return (
                                <motion.div
                                    key={course.id}
                                    whileHover={{ scale: 1.01, x: 4 }}
                                    onClick={() => toggleCourse(course.id)}
                                    className={`
                                        group relative flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-300
                                        ${isSelected
                                            ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]'
                                            : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className={`transition-colors duration-300 ${isSelected ? 'text-[var(--accent)]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                            {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">{course.name}</h4>
                                            <p className="text-gray-500 text-sm mt-0.5">{course.attended} / {course.conducted} classes</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <span className={`text-2xl font-bold ${getStatusColor(percentage)}`}>
                                                {percentage}%
                                            </span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(percentage)}`}>
                                            {percentage >= 75 ? "Safe" : "Shortage"}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Mobile View: Stacked Cards */}
                    <div className="md:hidden grid grid-cols-1 gap-4">
                        {courses.map((course) => {
                            const percentage = course.conducted > 0 ? ((course.attended / course.conducted) * 100).toFixed(2) : 0;
                            const isSelected = selectedCourses.includes(course.id);

                            return (
                                <motion.div
                                    key={course.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleCourse(course.id)}
                                    className={`
                                        p-5 rounded-2xl border transition-all duration-300
                                        ${isSelected
                                            ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30'
                                            : 'bg-white/5 border-white/5'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-white font-medium text-lg leading-tight flex-1 mr-4">{course.name}</h4>
                                        <div className={`transition-colors ${isSelected ? 'text-[var(--accent)]' : 'text-gray-600'}`}>
                                            {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className={`text-3xl font-bold ${getStatusColor(percentage)}`}>
                                                {percentage}%
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">{course.attended} / {course.conducted} classes</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(percentage)}`}>
                                            {percentage >= 75 ? "Safe" : "Shortage"}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>
        </div >
    );
};

export default Dashboard;
