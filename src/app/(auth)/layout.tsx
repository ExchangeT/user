export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#f4c430]/5 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#ff6b35]/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8b5cf6]/3 rounded-full blur-3xl" />
                {/* Cricket-themed floating elements */}
                <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float">🏏</div>
                <div className="absolute top-40 right-32 text-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>⚡</div>
                <div className="absolute bottom-32 left-40 text-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🎯</div>
                <div className="absolute bottom-20 right-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🏆</div>
            </div>
            {/* Content */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {children}
            </div>
        </div>
    );
}
