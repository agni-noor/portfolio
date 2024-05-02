"use client";

import * as THREE from 'three';
import {Canvas} from '@react-three/fiber';
import {ContactShadows, Float, Environment} from '@react-three/drei';
import {Suspense, useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import { metalness, roughness } from 'three/examples/jsm/nodes/Nodes.js';

export default function Shapes(){
    return(
        <div className='row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0'>
            <Canvas className='z-0' shadows gl={{antialias:false}} dpr={[1,1.5]} camera={{position:[0,0,25], fov:30, near:1, far:40 }}>
                <Suspense fallback={null}>
                    <Geometries/>
                    <ContactShadows
                        position={[0,-3.5,0]}
                        opacity={0.65}
                        scale={40}
                        blur={1}
                        far={9}
                    />
                    <Environment preset='studio'/>

                </Suspense>

            </Canvas>

        </div>
    )
}

function Geometries(){
    const geometries =[
        {
            position:[0,0,0],
            r:0.3,
            geometry: new THREE.IcosahedronGeometry(3)
        },
{
            position:[.8,-.75,4],
            r:0.7,
            geometry: new THREE.CapsuleGeometry(0.5,1,3,6)
        },
        {
            position:[-1.9,2,-4],
            r:0.6,
            geometry: new THREE.DodecahedronGeometry(1.5)
        },
        {
            position:[-0.5,-.75,5],
            r:0.5,
            geometry: new THREE.TorusGeometry(.6, .25,5,10)
        },
        {
            position:[1.6,2,-4],
            r:0.7,
            geometry: new THREE.OctahedronGeometry(1.5) 
        },
        {
            position:[0,2.3,-2],
            r:0.7,
            geometry: new THREE.SphereGeometry(1,10,10) 
        },
        {
            
            position:[-2.5,0,-2],
            r:0.7,
            geometry: new THREE.TorusKnotGeometry(1,.3,20,10,5,3) 
        },
    ];
    const materials =
    [
        new THREE.MeshNormalMaterial(),
        new THREE.MeshStandardMaterial({color:0xc44569, roughness:.5}),
        new THREE.MeshStandardMaterial({color:0x574b90, roughness:.5}),
        new THREE.MeshStandardMaterial({color:0xe15f41, roughness:.5}),
        new THREE.MeshStandardMaterial({color:0x3dc1d3, roughness:.5}),
        new THREE.MeshStandardMaterial({color:0xf78fb3, roughness:.5}),
        new THREE.MeshStandardMaterial({
            color:0xe66767,
            roughness:.5,
            metalness:0.5
        }),
        new THREE.MeshStandardMaterial({
            color:0x786fa6,
            roughness:.5,
            metalness:0.5
        }),
        new THREE.MeshStandardMaterial({
            color:0x00b894,
            roughness:0,
            metalness:0.5
        }),
        new THREE.MeshStandardMaterial({
            color:0xfdcb6e,
            roughness:0,
        }),
    ]
    return geometries.map(({position, r, geometry})=>(
        <Geometry
            key={JSON.stringify(position)}
            position={position.map((p)=>p*2)}
            geometry={geometry}
            materials={materials}
            r={r}
        />
    ));
}

function Geometry({r, position, geometry, materials}){
    const meshRef = useRef();
    const [visible, setVisible] = useState(false);

     const startingMaterial = getRandomMaterial();

    function getRandomMaterial() {
        return gsap.utils.random(materials);
    }


    function handleClick(e) {
        const mesh = e.object;

        

        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0, 2)}`,
            y: `+=${gsap.utils.random(0, 2)}`,
            z: `+=${gsap.utils.random(0, 2)}`,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            yoyo: true,
        });

        mesh.material = getRandomMaterial();
  }

        const handlePointerOver =()=>{
            document.body.style.cursor = 'pointer'
        }
        const handlePointerOut =()=>{
            document.body.style.cursor = 'default'
        }


        useEffect(()=>{
            let ctx = gsap.context(()=>{
                setVisible(true)
                gsap.from(meshRef.current.scale,{
                    x:0,
                    y:0,
                    z:0,
                    duration:4,
                    ease:"elastic.out(1,.3)",
                    delay:0.3,
                })
            });
            return ()=>ctx.revert()   //cleanup
        },[])

        return (
            <group position={position} ref={meshRef}>
                <Float speed={5*r} rotationIntensity={6*r} floatIntensity={5*r}>
                     <mesh
                        geometry={geometry}
                        onClick={handleClick}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                        visible={visible}
                        material={startingMaterial}
                    ></mesh>

                </Float>
            </group>
        )
}
