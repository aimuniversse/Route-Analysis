import React from "react";

const Lighting = () => {
    return (
        <>
            <ambientLight intensity={0.6} />
            <hemisphereLight intensity={0.5} groundColor="#000000" />
            <spotLight
                position={[15, 20, 15]}
                angle={0.2}
                penumbra={1}
                intensity={3}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
                position={[-10, 10, 5]}
                intensity={0.8}
                color="#ffffff"
            />
            <directionalLight
                position={[0, 5, 10]} // Front fill light
                intensity={1.2}
                color="#ffffff"
            />
        </>
    );
};

export default Lighting;
