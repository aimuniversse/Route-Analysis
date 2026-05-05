import React from "react";

const Lighting = () => {
    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                castShadow
            />
            <directionalLight
                position={[-5, 5, 2]}
                intensity={0.8}
                color="#ffffff"
            />
            <spotLight
                position={[0, 10, 0]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
            />
        </>
    );
};

export default Lighting;
