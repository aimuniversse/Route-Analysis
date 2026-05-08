import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_DEPTH = 5;

// Premium Materials with Apple/Tesla aesthetic
const branchMaterial = new THREE.MeshStandardMaterial({ 
    color: "#4E342E", // Lighter brown for better visibility
    roughness: 0.7, 
    metalness: 0.1,
    flatShading: false 
});

const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#4CAF50", // Brighter natural green
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.1,
    emissive: "#2E7D32",
    emissiveIntensity: 0.15
});

const appleMaterial = new THREE.MeshStandardMaterial({ 
    color: "#FF1744", 
    roughness: 0.3, 
    metalness: 0.2,
    emissive: "#D50000",
    emissiveIntensity: 0.3
});

const seedMaterial = new THREE.MeshStandardMaterial({ 
    color: "#795548", 
    roughness: 0.8,
    metalness: 0.1
});

// High-fidelity Geometries
const branchGeometry = new THREE.CylinderGeometry(0.7, 1, 1, 16); 
branchGeometry.translate(0, 0.5, 0);

const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.2, 0.1, 0.4, 0.4, 0, 0.8); 
leafShape.bezierCurveTo(-0.4, 0.4, -0.2, 0.1, 0, 0);
const leafGeometry = new THREE.ShapeGeometry(leafShape);

const appleGeometry = new THREE.SphereGeometry(0.2, 24, 24); // Larger apples
const seedGeometry = new THREE.IcosahedronGeometry(0.4, 2);

const easeOut = (t) => 1 - Math.pow(1 - t, 3); 

const TreeStages = ({ progress }) => {
    const groupRef = useRef();
    const branchMeshRef = useRef();
    const leafMeshRef = useRef();
    const appleMeshRef = useRef();
    const seedRef = useRef();

    const { branches, leaves, apples } = useMemo(() => {
        const generatedBranches = [];
        const generatedLeaves = [];
        const generatedApples = [];

        function generateBranch(startPos, direction, length, thickness, depth, pStart) {
            const endPos = startPos.clone().add(direction.clone().multiplyScalar(length));
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

            const duration = 12; 
            const pEnd = Math.min(pStart + duration, 90); 

            generatedBranches.push({
                startPos, quaternion, length, thickness, pStart, pEnd, depth
            });

            if (depth < MAX_DEPTH) {
                const numChildren = depth === 0 ? 3 : 2;
                const angleStep = (Math.PI * 2) / numChildren;
                const baseOffset = Math.random() * Math.PI * 2;

                for (let i = 0; i < numChildren; i++) {
                    const angle = baseOffset + i * angleStep;
                    // Spread branches more horizontally as they go higher
                    const spread = 0.5 + depth * 0.25; 
                    
                    const rx = Math.sin(angle) * spread;
                    const rz = Math.cos(angle) * spread;

                    const childDir = direction.clone().applyEuler(new THREE.Euler(rx, 0, rz));
                    childDir.y += 0.3; // Less vertical bias for better spread
                    childDir.normalize();

                    const childLength = length * (0.75 + Math.random() * 0.1);
                    const childThickness = thickness * (0.6 + Math.random() * 0.05);
                    const childPStart = pStart + duration * 0.5;
                    
                    if (childPStart < 85) {
                        generateBranch(endPos, childDir, childLength, childThickness, depth + 1, childPStart);
                    }
                }
            }

            // Leaves and Apples logic
            if (depth >= MAX_DEPTH - 3) { // Start leaves earlier
                const numLeaves = depth === MAX_DEPTH ? 20 : 8;
                for (let i = 0; i < numLeaves; i++) {
                    const t = 0.4 + Math.random() * 0.6;
                    const pos = startPos.clone().lerp(endPos, t);
                    
                    // More balanced leaf cluster
                    const leafOffset = new THREE.Vector3(
                        (Math.random() - 0.5) * 2.2,
                        (Math.random() - 0.5) * 2.2,
                        (Math.random() - 0.5) * 2.2
                    );
                    const leafPos = pos.add(leafOffset);
                    const leafRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    const leafScale = 0.8 + Math.random() * 0.5;
                    
                    const leafPStart = Math.max(35, pStart + (pEnd - pStart) * t);
                    const leafPEnd = Math.min(leafPStart + 12, 95);

                    generatedLeaves.push({
                        position: leafPos, rotation: leafRot, baseScale: leafScale, pStart: leafPStart, pEnd: leafPEnd
                    });

                    // Stage 5: Apples
                    if (depth >= MAX_DEPTH - 1 && Math.random() > 0.8) {
                        const applePStart = 82 + Math.random() * 8;
                        const applePEnd = applePStart + 10;
                        generatedApples.push({
                            position: leafPos.clone().add(new THREE.Vector3(0, -0.15, 0)),
                            pStart: applePStart, pEnd: applePEnd, baseScale: 0.9 + Math.random() * 0.4
                        });
                    }
                }
            }
        }

        generateBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 2.5, 0.18, 0, 15);

        return { branches: generatedBranches, leaves: generatedLeaves, apples: generatedApples };
    }, []);

    const _tempVec = new THREE.Vector3();
    const _tempEuler = new THREE.Euler();
    const _tempMat = new THREE.Matrix4();
    const _tempQuat = new THREE.Quaternion();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.04;
        }

        if (seedRef.current) {
            let sScale = 0;
            if (progress < 5) sScale = progress / 5;
            else if (progress < 20) sScale = 1;
            else sScale = Math.max(0, 1 - (progress - 20) / 5);
            
            seedRef.current.scale.set(sScale, sScale, sScale);
            seedRef.current.rotation.y = t * 0.5;
            seedRef.current.position.y = 4.0 + Math.sin(t * 2) * 0.1;
        }

        if (branchMeshRef.current) {
            branches.forEach((b, i) => {
                let sY = 0;
                let sXZ = 0;
                if (progress >= b.pStart) {
                    const rawT = Math.min((progress - b.pStart) / (b.pEnd - b.pStart), 1);
                    const easedT = easeOut(rawT);
                    sY = easedT * b.length;
                    sXZ = (rawT * 0.8 + 0.2) * b.thickness;
                    
                    if (b.depth === 0 && progress > 50) {
                        sXZ *= (1 + (progress - 50) / 50);
                    }
                }
                _tempVec.set(sXZ, sY, sXZ);
                _tempMat.compose(b.startPos, b.quaternion, _tempVec);
                branchMeshRef.current.setMatrixAt(i, _tempMat);
            });
            branchMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        if (leafMeshRef.current) {
            leaves.forEach((l, i) => {
                let scale = 0;
                if (progress >= l.pStart) {
                    const rawT = Math.min((progress - l.pStart) / (l.pEnd - l.pStart), 1);
                    scale = easeOut(rawT) * l.baseScale;
                }
                if (scale > 0) {
                    const flutter = Math.sin(t * 1.5 + i) * 0.08;
                    _tempEuler.set(l.rotation.x + flutter, l.rotation.y, l.rotation.z + flutter, 'XYZ');
                    _tempQuat.setFromEuler(_tempEuler);
                    _tempVec.set(scale, scale, scale);
                    _tempMat.compose(l.position, _tempQuat, _tempVec);
                } else {
                    _tempMat.identity().scale(_tempVec.set(0, 0, 0));
                }
                leafMeshRef.current.setMatrixAt(i, _tempMat);
            });
            leafMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        if (appleMeshRef.current) {
            apples.forEach((a, i) => {
                let scale = 0;
                if (progress >= a.pStart) {
                    const rawT = Math.min((progress - a.pStart) / (a.pEnd - a.pStart), 1);
                    scale = easeOut(rawT) * a.baseScale;
                }
                if (scale > 0) {
                    _tempVec.set(scale, scale, scale);
                    _tempMat.identity().setPosition(a.position).scale(_tempVec);
                } else {
                    _tempMat.identity().scale(_tempVec.set(0, 0, 0));
                }
                appleMeshRef.current.setMatrixAt(i, _tempMat);
            });
            appleMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group ref={groupRef} position={[0, -4.5, 0]} scale={[0.55, 0.55, 0.55]}>
            <mesh ref={seedRef} geometry={seedGeometry} material={seedMaterial} position={[0, 4.5, 0]} />
            <instancedMesh ref={branchMeshRef} args={[branchGeometry, branchMaterial, branches.length]} castShadow receiveShadow />
            <instancedMesh ref={leafMeshRef} args={[leafGeometry, leafMaterial, leaves.length]} castShadow />
            <instancedMesh ref={appleMeshRef} args={[appleGeometry, appleMaterial, apples.length]} />
        </group>
    );
};

export default TreeStages;
