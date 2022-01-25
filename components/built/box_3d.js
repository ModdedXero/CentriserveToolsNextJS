import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

export function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  const rotateSpeed = getRandomNum(-0.01, 0.01);
  useFrame((state, delta) => {
    ref.current.rotation.x += rotateSpeed;
    ref.current.rotation.y += rotateSpeed;
    ref.current.rotation.z += rotateSpeed;
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshStandardMaterial color={hovered ? 'blue' : 'green'} />
    </mesh>
  )
}

export function MxCanvas({ children }) {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {children}
        </Canvas>
    )
}

export function RenderBox(props) {
    return (
        <Box {...props} />
    )
}

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}