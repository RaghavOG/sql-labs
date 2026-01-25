export default function Logo({ className = '' }: { className?: string }) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Icon */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-orange-500"
          >
            <ellipse cx="12" cy="5" rx="7" ry="3" stroke="currentColor" strokeWidth="2" />
            <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" stroke="currentColor" strokeWidth="2" />
            <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
  
        {/* Text */}
        <div className="flex flex-col leading-none">
          <span className="text-white font-semibold text-base tracking-wide">
            SQL
          </span>
          <span className="text-orange-500 font-medium text-xs tracking-wider">
            LABS
          </span>
        </div>
      </div>
    );
  }
  