import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_DEPTH = 3; // 0=trunk, 1=primary, 2=secondary, 3=tertiary

// Base geometries and materials for reuse
const branchGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
branchGeometry.translate(0, 0.5, 0); // Origin at base
const branchMaterial = new THREE.MeshStandardMaterial({ color: "#3E2723", roughness: 1 });

const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.1, 0.05, 0.15, 0.2, 0, 0.4);
leafShape.bezierCurveTo(-0.15, 0.2, -0.1, 0.05, 0, 0);
const leafGeometry = new THREE.ShapeGeometry(leafShape);
// Ensure pivot is at the base of the leaf
leafGeometry.translate(0, 0, 0); 

const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#2E7D32",
    side: THREE.DoubleSide,
    roughness: 0.8
});

// Helper for smooth interpolation (like GSAP's power2.out)
const easeOut = (t) => t * (2 - t);

const TreeStages = ({ progress }) => {
    const groupRef = useRef();
    const branchMeshRef = useRef();
    const leafMeshRef = useRef();
    const fruitRef = useRef();
    const seedRef = useRef();
    const sproutRef = useRef();

    // 1. Generate Tree Structure
    const { branches, leaves, highestY } = useMemo(() => {
        const generatedBranches = [];
        const generatedLeaves = [];
        let maxY = 0;

        function generateBranch(startPos, direction, length, thickness, depth, pStart) {
            const endPos = startPos.clone().add(direction.clone().multiplyScalar(length));
            if (endPos.y > maxY) maxY = endPos.y;

            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

            // Growth logic
            const duration = 15; // 15 progress units
            const pEnd = Math.min(pStart + duration, 75);

            generatedBranches.push({
                startPos,
                quaternion,
                length,
                thickness, // base radius
                pStart,
                pEnd
            });

            if (depth < MAX_DEPTH) {
                const numChildren = Math.floor(Math.random() * 2) + 2; // 2 to 3
                for (let i = 0; i < numChildren; i++) {
                    const spread = 0.4 + depth * 0.3; // Angle spread increases with depth
                    const rx = (Math.random() - 0.5) * spread;
                    const rz = (Math.random() - 0.5) * spread;

                    // Tend upwards slightly
                    const childDir = direction.clone().applyEuler(new THREE.Euler(rx, 0, rz));
                    childDir.y += 0.4; // Upward bias
                    childDir.normalize();

                    const childLength = length * (0.6 + Math.random() * 0.2); // 60-80% of parent length
                    const childThickness = thickness * (0.6 + Math.random() * 0.1);

                    const childPStart = pStart + duration * 0.6; // Start child when parent is 60% grown
                    
                    // Don't generate branches if they start too late
                    if (childPStart < 75) {
                        generateBranch(endPos, childDir, childLength, childThickness, depth + 1, childPStart);
                    }
                }
            } else {
                // Terminal branch -> Generate leaves
                const numLeaves = 6 + Math.floor(Math.random() * 6);
                for (let i = 0; i < numLeaves; i++) {
                    const leafSpread = 0.5;
                    const lx = (Math.random() - 0.5) * leafSpread;
                    const ly = (Math.random() - 0.5) * leafSpread;
                    const lz = (Math.random() - 0.5) * leafSpread;
                    const leafPos = endPos.clone().add(new THREE.Vector3(lx, ly, lz));

                    const leafRot = new THREE.Euler(
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    );
                    const leafScale = 0.4 + Math.random() * 0.5;
                    
                    // Vary leaf colors naturally
                    const leafColor = new THREE.Color(["#1B5E20", "#2E7D32", "#388E3C", "#4CAF50"][Math.floor(Math.random() * 4)]);

                    const leafPStart = pEnd - 5; // Leaves start slightly before branch finishes
                    const leafPEnd = Math.min(leafPStart + 15, 85);

                    generatedLeaves.push({
                        position: leafPos,
                        rotation: leafRot,
                        baseScale: leafScale,
                        color: leafColor,
                        pStart: leafPStart,
                        pEnd: leafPEnd
                    });
                }
            }
        }

        // Trunk starts at progress 10. Origin is 0,0,0
        generateBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1.6, 0.08, 0, 10);

        return { branches: generatedBranches, leaves: generatedLeaves, highestY: maxY };
    }, []);

    // 2. Setup Instanced Meshes on Mount
    useEffect(() => {
        if (leafMeshRef.current) {
            const leafMatrix = new THREE.Matrix4();
            leaves.forEach((l, i) => {
                leafMatrix.makeRotationFromEuler(l.rotation);
                leafMatrix.setPosition(l.position);
                leafMatrix.scale(new THREE.Vector3(0, 0, 0)); // Start invisible
                leafMeshRef.current.setMatrixAt(i, leafMatrix);
                leafMeshRef.current.setColorAt(i, l.color);
            });
            leafMeshRef.current.instanceMatrix.needsUpdate = true;
            if (leafMeshRef.current.instanceColor) leafMeshRef.current.instanceColor.needsUpdate = true;
        }

        if (branchMeshRef.current) {
            const branchMatrix = new THREE.Matrix4();
            branches.forEach((b, i) => {
                // Initialize all to 0 scale
                branchMatrix.compose(b.startPos, b.quaternion, new THREE.Vector3(0, 0, 0));
                branchMeshRef.current.setMatrixAt(i, branchMatrix);
            });
            branchMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [branches, leaves]);

    // 3. Update Transforms per Frame based on Progress
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        // Gentle overall tree sway
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.015;
            groupRef.current.rotation.x = Math.cos(t * 0.4) * 0.01;
        }

        // --- Stage 1: Seed (0-15) ---
        if (seedRef.current) {
            if (progress < 15) {
                // Seed scales up from 0 to 5, holds, then shrinks/disappears by 15
                let seedScale = 0;
                if (progress < 5) seedScale = (progress / 5) * 0.2;
                else if (progress < 12) seedScale = 0.2;
                else seedScale = 0.2 * Math.max(0, 1 - (progress - 12) / 3);
                
                seedRef.current.scale.set(seedScale, seedScale, seedScale);
                seedRef.current.rotation.y = t * 0.5;
            } else {
                seedRef.current.scale.set(0, 0, 0);
            }
        }

        // --- Stage 2: Sprout (10-25) ---
        if (sproutRef.current) {
            if (progress >= 10 && progress < 25) {
                const sp = Math.min((progress - 10) / 5, 1); 
                const spFade = progress > 20 ? Math.max(0, 1 - (progress - 20) / 5) : 1;
                sproutRef.current.scale.set(sp * spFade, sp * spFade, sp * spFade);
            } else {
                sproutRef.current.scale.set(0, 0, 0);
            }
        }

        // --- Stage 3: Branches (10-75) ---
        if (branchMeshRef.current) {
            const branchMatrix = new THREE.Matrix4();
            branches.forEach((b, i) => {
                let currentScaleY = 0;
                let currentScaleXZ = 0;

                if (progress >= b.pStart) {
                    if (progress >= b.pEnd) {
                        currentScaleY = b.length;
                        currentScaleXZ = b.thickness;
                    } else {
                        const rawT = (progress - b.pStart) / (b.pEnd - b.pStart);
                        const easedT = easeOut(rawT);
                        currentScaleY = easedT * b.length;
                        // Thickness grows slightly slower than length initially
                        currentScaleXZ = (rawT * 0.8 + 0.2) * b.thickness; 
                    }
                }

                branchMatrix.compose(
                    b.startPos,
                    b.quaternion,
                    new THREE.Vector3(currentScaleXZ, currentScaleY, currentScaleXZ)
                );
                branchMeshRef.current.setMatrixAt(i, branchMatrix);
            });
            branchMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        // --- Stage 4: Leaves (after branches) ---
        if (leafMeshRef.current) {
            const leafMatrix = new THREE.Matrix4();
            leaves.forEach((l, i) => {
                let currentScale = 0;
                if (progress >= l.pStart) {
                    if (progress >= l.pEnd) {
                        currentScale = l.baseScale;
                    } else {
                        const easedT = easeOut((progress - l.pStart) / (l.pEnd - l.pStart));
                        currentScale = easedT * l.baseScale;
                    }
                    
                    if (currentScale > 0) {
                        // Add wind flutter
                        const flutterX = Math.sin(t * 2 + i) * 0.05 * currentScale;
                        const flutterZ = Math.cos(t * 1.5 + i) * 0.05 * currentScale;
                        const dynamicRot = new THREE.Euler(
                            l.rotation.x + flutterX,
                            l.rotation.y,
                            l.rotation.z + flutterZ
                        );
                        leafMatrix.makeRotationFromEuler(dynamicRot);
                        leafMatrix.setPosition(l.position);
                        leafMatrix.scale(new THREE.Vector3(currentScale, currentScale, currentScale));
                    } else {
                        leafMatrix.identity().scale(new THREE.Vector3(0,0,0));
                    }
                } else {
                    leafMatrix.identity().scale(new THREE.Vector3(0,0,0));
                }
                leafMeshRef.current.setMatrixAt(i, leafMatrix);
            });
            leafMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        // --- Stage 5: Fruit (85-100) ---
        if (fruitRef.current) {
            if (progress >= 85) {
                let fruitScale = 0;
                if (progress >= 95) {
                    fruitScale = 1;
                } else {
                    const pt = (progress - 85) / 10;
                    // Elastic pop ease
                    const c4 = (2 * Math.PI) / 3;
                    fruitScale = pt === 0 ? 0 : pt === 1 ? 1 : Math.pow(2, -10 * pt) * Math.sin((pt * 10 - 0.75) * c4) + 1;
                }
                fruitRef.current.scale.set(fruitScale, fruitScale, fruitScale);
                
                // Position dynamically at the top of the tree, add floating effect
                fruitRef.current.position.y = highestY + 0.3 + Math.sin(t * 2) * 0.05;
                fruitRef.current.rotation.y = t;
            } else {
                fruitRef.current.scale.set(0, 0, 0);
            }
        }
    });

    return (
        <group ref={groupRef} position={[0, -2.0, 0]}>
            {/* Seed */}
            <mesh ref={seedRef} position={[0, 0.1, 0]}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial color="#5D4037" roughness={0.9} />
            </mesh>
            
            {/* Early Sprout */}
            <mesh ref={sproutRef} position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.04, 0.6, 8]} />
                <meshStandardMaterial color="#689F38" roughness={0.8} />
            </mesh>

            {/* Branches (Instanced) */}
            <instancedMesh
                ref={branchMeshRef}
                args={[branchGeometry, branchMaterial, branches.length]}
                castShadow
                receiveShadow
            />

            {/* Leaves (Instanced) */}
            <instancedMesh
                ref={leafMeshRef}
                args={[leafGeometry, leafMaterial, leaves.length]}
                castShadow
            />

            {/* Tickmybus Fruit Bloom */}
            <mesh ref={fruitRef} position={[0, highestY, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    color="#D80000"
                    emissive="#D80000"
                    emissiveIntensity={0.6}
                    roughness={0.1}
                    metalness={0.4}
                />
            </mesh>
        </group>
    );
};

export default TreeStages;
