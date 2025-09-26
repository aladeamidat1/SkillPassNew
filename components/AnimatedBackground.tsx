
import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import { useTheme } from '../App';

function Stars(props: any) {
  const ref = useRef<any>(null);
  const { theme } = props;

  // Generate stars with proper positioning
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    random.inSphere(positions, { radius: 1.5 });
    return positions;
  });

  const primaryColor = useMemo(() => {
    return theme === 'dark' ? '#8b5cf6' : '#a78bfa';
  }, [theme]);

  useFrame((state, delta) => {
    // Animate the rotation of the particle cloud
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points 
      ref={ref} 
      positions={sphere} 
      stride={3} 
      frustumCulled={false} 
      rotation={[0, 0, Math.PI / 4]} 
      {...props}
    >
      <PointMaterial
        transparent
        color={primaryColor}
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
        alphaTest={0.01}
      />
    </Points>
  );
}

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      {/* The animated gradient layer */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/20 dark:from-indigo-900/30 dark:via-purple-900/10 dark:to-blue-900/30 animate-gradient-bg" 
           style={{ backgroundSize: '400% 400%' }}>
      </div>
      
      {/* Three.js Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        frameloop="demand" // Reduce CPU usage when not in focus
      >
        <Stars theme={theme} />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;