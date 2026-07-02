import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, Html, Bounds } from '@react-three/drei';
import Loader from '../ui/Loader';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <div className="model-viewer-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <Suspense fallback={<Html center><div className="canvas-loader"><Loader /></div></Html>}>
          <Bounds fit clip observe margin={1.15}>
            <Model url={modelUrl} />
          </Bounds>
        </Suspense>
        
        <OrbitControls 
          makeDefault
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
