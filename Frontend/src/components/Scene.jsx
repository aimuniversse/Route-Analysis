import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import TreeStages from "./TreeStages";
import Lighting from "./lighting";

const Scene = ({ progress }) => {
    return (
        <Canvas
            shadows
            camera={{ position: [2, 1, 6], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <Lighting />
                <TreeStages progress={progress} />
                <ContactShadows 
                    position={[0, -2.2, 0]} 
                    opacity={0.3} 
                    scale={10} 
                    blur={2} 
                    far={4} 
                />
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 2.5} 
                    maxPolarAngle={Math.PI / 2} 
                />
            </Suspense>
        </Canvas>
    );
};

export default Scene;
