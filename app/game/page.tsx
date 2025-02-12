'use client';
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sky, OrbitControls, Environment, useTexture } from '@react-three/drei';
import { usePlane } from '@react-three/cannon';

// Компонент здания с текстурами
const Building = ({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) => {
  const texture = useTexture({
    map: '/building_texture.jpg', // Замените на реальный путь к текстуре
  });

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture.map} roughness={0.7} metalness={0.3} />
    </mesh>
  );
};

// Компонент земли с текстурой
// Компонент земли
const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh
      ref={ref as any}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
    >
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color='#3a7e3d' />
    </mesh>
  );
};

// Компонент дрона
const Drone = () => {
  const droneRef = useRef<THREE.Group>(null);
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const speed = 0.5;
  const [position, setPosition] = useState<[number, number, number]>([0, 5, 0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setMovement((prev) => ({ ...prev, up: true }));
          break;
        case 'ShiftLeft':
          setMovement((prev) => ({ ...prev, down: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setMovement((prev) => ({ ...prev, up: false }));
          break;
        case 'ShiftLeft':
          setMovement((prev) => ({ ...prev, down: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    if (!droneRef.current) return;

    const moveDirection = new THREE.Vector3();
    const camera = state.camera;

    // Получаем направление движения на основе поворота камеры
    if (movement.forward) moveDirection.z -= 1;
    if (movement.backward) moveDirection.z += 1;
    if (movement.left) moveDirection.x -= 1;
    if (movement.right) moveDirection.x += 1;
    if (movement.up) moveDirection.y += 1;
    if (movement.down) moveDirection.y -= 1;

    moveDirection.normalize();
    moveDirection.applyEuler(new THREE.Euler(0, camera.rotation.y, 0));
    moveDirection.multiplyScalar(speed);

    // Обновляем позицию
    setPosition((prev) => [
      prev[0] + moveDirection.x,
      prev[1] + moveDirection.y,
      prev[2] + moveDirection.z,
    ]);

    // Обновляем позицию камеры
    camera.position.set(position[0], position[1], position[2]);
  });

  return (
    <group ref={droneRef} position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color='red' metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Компонент города
const City = () => {
  const buildingData = [
    { pos: [-20, 15, -20], size: [10, 30, 10] },
    { pos: [20, 20, -20], size: [10, 40, 10] },
    { pos: [-20, 25, 20], size: [10, 50, 10] },
    { pos: [20, 15, 20], size: [10, 30, 10] },
    { pos: [0, 20, -30], size: [15, 40, 15] },
    { pos: [-30, 18, 0], size: [12, 36, 12] },
    { pos: [30, 22, 0], size: [14, 44, 14] },
    { pos: [0, 25, 30], size: [16, 50, 16] },
  ];

  return (
    <>
      {buildingData.map((building, index) => (
        <Building
          key={index}
          position={building.pos as [number, number, number]}
          size={building.size as [number, number, number]}
        />
      ))}
    </>
  );
};

// Основной компонент приложения
const DroneSimulator = () => {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    // Запрашиваем полноэкранный режим для Telegram Web App
    // if (window.Telegram?.WebApp) {
    //   window.Telegram.WebApp.requestFullScreen();
    // }
  };

  if (!started) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <button
          onClick={handleStart}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Начать полёт
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset='city' />
        <Drone />
        <City />
        <Ground />
        <OrbitControls makeDefault />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'Arial',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>Управление:</h3>
        <p style={{ margin: '5px 0' }}>WASD - движение</p>
        <p style={{ margin: '5px 0' }}>Мышь - поворот камеры</p>
        <p style={{ margin: '5px 0' }}>Пробел - подъём</p>
        <p style={{ margin: '5px 0' }}>Shift - снижение</p>
      </div>
    </div>
  );
};

export default DroneSimulator;
