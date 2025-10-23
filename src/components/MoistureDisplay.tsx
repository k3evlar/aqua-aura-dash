import { Progress } from "@/components/ui/progress";

interface MoistureDisplayProps {
  value: number;
}

export const MoistureDisplay = ({ value }: MoistureDisplayProps) => {
  const getColor = (val: number) => {
    if (val < 30) return 'text-destructive';
    if (val < 60) return 'text-secondary';
    return 'text-success';
  };

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-end justify-center gap-2">
        <span className={`text-6xl font-bold ${getColor(value)} transition-colors duration-500`}>
          {value}
        </span>
        <span className="text-3xl text-muted-foreground pb-2">%</span>
      </div>
      <p className="text-center text-sm text-muted-foreground font-medium">Soil Moisture Level</p>
      
      <div className="relative px-4">
        <Progress 
          value={value} 
          className="h-3 bg-muted/50"
        />
        <div 
          className="absolute top-0 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: value < 30 
              ? 'linear-gradient(90deg, hsl(0 75% 60%), hsl(15 70% 55%))' 
              : value < 60 
                ? 'linear-gradient(90deg, hsl(175 65% 55%), hsl(180 70% 45%))'
                : 'linear-gradient(90deg, hsl(145 70% 45%), hsl(160 65% 55%))',
            boxShadow: value < 30 
              ? 'var(--glow-danger)' 
              : value < 60 
                ? 'var(--glow-primary)'
                : 'var(--glow-success)'
          }}
        />
      </div>
    </div>
  );
};
