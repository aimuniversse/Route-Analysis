import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import TreeStages from "./TreeStages";
import Lighting from "./lighting";

const Scene = ({ progress }) => {
    return (
        <Canvas
            shadows
            onCreated={({ gl }) => {
                gl.shadowMap.type = THREE.PCFShadowMap;
            }}
            camera={{ position: [2.5, 1.5, 8], fov: 45 }}
            gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
            }}
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
