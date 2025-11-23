import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1",
        outline: "border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10",
        ghost: "text-gray-300 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
