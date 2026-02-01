const GradientMesh = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base layer */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]">
        {/* Primary blue blob */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] animate-mesh-1"
          style={{ 
            background: 'radial-gradient(circle, hsl(217 91% 56%) 0%, transparent 70%)',
            top: '-20%',
            left: '-10%',
          }} 
        />
        
        {/* Secondary blue blob */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-mesh-2"
          style={{ 
            background: 'radial-gradient(circle, hsl(200 100% 56%) 0%, transparent 70%)',
            top: '40%',
            right: '-15%',
          }} 
        />
        
        {/* Teal accent blob */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[110px] animate-mesh-3"
          style={{ 
            background: 'radial-gradient(circle, hsl(180 67% 38%) 0%, transparent 70%)',
            bottom: '-25%',
            left: '20%',
          }} 
        />
        
        {/* Subtle center glow */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[80px] animate-mesh-4"
          style={{ 
            background: 'radial-gradient(circle, hsl(220 80% 50%) 0%, transparent 70%)',
            top: '30%',
            left: '40%',
          }} 
        />
      </div>
      
      {/* Noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GradientMesh;
