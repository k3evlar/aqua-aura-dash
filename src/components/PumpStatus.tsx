interface PumpStatusProps {
  isOn: boolean;
}

export const PumpStatus = ({ isOn }: PumpStatusProps) => {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div className="relative">
        <div 
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            isOn 
              ? 'bg-success glow-success animate-pulse-glow' 
              : 'bg-muted'
          }`}
        >
          <div className={`w-14 h-14 rounded-full ${isOn ? 'bg-success-foreground' : 'bg-muted-foreground'} flex items-center justify-center`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`w-8 h-8 ${isOn ? 'text-success' : 'text-muted'}`}
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
        </div>
        {isOn && (
          <div className="absolute inset-0 rounded-full bg-success opacity-30 animate-ping" />
        )}
      </div>
      <div className="text-left">
        <p className="text-sm text-muted-foreground font-medium">Pump Status</p>
        <p className={`text-2xl font-bold ${isOn ? 'text-success' : 'text-muted-foreground'}`}>
          {isOn ? 'ON' : 'OFF'}
        </p>
      </div>
    </div>
  );
};
