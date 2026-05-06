import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_DEPTH = 4;
const MAX_ROOT_DEPTH = 3;

// Base geometries and materials for reuse
const branchGeometry = new THREE.CylinderGeometry(0.8, 1, 1, 6);
branchGeometry.translate(0, 0.5, 0);
const branchMaterial = new THREE.MeshStandardMaterial({ color: "#4E342E", roughness: 0.9, flatShading: true });

// Roots are slightly darker and thinner
const rootGeometry = new THREE.CylinderGeometry(0.6, 1, 1, 6);
rootGeometry.translate(0, 0.5, 0);
const rootMaterial = new THREE.MeshStandardMaterial({ color: "#3E2723", roughness: 1.0, flatShading: true });

// Individual flat leaves
const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.1, 0.05, 0.15, 0.2, 0, 0.4);
leafShape.bezierCurveTo(-0.15, 0.2, -0.1, 0.05, 0, 0);
const leafGeometry = new THREE.ShapeGeometry(leafShape);
leafGeometry.translate(0, 0, 0); 

const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#2E7D32",
    side: THREE.DoubleSide,
    roughness: 0.8
});

// Blossoms
const blossomGeometry = new THREE.IcosahedronGeometry(0.15, 0);
const blossomMaterial = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.4, emissive: "#FFFFFF", emissiveIntensity: 0.1 });

// Apples
const appleGeometry = new THREE.SphereGeometry(0.12, 16, 16);
const appleMaterial = new THREE.MeshStandardMaterial({ color: "#D32F2F", roughness: 0.3, metalness: 0.1 });

// Seed Halves
const seedHalfGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI);
const seedMaterial = new THREE.MeshStandardMaterial({ color: "#5D4037", roughness: 0.9 });

const easeOut = (t) => t * (2 - t);

const TreeStages = ({ progress }) => {
    // Refs
    const groupRef = useRef();
    const branchMeshRef = useRef();
    const rootMeshRef = useRef();
    const leafMeshRef = useRef();
    const blossomMeshRef = useRef();
    const appleMeshRef = useRef();
    const seedLeftRef = useRef();
    const seedRightRef = useRef();
    const sproutRef = useRef();
    const sproutLeaf1Ref = useRef();
    const sproutLeaf2Ref = useRef();

    const { branches, roots, leaves, blossoms, apples, highestY } = useMemo(() => {
        const generatedBranches = [];
        const generatedRoots = [];
        const generatedLeaves = [];
        const generatedBlossoms = [];
        const generatedApples = [];
        let maxY = 0;

        function generateRoot(startPos, direction, length, thickness, depth, pStart) {
            const endPos = startPos.clone().add(direction.clone().multiplyScalar(length));
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

            const duration = 15;
            const pEnd = Math.min(pStart + duration, 60); 

            generatedRoots.push({
                startPos, quaternion, length, thickness, pStart, pEnd, isPrimary: depth === 0
            });

            if (depth < MAX_ROOT_DEPTH) {
                const numChildren = depth === 0 ? 3 : 2;
                for (let i = 0; i < numChildren; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const spread = 0.6 + depth * 0.3;
                    
                    const childDir = new THREE.Vector3(
                        Math.sin(angle) * spread,
                        -1 - (Math.random() * 0.5), 
                        Math.cos(angle) * spread
                    ).normalize();

                    const childLength = length * (0.65 + Math.random() * 0.15);
                    const childThickness = thickness * (0.55 + Math.random() * 0.15);
                    const childPStart = pStart + duration * 0.5;
                    
                    if (childPStart < 60) {
                        generateRoot(endPos, childDir, childLength, childThickness, depth + 1, childPStart);
                    }
                }
            }
        }

        function generateBranch(startPos, direction, length, thickness, depth, pStart) {
            const endPos = startPos.clone().add(direction.clone().multiplyScalar(length));
            if (endPos.y > maxY) maxY = endPos.y;

            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

            const duration = 15; 
            const pEnd = Math.min(pStart + duration, 76.6); 

            generatedBranches.push({
                startPos, quaternion, length, thickness, pStart, pEnd, depth
            });

            // Young Plant Stage: Add paired leaves along the main stem (depth 0)
            if (depth === 0) {
                for (let i = 1; i <= 3; i++) {
                    const t = 0.3 + (i * 0.2); // Space them out
                    const leafPStart = pStart + (duration * t);
                    const pos = startPos.clone().lerp(endPos, t);
                    
                    // Pair of leaves
                    for (let j = 0; j < 2; j++) {
                        const side = j === 0 ? 1 : -1;
                        const rot = new THREE.Euler(0, j === 0 ? 0 : Math.PI, Math.PI * 0.2);
                        generatedLeaves.push({
                            position: pos, rotation: rot, baseScale: 0.5, color: new THREE.Color("#4CAF50"), pStart: leafPStart, pEnd: leafPStart + 10, isPaired: true
                        });
                    }
                }
            }

            if (depth < MAX_DEPTH) {
                let numChildren = depth === 0 ? 4 : 3;
                const angleStep = (Math.PI * 2) / numChildren;
                const baseOffset = Math.random() * Math.PI * 2;

                for (let i = 0; i < numChildren; i++) {
                    const spread = 0.4 + depth * 0.2; 
                    const angle = baseOffset + i * angleStep + (Math.random() - 0.5) * 0.2;
                    const rx = Math.sin(angle) * spread;
                    const rz = Math.cos(angle) * spread;

                    const childDir = direction.clone().applyEuler(new THREE.Euler(rx, 0, rz));
                    childDir.y += 0.7; 
                    childDir.normalize();

                    const childLength = length * (0.7 + Math.random() * 0.1);
                    const childThickness = thickness * (0.6 + Math.random() * 0.1);
                    const childPStart = pStart + duration * 0.6;
                    
                    if (childPStart < 76.6) {
                        generateBranch(endPos, childDir, childLength, childThickness, depth + 1, childPStart);
                    }
                }
            }
            
            if (depth >= MAX_DEPTH - 1) {
                const numLeaves = depth === MAX_DEPTH ? 30 : 8;
                
                for (let i = 0; i < numLeaves; i++) {
                    const t = 0.5 + Math.random() * 0.5; 
                    
                    // Rounded canopy logic: distribute spherically but biased upwards
                    const radius = 2.0;
                    const u = Math.random();
                    const v = Math.random() * 0.5 + 0.5; // Bias to top half
                    const theta = u * 2.0 * Math.PI;
                    const phi = Math.acos(2.0 * v - 1.0);
                    const r = Math.cbrt(Math.random()) * radius;
                    
                    const leafOffset = new THREE.Vector3(
                        r * Math.sin(phi) * Math.cos(theta),
                        r * Math.sin(phi) * Math.sin(theta),
                        r * Math.cos(phi)
                    );
                    leafOffset.y += 0.2;

                    const leafPos = startPos.clone().lerp(endPos, t).add(leafOffset);
                    const leafRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    const leafScale = 0.8 + Math.random() * 0.3;
                    const leafColor = new THREE.Color(["#2E7D32", "#388E3C", "#43A047", "#1B5E20"][Math.floor(Math.random() * 4)]);

                    const leafPStart = Math.max(40, pStart + (pEnd - pStart) * t); 
                    const leafPEnd = Math.min(leafPStart + 12, 85);

                    generatedLeaves.push({
                        position: leafPos, rotation: leafRot, baseScale: leafScale, color: leafColor, pStart: leafPStart, pEnd: leafPEnd
                    });

                    // Blossoms and Apples - stage 5
                    if (Math.random() > 0.93) {
                        const blossomStart = 78 + Math.random() * 4; 
                        const blossomEnd = blossomStart + 4;
                        const blossomFade = 88 + Math.random() * 4; 

                        const appleStart = blossomFade;
                        const appleEnd = appleStart + 8;

                        const itemScale = 0.6 + Math.random() * 0.3; 
                        const decPos = leafPos.clone().add(new THREE.Vector3(0, 0.15, 0));

                        generatedBlossoms.push({ position: decPos, baseScale: itemScale, pStart: blossomStart, pEnd: blossomEnd, pFade: blossomFade });
                        generatedApples.push({ position: decPos, baseScale: itemScale, pStart: appleStart, pEnd: appleEnd });
                    }
                }
            }
        }

        generateRoot(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), 1.6, 0.15, 0, 8);
        generateBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 3.0, 0.25, 0, 13.3);

        return { branches: generatedBranches, roots: generatedRoots, leaves: generatedLeaves, blossoms: generatedBlossoms, apples: generatedApples, highestY: maxY };
    }, []);

    // Instanced Meshes Setup
    useEffect(() => {
        const setInstances = (ref, items, useColor = false) => {
            if (!ref.current) return;
            const matrix = new THREE.Matrix4();
            items.forEach((item, i) => {
                if (item.rotation) matrix.makeRotationFromEuler(item.rotation);
                else matrix.identity();
                matrix.setPosition(item.position);
                matrix.scale(new THREE.Vector3(0, 0, 0));
                ref.current.setMatrixAt(i, matrix);
                if (useColor) ref.current.setColorAt(i, item.color);
            });
            ref.current.instanceMatrix.needsUpdate = true;
            if (useColor && ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
        };

        setInstances(leafMeshRef, leaves, true);
        setInstances(blossomMeshRef, blossoms, false);
        setInstances(appleMeshRef, apples, false);

        const setStructuralInstances = (ref, items) => {
            if (!ref.current) return;
            const matrix = new THREE.Matrix4();
            items.forEach((item, i) => {
                matrix.compose(item.startPos, item.quaternion, new THREE.Vector3(0, 0, 0));
                ref.current.setMatrixAt(i, matrix);
            });
            ref.current.instanceMatrix.needsUpdate = true;
        };

        setStructuralInstances(branchMeshRef, branches);
        setStructuralInstances(rootMeshRef, roots);
        
    }, [branches, roots, leaves, blossoms, apples]);

    // Update Transforms per Frame
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.008;
            groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.006;
        }

        // --- Phase 1: Seed (0 - 13.3) ---
        if (seedLeftRef.current && seedRightRef.current) {
            let sScale = 0;
            let sRot = 0;
            let sPosOffset = 0;

            if (progress < 2) sScale = progress / 2;
            else if (progress < 25) sScale = 1;
            else sScale = Math.max(0, 1 - (progress - 25) / 5);

            if (progress > 5 && progress < 13.3) sRot = Math.sin(t * 22) * 0.04;

            if (progress > 8) {
                const crackProgress = Math.min((progress - 8) / 6, 1);
                sRot = crackProgress * Math.PI * 0.2;
                sPosOffset = crackProgress * 0.12;
            }

            seedLeftRef.current.scale.set(sScale, sScale, sScale);
            seedRightRef.current.scale.set(sScale, sScale, sScale);
            seedLeftRef.current.rotation.z = sRot;
            seedRightRef.current.rotation.z = -sRot;
            seedLeftRef.current.position.x = -sPosOffset;
            seedRightRef.current.position.x = sPosOffset;
        }

        // --- Phase 2: Sprout (13.3 - 30) ---
        if (sproutRef.current && sproutLeaf1Ref.current && sproutLeaf2Ref.current) {
            if (progress >= 13.3 && progress < 40) {
                const spT = Math.min((progress - 13.3) / 7, 1); 
                const spFade = progress > 32 ? Math.max(0, 1 - (progress - 32) / 6) : 1; 
                const spScaleY = easeOut(spT) * 1.6;
                const spScaleXZ = (spT * 0.7 + 0.3) * 1.6 * spFade;
                
                sproutRef.current.scale.set(spScaleXZ, spScaleY, spScaleXZ);

                if (progress > 16) {
                    const leafT = Math.min((progress - 16) / 6, 1); 
                    const leafScale = easeOut(leafT) * 0.45 * spFade;
                    
                    sproutLeaf1Ref.current.scale.set(leafScale, leafScale, leafScale);
                    sproutLeaf1Ref.current.position.set(-0.06, spScaleY * 0.5, 0);
                    sproutLeaf1Ref.current.rotation.set(0, 0, Math.PI * 0.25 * leafT);

                    sproutLeaf2Ref.current.scale.set(leafScale, leafScale, leafScale);
                    sproutLeaf2Ref.current.position.set(0.06, spScaleY * 0.5, 0);
                    sproutLeaf2Ref.current.rotation.set(0, Math.PI, Math.PI * 0.25 * leafT);
                } else {
                    sproutLeaf1Ref.current.scale.set(0,0,0);
                    sproutLeaf2Ref.current.scale.set(0,0,0);
                }
            } else {
                sproutRef.current.scale.set(0, 0, 0);
                sproutLeaf1Ref.current.scale.set(0, 0, 0);
                sproutLeaf2Ref.current.scale.set(0, 0, 0);
            }
        }

        // --- Structural Growth (Branches & Roots) ---
        const updateStructuralMesh = (meshRef, items, isRoot = false) => {
            if (!meshRef.current) return;
            const matrix = new THREE.Matrix4();
            items.forEach((item, i) => {
                let currentScaleY = 0;
                let currentScaleXZ = 0;

                if (progress >= item.pStart) {
                    if (progress >= item.pEnd) {
                        currentScaleY = item.length;
                        currentScaleXZ = item.thickness;
                    } else {
                        const rawT = (progress - item.pStart) / (item.pEnd - item.pStart);
                        const easedT = easeOut(rawT);
                        currentScaleY = easedT * item.length;
                        currentScaleXZ = (rawT * 0.75 + 0.25) * item.thickness; 
                    }
                    
                    // Extra thickening for trunk (depth 0) in stage 4-5
                    if (!isRoot && item.depth === 0 && progress > 50) {
                        const thickBonus = 1 + (progress - 50) / 50; 
                        currentScaleXZ *= thickBonus;
                    }
                }
                matrix.compose(item.startPos, item.quaternion, new THREE.Vector3(currentScaleXZ, currentScaleY, currentScaleXZ));
                meshRef.current.setMatrixAt(i, matrix);

                // Root color transition: white -> brown
                if (isRoot) {
                    const colorT = Math.min((progress - 8) / 40, 1); // 8 to 48
                    const rootColor = new THREE.Color("#FFFFFF").lerp(new THREE.Color("#3E2723"), colorT);
                    meshRef.current.setColorAt(i, rootColor);
                }
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
            if (isRoot && meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
        };

        updateStructuralMesh(branchMeshRef, branches, false);
        updateStructuralMesh(rootMeshRef, roots, true);

        // --- Leaves ---
        if (leafMeshRef.current) {
            const leafMatrix = new THREE.Matrix4();
            leaves.forEach((l, i) => {
                let currentScale = 0;
                if (progress >= l.pStart) {
                    if (progress >= l.pEnd) {
                        currentScale = l.baseScale;
                    } else {
                        currentScale = easeOut((progress - l.pStart) / (l.pEnd - l.pStart)) * l.baseScale;
                    }
                    
                    if (currentScale > 0) {
                        const flutter = Math.sin(t * 1.8 + i) * 0.04 * currentScale;
                        const dynamicRot = new THREE.Euler(l.rotation.x + flutter, l.rotation.y, l.rotation.z + flutter);
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

        // --- Blossoms & Apples ---
        if (blossomMeshRef.current) {
            const matrix = new THREE.Matrix4();
            blossoms.forEach((b, i) => {
                let currentScale = 0;
                if (progress >= b.pStart) {
                    if (progress < b.pFade) {
                        const tGrow = Math.min((progress - b.pStart) / (b.pEnd - b.pStart), 1);
                        currentScale = easeOut(tGrow) * b.baseScale;
                    } else {
                        const tFade = Math.max(1 - (progress - b.pFade) / 5, 0);
                        currentScale = tFade * b.baseScale;
                    }
                }
                matrix.identity().setPosition(b.position).scale(new THREE.Vector3(currentScale, currentScale, currentScale));
                blossomMeshRef.current.setMatrixAt(i, matrix);
            });
            blossomMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        if (appleMeshRef.current) {
            const matrix = new THREE.Matrix4();
            apples.forEach((a, i) => {
                let currentScale = 0;
                if (progress >= a.pStart) {
                    const tGrow = Math.min((progress - a.pStart) / (a.pEnd - a.pStart), 1);
                    const pt = tGrow;
                    const c4 = (2 * Math.PI) / 3;
                    currentScale = pt === 0 ? 0 : pt === 1 ? a.baseScale : (Math.pow(2, -10 * pt) * Math.sin((pt * 10 - 0.75) * c4) + 1) * a.baseScale;
                }
                matrix.identity().setPosition(a.position).scale(new THREE.Vector3(currentScale, currentScale, currentScale));
                appleMeshRef.current.setMatrixAt(i, matrix);
            });
            appleMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group ref={groupRef} position={[0, -2.2, 0]} scale={[0.33, 0.33, 0.33]}>
            {/* Soil Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[16, 16]} />
                <meshStandardMaterial color="#2E1A11" roughness={1.0} opacity={0.55} transparent />
            </mesh>

            {/* Seed */}
            <mesh ref={seedLeftRef} geometry={seedHalfGeometry} material={seedMaterial} position={[0, -0.12, 0]} />
            <mesh ref={seedRightRef} geometry={seedHalfGeometry} material={seedMaterial} position={[0, -0.12, 0]} rotation={[0, Math.PI, 0]} />
            
            {/* Sprout */}
            <group>
                <mesh ref={sproutRef} position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.05, 0.5, 8]} />
                    <meshStandardMaterial color="#689F38" roughness={0.8} />
                </mesh>
                <mesh ref={sproutLeaf1Ref} geometry={leafGeometry} material={leafMaterial} />
                <mesh ref={sproutLeaf2Ref} geometry={leafGeometry} material={leafMaterial} />
            </group>

            {/* Main Tree Elements */}
            <instancedMesh ref={rootMeshRef} args={[rootGeometry, rootMaterial, roots.length]} receiveShadow />
            <instancedMesh ref={branchMeshRef} args={[branchGeometry, branchMaterial, branches.length]} castShadow receiveShadow />
            <instancedMesh ref={leafMeshRef} args={[leafGeometry, leafMaterial, leaves.length]} castShadow />
            <instancedMesh ref={blossomMeshRef} args={[blossomGeometry, blossomMaterial, blossoms.length]} />
            <instancedMesh ref={appleMeshRef} args={[appleGeometry, appleMaterial, apples.length]} />
        </group>
    );
};

export default TreeStages;
