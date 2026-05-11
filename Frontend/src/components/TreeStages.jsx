import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_DEPTH = 6;

// Premium Materials
const branchMaterial = new THREE.MeshStandardMaterial({ 
    color: "#5D4037",
    roughness: 0.65, 
    metalness: 0.08,
    flatShading: false 
});

const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#43A047",
    side: THREE.DoubleSide,
    roughness: 0.45,
    metalness: 0.05,
    emissive: "#2E7D32",
    emissiveIntensity: 0.2
});

const appleMaterial = new THREE.MeshStandardMaterial({ 
    color: "#E53935", 
    roughness: 0.25, 
    metalness: 0.25,
    emissive: "#B71C1C",
    emissiveIntensity: 0.35
});

const seedMaterial = new THREE.MeshStandardMaterial({ 
    color: "#8D6E63", 
    roughness: 0.75,
    metalness: 0.1,
    emissive: "#4E342E",
    emissiveIntensity: 0.2
});

// High-fidelity Geometries
const branchGeometry = new THREE.CylinderGeometry(0.65, 1, 1, 18); 
branchGeometry.translate(0, 0.5, 0);

const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.25, 0.12, 0.45, 0.5, 0, 1.0); 
leafShape.bezierCurveTo(-0.45, 0.5, -0.25, 0.12, 0, 0);
const leafGeometry = new THREE.ShapeGeometry(leafShape);

const appleGeometry = new THREE.SphereGeometry(0.22, 24, 24);
const seedGeometry = new THREE.IcosahedronGeometry(0.45, 2);

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

            const duration = 10; 
            const pEnd = Math.min(pStart + duration, 90); 

            generatedBranches.push({
                startPos, quaternion, length, thickness, pStart, pEnd, depth
            });

            if (depth < MAX_DEPTH) {
                // More children for denser canopy
                const numChildren = depth === 0 ? 4 : depth <= 2 ? 3 : 2;
                const angleStep = (Math.PI * 2) / numChildren;
                const baseOffset = Math.random() * Math.PI * 2;

                for (let i = 0; i < numChildren; i++) {
                    const angle = baseOffset + i * angleStep;
                    const spread = 0.45 + depth * 0.28; 
                    
                    const rx = Math.sin(angle) * spread;
                    const rz = Math.cos(angle) * spread;

                    const childDir = direction.clone().applyEuler(new THREE.Euler(rx, 0, rz));
                    childDir.y += 0.25;
                    childDir.normalize();

                    const childLength = length * (0.7 + Math.random() * 0.12);
                    const childThickness = thickness * (0.58 + Math.random() * 0.06);
                    const childPStart = pStart + duration * 0.45;
                    
                    if (childPStart < 85) {
                        generateBranch(endPos, childDir, childLength, childThickness, depth + 1, childPStart);
                    }
                }
            }

            // Dense leaf & apple placement — starts from depth 3
            if (depth >= MAX_DEPTH - 4) {
                const numLeaves = depth === MAX_DEPTH ? 30 : depth >= MAX_DEPTH - 1 ? 18 : 10;
                for (let i = 0; i < numLeaves; i++) {
                    const t = 0.35 + Math.random() * 0.65;
                    const pos = startPos.clone().lerp(endPos, t);
                    
                    // Wider, fuller leaf cluster spread
                    const leafOffset = new THREE.Vector3(
                        (Math.random() - 0.5) * 2.8,
                        (Math.random() - 0.5) * 2.5,
                        (Math.random() - 0.5) * 2.8
                    );
                    const leafPos = pos.add(leafOffset);
                    const leafRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    const leafScale = 1.0 + Math.random() * 0.6;
                    
                    const leafPStart = Math.max(30, pStart + (pEnd - pStart) * t);
                    const leafPEnd = Math.min(leafPStart + 12, 95);

                    generatedLeaves.push({
                        position: leafPos, rotation: leafRot, baseScale: leafScale, pStart: leafPStart, pEnd: leafPEnd
                    });

                    // More apples — lower threshold for density
                    if (depth >= MAX_DEPTH - 2 && Math.random() > 0.6) {
                        const applePStart = 78 + Math.random() * 12;
                        const applePEnd = applePStart + 10;
                        generatedApples.push({
                            position: leafPos.clone().add(new THREE.Vector3(
                                (Math.random() - 0.5) * 0.4,
                                -0.2,
                                (Math.random() - 0.5) * 0.4
                            )),
                            pStart: applePStart, pEnd: applePEnd, baseScale: 1.0 + Math.random() * 0.5
                        });
                    }
                }
            }
        }

        // Taller, wider starting trunk
        generateBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 3.0, 0.22, 0, 10);

        return { branches: generatedBranches, leaves: generatedLeaves, apples: generatedApples };
    }, []);

    const _tempVec = new THREE.Vector3();
    const _tempEuler = new THREE.Euler();
    const _tempMat = new THREE.Matrix4();
    const _tempQuat = new THREE.Quaternion();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle organic sway
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.012;
        }

        if (seedRef.current) {
            let sScale = 0;
            if (progress < 5) sScale = progress / 5;
            else if (progress < 15) sScale = 1;
            else sScale = Math.max(0, 1 - (progress - 15) / 6);
            
            seedRef.current.scale.set(sScale, sScale, sScale);
            seedRef.current.rotation.y = t * 0.6;
            seedRef.current.position.y = 4.5 + Math.sin(t * 2.2) * 0.12;
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
                    
                    if (b.depth === 0 && progress > 40) {
                        sXZ *= (1 + (progress - 40) / 60);
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
                    // Gentle independent leaf flutter
                    const flutter = Math.sin(t * 1.8 + i * 0.7) * 0.1;
                    const flutterZ = Math.cos(t * 1.3 + i * 0.5) * 0.06;
                    _tempEuler.set(l.rotation.x + flutter, l.rotation.y, l.rotation.z + flutterZ, 'XYZ');
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
                    // Gentle apple dangle
                    const dangle = Math.sin(t * 0.9 + i * 1.1) * 0.05;
                    _tempVec.set(scale, scale, scale);
                    const dangledPos = a.position.clone().add(new THREE.Vector3(dangle, 0, dangle));
                    _tempMat.identity().setPosition(dangledPos);
                    _tempMat.scale(_tempVec);
                } else {
                    _tempMat.identity().scale(_tempVec.set(0, 0, 0));
                }
                appleMeshRef.current.setMatrixAt(i, _tempMat);
            });
            appleMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        // Bigger scale: 0.55 → 0.75, positioned lower to fill canvas
        <group ref={groupRef} position={[0, -5.5, 0]} scale={[0.75, 0.75, 0.75]}>
            <mesh ref={seedRef} geometry={seedGeometry} material={seedMaterial} position={[0, 4.5, 0]} />
            <instancedMesh ref={branchMeshRef} args={[branchGeometry, branchMaterial, branches.length]} castShadow receiveShadow />
            <instancedMesh ref={leafMeshRef} args={[leafGeometry, leafMaterial, leaves.length]} castShadow />
            <instancedMesh ref={appleMeshRef} args={[appleGeometry, appleMaterial, apples.length]} castShadow />
        </group>
    );
};

export default TreeStages;
