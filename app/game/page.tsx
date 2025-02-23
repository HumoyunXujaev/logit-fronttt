// // app/page.tsx
// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import * as CANNON from 'cannon-es';
// import Stats from 'stats.js';
// import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

// // Types
// interface ChassisModel extends THREE.Group {
//   helpChassisGeo?: THREE.BoxGeometry;
//   helpChassisMat?: THREE.MeshBasicMaterial;
//   helpChassis?: THREE.Mesh;
// }

// interface WheelModel extends THREE.Group {
//   wheelBody?: CANNON.Body;
//   helpWheelsGeo?: THREE.CylinderGeometry;
//   helpWheelsMat?: THREE.MeshBasicMaterial;
//   helpWheels?: THREE.Mesh;
// }

// interface ControlOptions {
//   maxSteerVal: number;
//   maxForce: number;
//   brakeForce: number;
//   slowDownCar: number;
//   primaryKeys: {
//     forward: string;
//     backward: string;
//     left: string;
//     right: string;
//     reset: string;
//     brake: string;
//   };
//   secondaryKeys: {
//     forward: string;
//     backward: string;
//     left: string;
//     right: string;
//     reset: string;
//     brake: string;
//   };
// }

// interface VehicleOptions {
//   suspensionStiffness: number;
//   suspensionRestLength: number;
//   frictionSlip: number;
//   dampingRelaxation: number;
//   dampingCompression: number;
//   maxSuspensionForce: number;
//   maxSuspensionTravel: number;
//   rollInfluence: number;
// }

// class Car {
//   scene: THREE.Scene;
//   world: CANNON.World;
//   car!: CANNON.RaycastVehicle;
//   chassis!: ChassisModel;
//   wheels: WheelModel[];
//   chassisModel: any;
//   wheelModel: any;
//   chassisDimension: { x: number; y: number; z: number };
//   chassisModelPos: { x: number; y: number; z: number };
//   wheelScale: { frontWheel: number; hindWheel: number };
//   controlOptions: ControlOptions;
//   onLoaded: () => void;

//   constructor(scene: THREE.Scene, world: CANNON.World, onLoaded: () => void) {
//     this.scene = scene;
//     this.world = world;
//     this.onLoaded = onLoaded;

//     this.wheels = [];
//     this.chassisDimension = { x: 1.96, y: 1, z: 4.47 };
//     this.chassisModelPos = { x: 0, y: -0.59, z: 0 };
//     this.wheelScale = { frontWheel: 0.67, hindWheel: 0.67 };
//     this.controlOptions = {
//       maxSteerVal: 0.5,
//       maxForce: 750,
//       brakeForce: 36,
//       slowDownCar: 19.6,
//       primaryKeys: {
//         forward: 'w',
//         backward: 's',
//         left: 'a',
//         right: 'd',
//         reset: 'r',
//         brake: ' ',
//       },
//       secondaryKeys: {
//         forward: 'arrowup',
//         backward: 'arrowdown',
//         left: 'arrowleft',
//         right: 'arrowright',
//         reset: 'r',
//         brake: ' ',
//       },
//     };

//     this.loadModels();
//   }

//   async loadModels() {
//     const gltfLoader = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath('/draco/');
//     dracoLoader.setDecoderConfig({ type: 'js' }); // Принудительно использовать JS декодер
//     dracoLoader.preload(); // Предзагрузка декодера
//     gltfLoader.setDRACOLoader(dracoLoader);

//     const demo_car = 'mclaren';
//     let loadedCount = 0;
//     const totalToLoad = 5; // 1 chassis + 4 wheels

//     const checkAllLoaded = () => {
//       loadedCount++;
//       if (loadedCount === totalToLoad) {
//         this.init();
//         this.onLoaded(); // Вызываем callback когда все загружено
//       }
//     };

//     // Load chassis
//     try {
//       const gltf = await gltfLoader.loadAsync(
//         `/models/${demo_car}/draco/chassis.gltf`
//       );
//       this.chassisModel = gltf;
//       this.chassis = gltf.scene;
//       this.chassis.helpChassisGeo = new THREE.BoxGeometry(1, 1, 1);
//       this.chassis.helpChassisMat = new THREE.MeshBasicMaterial({
//         color: 0xff0000,
//         wireframe: true,
//       });
//       this.chassis.helpChassis = new THREE.Mesh(
//         this.chassis.helpChassisGeo,
//         this.chassis.helpChassisMat
//       );
//       this.scene.add(this.chassis, this.chassis.helpChassis);
//       checkAllLoaded();
//     } catch (error) {
//       console.error('Error loading chassis:', error);
//       checkAllLoaded(); // Продолжаем даже при ошибке
//     }

//     // Load wheels
//     for (let i = 0; i < 4; i++) {
//       try {
//         const gltf = await gltfLoader.loadAsync(
//           `/models/${demo_car}/draco/wheel.gltf`
//         );
//         this.wheelModel = gltf;
//         const model = gltf.scene as WheelModel;
//         this.wheels[i] = model;

//         if (i === 1 || i === 3) {
//           this.wheels[i].scale.set(
//             -1 * this.wheelScale.frontWheel,
//             1 * this.wheelScale.frontWheel,
//             -1 * this.wheelScale.frontWheel
//           );
//         } else {
//           this.wheels[i].scale.set(
//             1 * this.wheelScale.frontWheel,
//             1 * this.wheelScale.frontWheel,
//             1 * this.wheelScale.frontWheel
//           );
//         }

//         this.scene.add(this.wheels[i]);
//         checkAllLoaded();
//       } catch (error) {
//         console.error('Error loading wheel:', error);
//         checkAllLoaded(); // Продолжаем даже при ошибке
//       }
//     }
//   }

//   //   this.init();
//   // }

//   init() {
//     this.setChassis();
//     this.setWheels();
//     this.controls();
//     this.update();
//   }

//   setChassis() {
//     const chassisShape = new CANNON.Box(
//       new CANNON.Vec3(
//         this.chassisDimension.x * 0.5,
//         this.chassisDimension.y * 0.5,
//         this.chassisDimension.z * 0.5
//       )
//     );

//     const chassisBody = new CANNON.Body({
//       mass: 250,
//       material: new CANNON.Material({ friction: 0 }),
//     });

//     chassisBody.addShape(chassisShape);
//     if (this.chassis && this.chassis?.helpChassis) {
//       this.chassis.helpChassis.visible = false;
//       this.chassis.helpChassis.scale.set(
//         this.chassisDimension.x,
//         this.chassisDimension.y,
//         this.chassisDimension.z
//       );
//     }

//     this.car = new CANNON.RaycastVehicle({
//       chassisBody,
//       indexRightAxis: 0,
//       indexUpAxis: 1,
//       indexForwardAxis: 2,
//     });

//     this.car.addToWorld(this.world);
//   }

//   setWheels() {
//     const options = {
//       radius: 0.34,
//       directionLocal: new CANNON.Vec3(0, -1, 0),
//       suspensionStiffness: 55,
//       suspensionRestLength: 0.5,
//       frictionSlip: 30,
//       dampingRelaxation: 2.3,
//       dampingCompression: 4.3,
//       maxSuspensionForce: 10000,
//       rollInfluence: 0.01,
//       axleLocal: new CANNON.Vec3(-1, 0, 0),
//       chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
//       maxSuspensionTravel: 1,
//       customSlidingRotationalSpeed: 30,
//     };

//     // Add wheels
//     this.car.addWheel(options);
//     this.car.addWheel(options);
//     this.car.addWheel(options);
//     this.car.addWheel(options);

//     // Set wheel positions
//     this.car.wheelInfos[0].chassisConnectionPointLocal.set(0.75, 0.1, -1.32);
//     this.car.wheelInfos[1].chassisConnectionPointLocal.set(-0.78, 0.1, -1.32);
//     this.car.wheelInfos[2].chassisConnectionPointLocal.set(0.75, 0.1, 1.25);
//     this.car.wheelInfos[3].chassisConnectionPointLocal.set(-0.78, 0.1, 1.25);

//     // Create wheel bodies
//     this.car.wheelInfos.forEach((wheel, index) => {
//       const cylinderShape = new CANNON.Cylinder(
//         wheel.radius,
//         wheel.radius,
//         wheel.radius / 2,
//         20
//       );
//       const wheelBody = new CANNON.Body({
//         mass: 1,
//         material: new CANNON.Material({ friction: 0 }),
//       });

//       const quaternion = new CANNON.Quaternion().setFromEuler(
//         -Math.PI / 2,
//         0,
//         0
//       );
//       wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
//       if (this.wheels[index]) {
//         this.wheels[index].wheelBody = wheelBody;

//         // Create wheel helpers
//         this.wheels[index].helpWheelsGeo = new THREE.CylinderGeometry(
//           wheel.radius,
//           wheel.radius,
//           wheel.radius / 2,
//           20
//         );
//         this.wheels[index].helpWheelsGeo.rotateZ(Math.PI / 2);
//         this.wheels[index].helpWheelsMat = new THREE.MeshBasicMaterial({
//           color: 0x00ffff,
//           wireframe: true,
//         });
//         this.wheels[index].helpWheels = new THREE.Mesh(
//           this.wheels[index].helpWheelsGeo,
//           this.wheels[index].helpWheelsMat
//         );
//         this.wheels[index].helpWheels.visible = false;
//         this.scene.add(this.wheels[index].helpWheels);
//       }
//     });
//   }

//   controls() {
//     const keysPressed: string[] = [];

//     window.addEventListener('keydown', (e) => {
//       if (!keysPressed.includes(e.key.toLowerCase())) {
//         keysPressed.push(e.key.toLowerCase());
//       }
//       this.handleMovement(keysPressed);
//     });

//     window.addEventListener('keyup', (e) => {
//       const index = keysPressed.indexOf(e.key.toLowerCase());
//       if (index > -1) {
//         keysPressed.splice(index, 1);
//       }
//       this.handleMovement(keysPressed);
//     });
//   }

//   handleMovement(keysPressed: string[]) {
//     const { primaryKeys, secondaryKeys } = this.controlOptions;

//     if (
//       keysPressed.includes(primaryKeys.reset) ||
//       keysPressed.includes(secondaryKeys.reset)
//     ) {
//       this.resetCar();
//     }

//     if (
//       !keysPressed.includes(primaryKeys.brake) &&
//       !keysPressed.includes(secondaryKeys.brake)
//     ) {
//       this.car.setBrake(0, 0);
//       this.car.setBrake(0, 1);
//       this.car.setBrake(0, 2);
//       this.car.setBrake(0, 3);

//       if (
//         keysPressed.includes(primaryKeys.left) ||
//         keysPressed.includes(secondaryKeys.left)
//       ) {
//         this.car.setSteeringValue(this.controlOptions.maxSteerVal * 1, 2);
//         this.car.setSteeringValue(this.controlOptions.maxSteerVal * 1, 3);
//       } else if (
//         keysPressed.includes(primaryKeys.right) ||
//         keysPressed.includes(secondaryKeys.right)
//       ) {
//         this.car.setSteeringValue(this.controlOptions.maxSteerVal * -1, 2);
//         this.car.setSteeringValue(this.controlOptions.maxSteerVal * -1, 3);
//       } else {
//         this.stopSteer();
//       }

//       if (
//         keysPressed.includes(primaryKeys.forward) ||
//         keysPressed.includes(secondaryKeys.forward)
//       ) {
//         const force = this.controlOptions.maxForce * -1;
//         for (let i = 0; i < 4; i++) {
//           this.car.applyEngineForce(force, i);
//         }
//       } else if (
//         keysPressed.includes(primaryKeys.backward) ||
//         keysPressed.includes(secondaryKeys.backward)
//       ) {
//         const force = this.controlOptions.maxForce * 1;
//         for (let i = 0; i < 4; i++) {
//           this.car.applyEngineForce(force, i);
//         }
//       } else {
//         this.stopCar();
//       }
//     } else {
//       this.brake();
//     }
//   }

//   resetCar() {
//     this.car.chassisBody.position.set(0, 4, 0);
//     this.car.chassisBody.quaternion.set(0, 0, 0, 1);
//     this.car.chassisBody.angularVelocity.set(0, 0, 0);
//     this.car.chassisBody.velocity.set(0, 0, 0);
//   }

//   brake() {
//     for (let i = 0; i < 4; i++) {
//       this.car.setBrake(this.controlOptions.brakeForce, i);
//     }
//   }

//   stopCar() {
//     for (let i = 0; i < 4; i++) {
//       this.car.setBrake(this.controlOptions.slowDownCar, i);
//     }
//   }

//   stopSteer() {
//     this.car.setSteeringValue(0, 2);
//     this.car.setSteeringValue(0, 3);
//   }

//   update() {
//     const updateWorld = () => {
//       if (this.car && this.chassis && this.wheels[0]) {
//         // Update chassis
//         this.chassis.position.set(
//           this.car.chassisBody.position.x + this.chassisModelPos.x,
//           this.car.chassisBody.position.y + this.chassisModelPos.y,
//           this.car.chassisBody.position.z + this.chassisModelPos.z
//         );
//         this.chassis.quaternion.copy(this.car.chassisBody.quaternion);
//         this.chassis?.helpChassis?.position.copy(this.car.chassisBody.position);
//         this.chassis?.helpChassis?.quaternion.copy(
//           this.car.chassisBody.quaternion
//         );

//         // Update wheels
//         for (let i = 0; i < 4; i++) {
//           if (this.wheels[i].helpWheels && this.car.wheelInfos[i]) {
//             this.car.updateWheelTransform(i);
//             this.wheels[i].position.copy(
//               this.car.wheelInfos[i].worldTransform.position
//             );
//             this.wheels[i].quaternion.copy(
//               this.car.wheelInfos[i].worldTransform.quaternion
//             );
//             this?.wheels[i]?.helpWheels?.position.copy(
//               this.car.wheelInfos[i].worldTransform.position
//             );
//             this?.wheels[i]?.helpWheels?.quaternion.copy(
//               this.car.wheelInfos[i].worldTransform.quaternion
//             );
//           }
//         }
//       }
//     };

//     this.world.addEventListener('postStep', updateWorld);
//   }
// }

// // Main component
// export default function CarPhysics() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingProgress, setLoadingProgress] = useState(0);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Stats
//     const stats = new Stats();
//     stats.showPanel(0);
//     document.body.appendChild(stats.dom);

//     // Scene
//     const scene = new THREE.Scene();

//     // Cannon World
//     const world = new CANNON.World({
//       gravity: new CANNON.Vec3(0, -9.82, 0),
//     });
//     world.broadphase = new CANNON.SAPBroadphase(world);

//     // Materials
//     const bodyMaterial = new CANNON.Material();
//     const groundMaterial = new CANNON.Material();
//     const bodyGroundContactMaterial = new CANNON.ContactMaterial(
//       bodyMaterial,
//       groundMaterial,
//       {
//         friction: 0.1,
//         restitution: 0.3,
//       }
//     );
//     world.addContactMaterial(bodyGroundContactMaterial);

//     // Lights
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//     scene.add(ambientLight);

//     const createSpotlight = (color: number, position: THREE.Vector3) => {
//       const spotlight = new THREE.SpotLight(color, 2, 0, 0.9, 1, 0);
//       spotlight.position.copy(position);
//       return spotlight;
//     };

//     const spotLight1 = createSpotlight(
//       0x29dfff,
//       new THREE.Vector3(7, 1.291, -6)
//     );
//     const spotLight2 = createSpotlight(
//       0x943dff,
//       new THREE.Vector3(-7, 1.291, -6)
//     );
//     const spotLight3 = createSpotlight(
//       0xd5f8ff,
//       new THREE.Vector3(0, 1.291, 7)
//     );
//     scene.add(spotLight1, spotLight2, spotLight3);

//     // Environment Map
//     const textureLoader = new THREE.CubeTextureLoader();
//     textureLoader.setPath('/textures/environmentMaps/2/');

//     let loadedTextures = 0;
//     const totalTextures = 6;

//     const updateProgress = () => {
//       loadedTextures++;
//       const progress = (loadedTextures / totalTextures) * 100;
//       setLoadingProgress(progress);
//     };

//     const environmentMapTexture = textureLoader.load(
//       ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
//       undefined, // onLoad
//       updateProgress, // onProgress
//       (error) => console.error('Error loading texture:', error) // onError
//     );

//     scene.environment = environmentMapTexture;

//     // Floor
//     const floorGeometry = new THREE.PlaneGeometry(100, 100);
//     const floorMirror = new Reflector(floorGeometry, {
//       clipBias: 0.003,
//       textureWidth: window.innerWidth * window.devicePixelRatio,
//       textureHeight: window.innerHeight * window.devicePixelRatio,
//       color: 0xffffff,
//     });

//     const floorMesh = new THREE.Mesh(
//       floorGeometry,
//       new THREE.MeshStandardMaterial({
//         color: 0xffffff,
//         roughness: 0.5,
//         metalness: 0,
//         emissive: 0xffffff,
//         emissiveIntensity: -0.36,
//         transparent: true,
//         opacity: 0.7,
//       })
//     );

//     floorMirror.rotation.x = -Math.PI * 0.5;
//     floorMesh.rotation.x = -Math.PI * 0.5;
//     floorMesh.position.y = 0.001;
//     scene.add(floorMirror, floorMesh);

//     // Floor Physics
//     const floorShape = new CANNON.Plane();
//     const floorBody = new CANNON.Body();
//     floorBody.mass = 0;
//     floorBody.addShape(floorShape);
//     floorBody.quaternion.setFromAxisAngle(
//       new CANNON.Vec3(-1, 0, 0),
//       Math.PI * 0.5
//     );
//     world.addBody(floorBody);

//     // Camera
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       10000
//     );
//     camera.position.set(0, 4, 6);

//     // Controls
//     const controls = new OrbitControls(camera, canvasRef.current);
//     controls.enableDamping = true;

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       antialias: true,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     // Car
//     // const car = new Car(scene, world);
//     const car = new Car(scene, world, () => {
//       setLoading(false);
//     });
//     // Animation
//     const timeStep = 1 / 60;
//     let lastCallTime: number | null = null;

//     const animate = () => {
//       stats.begin();

//       controls.update();

//       const time = performance.now() / 1000;
//       if (!lastCallTime) {
//         world.step(timeStep);
//       } else {
//         const dt = time - lastCallTime;
//         world.step(timeStep, dt);
//       }
//       lastCallTime = time;

//       renderer.render(scene, camera);

//       stats.end();
//       requestAnimationFrame(animate);
//     };

//     // Handle resize
//     const handleResize = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;

//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();

//       renderer.setSize(width, height);
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     };

//     window.addEventListener('resize', handleResize);
//     animate();

//     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
//       const webApp = window.Telegram.WebApp;

//       webApp.requestFullscreen();
//     }
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       document.body.removeChild(stats.dom);
//       scene.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//           child.geometry.dispose();
//           if (child.material instanceof THREE.Material) {
//             child.material.dispose();
//           }
//         }
//       });
//       renderer.dispose();
//     };
//   }, []);
//   return (
//     <div className='container'>
//       <canvas ref={canvasRef} className='webgl' />
//       <div className={`loader ${!loading ? 'opacity-0' : ''}`}>
//         {Math.round(loadingProgress)}% Loading...
//       </div>
//       <style jsx>{`
//         .container {
//           position: relative;
//           width: 100vw;
//           height: 100vh;
//           overflow: hidden;
//         }
//         .webgl {
//           position: fixed;
//           top: 0;
//           left: 0;
//           outline: none;
//         }
//         .loader {
//           position: absolute;
//           left: 50%;
//           top: 50%;
//           transform: translate(-50%, -50%);
//           padding: 24px;
//           font-family: 'Abel', sans-serif;
//           font-size: 48px;
//           color: #fff;
//           background: #ffffff42;
//           border-radius: 24px;
//           backdrop-filter: blur(12px);
//           pointer-events: none;
//           transition: 0.3s ease-in-out;
//           z-index: 1000;
//         }
//         .opacity-0 {
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }

// app/vehicle-physics/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as CANNON from 'cannon-es';
import Stats from 'stats.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { useControls, folder, button } from 'leva';

// Types
interface ChassisModel extends THREE.Group {
  helpChassisGeo?: THREE.BoxGeometry;
  helpChassisMat?: THREE.MeshBasicMaterial;
  helpChassis?: THREE.Mesh;
}

interface WheelModel extends THREE.Group {
  wheelBody?: CANNON.Body;
  helpWheelsGeo?: THREE.CylinderGeometry;
  helpWheelsMat?: THREE.MeshBasicMaterial;
  helpWheels?: THREE.Mesh;
}

interface ControlOptions {
  maxSteerVal: number;
  maxForce: number;
  brakeForce: number;
  slowDownCar: number;
  primaryKeys: {
    forward: string;
    backward: string;
    left: string;
    right: string;
    reset: string;
    brake: string;
  };
  secondaryKeys: {
    forward: string;
    backward: string;
    left: string;
    right: string;
    reset: string;
    brake: string;
  };
}

interface VehicleOptions {
  suspensionStiffness: number;
  suspensionRestLength: number;
  frictionSlip: number;
  dampingRelaxation: number;
  dampingCompression: number;
  maxSuspensionForce: number;
  maxSuspensionTravel: number;
  rollInfluence: number;
}

interface CameraMode {
  type: 'follow' | 'first-person' | 'third-person' | 'orbit' | 'hood';
  offset?: THREE.Vector3;
}

class AdvancedCamera {
  camera: THREE.PerspectiveCamera;
  currentMode: CameraMode;
  target: THREE.Object3D;
  offset: THREE.Vector3;
  lerpFactor: number;
  orbitControls: OrbitControls | null;
  private targetPosition: THREE.Vector3;
  private currentRotation: THREE.Quaternion;
  private dampingFactor: number;

  constructor(
    camera: THREE.PerspectiveCamera,
    target: THREE.Object3D,
    canvas: HTMLCanvasElement
  ) {
    this.camera = camera;
    this.target = target;
    this.offset = new THREE.Vector3(0, 4, 6);
    this.currentMode = { type: 'third-person' };
    this.lerpFactor = 0.1;
    this.dampingFactor = 0.05;
    this.targetPosition = new THREE.Vector3();
    this.currentRotation = new THREE.Quaternion();

    // Initialize orbit controls
    this.orbitControls = new OrbitControls(camera, canvas);
    this.orbitControls.enabled = false;
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
  }

  setMode(mode: CameraMode) {
    this.currentMode = mode;
    if (this.orbitControls) {
      this.orbitControls.enabled = mode.type === 'orbit';
    }

    // Reset camera parameters for the new mode
    switch (mode.type) {
      case 'first-person':
        this.offset.set(0, 1.2, 0.2);
        this.lerpFactor = 1;
        this.dampingFactor = 1;
        break;
      case 'third-person':
        this.offset.set(0, 3, -8);
        this.lerpFactor = 0.1;
        this.dampingFactor = 0.05;
        break;
      case 'follow':
        this.offset.set(0, 5, -15);
        this.lerpFactor = 0.05;
        this.dampingFactor = 0.03;
        break;
      case 'hood':
        this.offset.set(0, 1.8, 0.5);
        this.lerpFactor = 0.15;
        this.dampingFactor = 0.1;
        break;
    }
  }

  update() {
    if (this.currentMode.type === 'orbit') {
      this.orbitControls?.update();
      return;
    }

    const targetPosition = this.target.position.clone();
    const targetRotation = this.target.quaternion.clone();

    // Calculate ideal camera position
    const rotatedOffset = this.offset.clone().applyQuaternion(targetRotation);
    const idealPosition = targetPosition.clone().add(rotatedOffset);

    // Smooth camera movement
    this.camera.position.lerp(idealPosition, this.lerpFactor);

    if (
      this.currentMode.type === 'first-person' ||
      this.currentMode.type === 'hood'
    ) {
      // For first-person and hood views, match car rotation
      const idealRotation = targetRotation.clone();
      this.currentRotation.slerp(idealRotation, this.dampingFactor);
      this.camera.quaternion.copy(this.currentRotation);
    } else {
      // For third-person and follow views, look at target
      this.targetPosition.copy(targetPosition);
      if (this.currentMode.type === 'follow') {
        this.targetPosition.y += 2; // Look slightly above the car
      }
      this.camera.lookAt(this.targetPosition);
    }
  }

  dispose() {
    this.orbitControls?.dispose();
  }
}

class City {
  scene: THREE.Scene;
  world: CANNON.World;
  buildings: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.generateCity();
  }

  generateCity() {
    // Создаем базовую сетку города
    const citySize = 100;
    const blockSize = 20;

    for (let x = -citySize / 2; x < citySize / 2; x += blockSize) {
      for (let z = -citySize / 2; z < citySize / 2; z += blockSize) {
        if (Math.random() > 0.7) continue; // Пропускаем некоторые блоки для разнообразия

        // Случайная высота здания
        const height = 10 + Math.random() * 30;
        const width = 5 + Math.random() * 10;
        const depth = 5 + Math.random() * 10;

        // Создаем меш здания
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
          metalness: 0.8,
          roughness: 0.2,
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, height / 2, z);
        this.scene.add(building);

        // Создаем физическое тело здания
        const shape = new CANNON.Box(
          new CANNON.Vec3(width / 2, height / 2, depth / 2)
        );
        const body = new CANNON.Body({
          mass: 0, // Статичное тело
          position: new CANNON.Vec3(x, height / 2, z),
          shape: shape,
        });
        this.world.addBody(body);

        this.buildings.push({ mesh: building, body: body });
      }
    }

    // Добавляем дороги
    this.addRoads();
  }

  addRoads() {
    const roadGeometry = new THREE.PlaneGeometry(200, 200);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01; // Чуть выше пола для избежания z-fighting
    this.scene.add(road);
  }
}

class Car {
  scene: THREE.Scene;
  world: CANNON.World;
  car!: CANNON.RaycastVehicle;
  chassis!: ChassisModel;
  wheels: WheelModel[];
  chassisModel: any;
  wheelModel: any;
  chassisDimension: { x: number; y: number; z: number };
  chassisModelPos: { x: number; y: number; z: number };
  wheelScale: { frontWheel: number; hindWheel: number };
  controlOptions: ControlOptions;
  vehicleOptions: VehicleOptions;
  onLoaded: () => void;

  constructor(scene: THREE.Scene, world: CANNON.World, onLoaded: () => void) {
    this.scene = scene;
    this.world = world;
    this.onLoaded = onLoaded;

    this.wheels = [];
    this.chassisDimension = { x: 1.96, y: 1, z: 4.47 };
    this.chassisModelPos = { x: 0, y: -0.59, z: 0 };
    this.wheelScale = { frontWheel: 0.67, hindWheel: 0.67 };

    this.vehicleOptions = {
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      maxSuspensionForce: 10000,
      maxSuspensionTravel: 1,
      rollInfluence: 0.01,
    };

    this.controlOptions = {
      maxSteerVal: 0.5,
      maxForce: 750,
      brakeForce: 36,
      slowDownCar: 19.6,
      primaryKeys: {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
        reset: 'r',
        brake: ' ',
      },
      secondaryKeys: {
        forward: 'arrowup',
        backward: 'arrowdown',
        left: 'arrowleft',
        right: 'arrowright',
        reset: 'r',
        brake: ' ',
      },
    };

    this.loadModels();
  }

  async loadModels() {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    const demo_car = 'mclaren';
    let loadedCount = 0;
    const totalToLoad = 5;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        this.init();
        this.onLoaded();
      }
    };

    try {
      const gltf = await gltfLoader.loadAsync(
        `/models/${demo_car}/draco/chassis.gltf`
      );
      this.chassisModel = gltf;
      this.chassis = gltf.scene;
      this.chassis.helpChassisGeo = new THREE.BoxGeometry(1, 1, 1);
      this.chassis.helpChassisMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      this.chassis.helpChassis = new THREE.Mesh(
        this.chassis.helpChassisGeo,
        this.chassis.helpChassisMat
      );
      this.scene.add(this.chassis, this.chassis.helpChassis);
      checkAllLoaded();
    } catch (error) {
      console.error('Error loading chassis:', error);
      checkAllLoaded();
    }

    for (let i = 0; i < 4; i++) {
      try {
        const gltf = await gltfLoader.loadAsync(
          `/models/${demo_car}/draco/wheel.gltf`
        );
        this.wheelModel = gltf;
        const model = gltf.scene as WheelModel;
        this.wheels[i] = model;

        if (i === 1 || i === 3) {
          this.wheels[i].scale.set(
            -1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel,
            -1 * this.wheelScale.frontWheel
          );
        } else {
          this.wheels[i].scale.set(
            1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel
          );
        }

        this.scene.add(this.wheels[i]);
        checkAllLoaded();
      } catch (error) {
        console.error('Error loading wheel:', error);
        checkAllLoaded();
      }
    }
  }

  init() {
    this.setChassis();
    this.setWheels();
    this.controls();
    this.update();
  }

  setChassis() {
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        this.chassisDimension.x * 0.5,
        this.chassisDimension.y * 0.5,
        this.chassisDimension.z * 0.5
      )
    );

    const chassisBody = new CANNON.Body({
      mass: 250,
      material: new CANNON.Material({ friction: 0 }),
    });

    chassisBody.addShape(chassisShape);

    if (this.chassis && this.chassis.helpChassis) {
      this.chassis.helpChassis.visible = false;
      this.chassis.helpChassis.scale.set(
        this.chassisDimension.x,
        this.chassisDimension.y,
        this.chassisDimension.z
      );
    }

    this.car = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    this.car.addToWorld(this.world);
  }

  setWheels() {
    const options = {
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: this.vehicleOptions.suspensionStiffness,
      suspensionRestLength: this.vehicleOptions.suspensionRestLength,
      frictionSlip: this.vehicleOptions.frictionSlip,
      dampingRelaxation: this.vehicleOptions.dampingRelaxation,
      dampingCompression: this.vehicleOptions.dampingCompression,
      maxSuspensionForce: this.vehicleOptions.maxSuspensionForce,
      rollInfluence: this.vehicleOptions.rollInfluence,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
      maxSuspensionTravel: this.vehicleOptions.maxSuspensionTravel,
      customSlidingRotationalSpeed: 30,
    };

    // Add wheels
    this.car.addWheel(options);
    this.car.addWheel(options);
    this.car.addWheel(options);
    this.car.addWheel(options);

    // Set wheel positions
    this.car.wheelInfos[0].chassisConnectionPointLocal.set(0.75, 0.1, -1.32);
    this.car.wheelInfos[1].chassisConnectionPointLocal.set(-0.78, 0.1, -1.32);
    this.car.wheelInfos[2].chassisConnectionPointLocal.set(0.75, 0.1, 1.25);
    this.car.wheelInfos[3].chassisConnectionPointLocal.set(-0.78, 0.1, 1.25);

    // Create wheel bodies
    this.car.wheelInfos.forEach((wheel, index) => {
      const cylinderShape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      const wheelBody = new CANNON.Body({
        mass: 1,
        material: new CANNON.Material({ friction: 0 }),
      });

      const quaternion = new CANNON.Quaternion().setFromEuler(
        -Math.PI / 2,
        0,
        0
      );
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);

      if (this.wheels[index]) {
        this.wheels[index].wheelBody = wheelBody;

        // Create wheel helpers
        this.wheels[index].helpWheelsGeo = new THREE.CylinderGeometry(
          wheel.radius,
          wheel.radius,
          wheel.radius / 2,
          20
        );
        this.wheels[index].helpWheelsGeo.rotateZ(Math.PI / 2);
        this.wheels[index].helpWheelsMat = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          wireframe: true,
        });
        this.wheels[index].helpWheels = new THREE.Mesh(
          this.wheels[index].helpWheelsGeo,
          this.wheels[index].helpWheelsMat
        );
        this.wheels[index].helpWheels.visible = false;
        this.scene.add(this.wheels[index].helpWheels);
      }
    });
  }

  updateVehicleOptions(newOptions: Partial<VehicleOptions>) {
    this.vehicleOptions = { ...this.vehicleOptions, ...newOptions };
    // Update wheel options
    this?.car?.wheelInfos?.forEach((wheel) => {
      Object.assign(wheel, this.vehicleOptions);
    });
  }

  // controls() {
  //   const keysPressed: string[] = [];

  //   window.addEventListener('keydown', (e) => {
  //     if (!keysPressed.includes(e.key.toLowerCase())) {
  //       keysPressed.push(e.key.toLowerCase());
  //     }
  //     this.handleMovement(keysPressed);
  //   });

  //   window.addEventListener('keyup', (e) => {
  //     const index = keysPressed.indexOf(e.key.toLowerCase());
  //     if (index > -1) {
  //       keysPressed.splice(index, 1);
  //     }
  //     this.handleMovement(keysPressed);
  //   });
  // }

  controls() {
    const keysPressed = new Set<string>();

    const keyDownHandler = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());
      this.handleMovement(Array.from(keysPressed));
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
      this.handleMovement(Array.from(keysPressed));
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    // Добавляем очистку обработчиков
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }

  handleMovement(keysPressed: string[]) {
    const { primaryKeys, secondaryKeys } = this.controlOptions;

    const lateralVelocity = this.getLateralVelocity();
    const driftFactor = Math.min(lateralVelocity.length() / 3, 1);

    if (
      keysPressed.includes(primaryKeys.reset) ||
      keysPressed.includes(secondaryKeys.reset)
    ) {
      this.resetCar();
    }

    if (
      !keysPressed.includes(primaryKeys.brake) &&
      !keysPressed.includes(secondaryKeys.brake)
    ) {
      this.car.setBrake(0, 0);
      this.car.setBrake(0, 1);
      this.car.setBrake(0, 2);
      this.car.setBrake(0, 3);

      if (
        keysPressed.includes(primaryKeys.left) ||
        keysPressed.includes(secondaryKeys.left)
      ) {
        this.car.setSteeringValue(this.controlOptions.maxSteerVal * 1, 2);
        this.car.setSteeringValue(this.controlOptions.maxSteerVal * 1, 3);
      } else if (
        keysPressed.includes(primaryKeys.right) ||
        keysPressed.includes(secondaryKeys.right)
      ) {
        this.car.setSteeringValue(this.controlOptions.maxSteerVal * -1, 2);
        this.car.setSteeringValue(this.controlOptions.maxSteerVal * -1, 3);
      } else {
        this.stopSteer();
      }

      if (
        keysPressed.includes(primaryKeys.forward) ||
        keysPressed.includes(secondaryKeys.forward)
      ) {
        const force = this.controlOptions.maxForce * -1;
        for (let i = 0; i < 4; i++) {
          this.car.applyEngineForce(force, i);
        }
      } else if (
        keysPressed.includes(primaryKeys.backward) ||
        keysPressed.includes(secondaryKeys.backward)
      ) {
        const force = this.controlOptions.maxForce * 1;
        for (let i = 0; i < 4; i++) {
          this.car.applyEngineForce(force, i);
        }
      } else {
        this.stopCar();
      }
    } else {
      this.brake();
    }
  }

  getLateralVelocity() {
    const worldVelocity = this.car.chassisBody.velocity;
    const forward = new CANNON.Vec3(0, 0, 1);
    this.car.chassisBody.quaternion.vmult(forward, forward);
    forward.normalize();

    const right = new CANNON.Vec3(1, 0, 0);
    this.car.chassisBody.quaternion.vmult(right, right);
    right.normalize();

    const forwardVelocity = forward.scale(forward.dot(worldVelocity));
    const rightVelocity = right.scale(right.dot(worldVelocity));

    return rightVelocity;
  }

  resetCar() {
    this.car.chassisBody.position.set(0, 4, 0);
    this.car.chassisBody.quaternion.set(0, 0, 0, 1);
    this.car.chassisBody.angularVelocity.set(0, 0, 0);
    this.car.chassisBody.velocity.set(0, 0, 0);
  }

  brake() {
    for (let i = 0; i < 4; i++) {
      this.car.setBrake(this.controlOptions.brakeForce, i);
    }
  }

  stopCar() {
    for (let i = 0; i < 4; i++) {
      this.car.setBrake(this.controlOptions.slowDownCar, i);
    }
  }

  stopSteer() {
    this.car.setSteeringValue(0, 2);
    this.car.setSteeringValue(0, 3);
  }

  update() {
    const updateWorld = () => {
      if (this.car && this.chassis && this.wheels[0]) {
        // Update chassis
        this.chassis.position.set(
          this.car.chassisBody.position.x + this.chassisModelPos.x,
          this.car.chassisBody.position.y + this.chassisModelPos.y,
          this.car.chassisBody.position.z + this.chassisModelPos.z
        );
        this.chassis.quaternion.copy(this.car.chassisBody.quaternion);
        this.chassis?.helpChassis?.position.copy(this.car.chassisBody.position);
        this.chassis?.helpChassis?.quaternion.copy(
          this.car.chassisBody.quaternion
        );

        // Update wheels
        for (let i = 0; i < 4; i++) {
          if (this.wheels[i].helpWheels && this.car.wheelInfos[i]) {
            this.car.updateWheelTransform(i);
            this.wheels[i].position.copy(
              this.car.wheelInfos[i].worldTransform.position
            );
            this.wheels[i].quaternion.copy(
              this.car.wheelInfos[i].worldTransform.quaternion
            );
            this.wheels[i]?.helpWheels?.position.copy(
              this.car.wheelInfos[i].worldTransform.position
            );
            this.wheels[i]?.helpWheels?.quaternion.copy(
              this.car.wheelInfos[i].worldTransform.quaternion
            );
          }
        }
      }
    };

    this.world.addEventListener('postStep', updateWorld);
  }

  // File upload handlers
  async loadChassisModel(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const gltfLoader = new GLTFLoader();
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const gltf = await new Promise((resolve, reject) => {
          gltfLoader.parse(
            arrayBuffer,
            '',
            (gltf) => resolve(gltf),
            (error) => reject(error)
          );
        });

        this.scene.remove(this.chassis);
        const temp = this.chassis;
        this.chassis = (gltf as any).scene;
        this.scene.add(this.chassis);
        this.chassis = { ...temp, ...(gltf as any).scene };
      } catch (error) {
        console.error('Error loading chassis model:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async loadWheelModel(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const gltfLoader = new GLTFLoader();
      for (let i = 0; i < 4; i++) {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const gltf = await new Promise((resolve, reject) => {
            gltfLoader.parse(
              arrayBuffer,
              '',
              (gltf) => resolve(gltf),
              (error) => reject(error)
            );
          });

          this.scene.remove(this.wheels[i]);
          const temp = this.wheels[i];
          this.wheels[i] = (gltf as any).scene;

          if (i === 1 || i === 3) {
            this.wheels[i].scale.set(
              -1 * this.wheelScale.frontWheel,
              1 * this.wheelScale.frontWheel,
              -1 * this.wheelScale.frontWheel
            );
          } else {
            this.wheels[i].scale.set(
              1 * this.wheelScale.frontWheel,
              1 * this.wheelScale.frontWheel,
              1 * this.wheelScale.frontWheel
            );
          }

          this.scene.add(this.wheels[i]);
          this.wheels[i] = { ...temp, ...(gltf as any).scene };
        } catch (error) {
          console.error('Error loading wheel model:', error);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

// Main component
export default function VehiclePhysics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const carRef = useRef<Car | null>(null);
  const cameraControllerRef = useRef<AdvancedCamera | null>(null);

  // Leva controls
  const [values, set] = useControls(() => ({
    'Camera Settings': folder({
      cameraMode: {
        value: 'third-person',
        options: ['first-person', 'third-person', 'follow', 'orbit', 'hood'],
        onChange: (value) => {
          if (cameraControllerRef.current) {
            cameraControllerRef.current.setMode({ type: value });
          }
        },
      },
    }),
    'Vehicle Physics': folder({
      chassisMass: { value: 250, min: 1, max: 1000, step: 1 },
      'Suspension Settings': folder({
        suspensionStiffness: { value: 55, min: 0, max: 100, step: 1 },
        suspensionRestLength: { value: 0.5, min: -10, max: 10, step: 0.1 },
        frictionSlip: { value: 30, min: 0, max: 50, step: 1 },
        dampingRelaxation: { value: 2.3, min: -10, max: 10, step: 0.1 },
        dampingCompression: { value: 4.3, min: -10, max: 10, step: 0.1 },
        maxSuspensionForce: { value: 10000, min: -10000, max: 10000, step: 10 },
        maxSuspensionTravel: { value: 1, min: -10, max: 10, step: 1 },
        rollInfluence: { value: 0.01, min: 0, max: 10, step: 0.01 },
      }),
      'Vehicle Controls': folder({
        maxSteerVal: { value: 0.5, min: 0, max: 1, step: 0.01 },
        maxForce: { value: 750, min: 1, max: 10000, step: 10 },
        brakeForce: { value: 36, min: 1, max: 100, step: 0.1 },
        slowDownCar: { value: 19.6, min: 1, max: 100, step: 0.1 },
      }),
      'Model Upload': folder({
        'Upload Chassis': button(() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.gltf,.glb';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && carRef.current) {
              carRef.current.loadChassisModel(file);
            }
          };
          input.click();
        }),
        'Upload Wheels': button(() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.gltf,.glb';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && carRef.current) {
              carRef.current.loadWheelModel(file);
            }
          };
          input.click();
        }),
      }),
      'Helper Visibility': folder({
        showChassisHelper: false,
        showWheelsHelper: false,
      }),
    }),
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    // Stats
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // Scene
    const scene = new THREE.Scene();

    // Cannon World
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    world.broadphase = new CANNON.SAPBroadphase(world);

    // Materials
    const bodyMaterial = new CANNON.Material();
    const groundMaterial = new CANNON.Material();
    const bodyGroundContactMaterial = new CANNON.ContactMaterial(
      bodyMaterial,
      groundMaterial,
      {
        friction: 0.1,
        restitution: 0.3,
      }
    );
    world.addContactMaterial(bodyGroundContactMaterial);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const createSpotlight = (color: number, position: THREE.Vector3) => {
      const spotlight = new THREE.SpotLight(color, 2, 0, 0.9, 1, 0);
      spotlight.position.copy(position);
      return spotlight;
    };

    const spotLight1 = createSpotlight(
      0x29dfff,
      new THREE.Vector3(7, 1.291, -6)
    );
    const spotLight2 = createSpotlight(
      0x943dff,
      new THREE.Vector3(-7, 1.291, -6)
    );
    const spotLight3 = createSpotlight(
      0xd5f8ff,
      new THREE.Vector3(0, 1.291, 7)
    );
    scene.add(spotLight1, spotLight2, spotLight3);

    // Environment Map
    const textureLoader = new THREE.CubeTextureLoader();
    textureLoader.setPath('/textures/environmentMaps/2/');

    const environmentMapTexture = textureLoader.load([
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ]);

    scene.environment = environmentMapTexture;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMirror = new Reflector(floorGeometry, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0xffffff,
    });

    const floorMesh = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0,
        emissive: 0xffffff,
        emissiveIntensity: -0.36,
        transparent: true,
        opacity: 0.7,
      })
    );

    floorMirror.rotation.x = -Math.PI * 0.5;
    floorMesh.rotation.x = -Math.PI * 0.5;
    floorMesh.position.y = 0.001;
    scene.add(floorMirror, floorMesh);

    // Floor Physics
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    world.addBody(floorBody);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 4, 6);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const city = new City(scene, world);

    // Car
    const car = new Car(scene, world, () => {
      const advancedCamera = new AdvancedCamera(
        camera,
        car.chassis,
        canvasRef.current!
      );
      advancedCamera.setMode({ type: 'third-person' }); // Установите начальный режим
      cameraControllerRef.current = advancedCamera;
      setLoading(false);
    });

    // const car = new Car(scene, world, () => {
    //   const advancedCamera = new AdvancedCamera(
    //     camera,
    //     car.chassis,
    //     canvasRef.current!
    //   );
    //   cameraControllerRef.current = advancedCamera;
    //   setLoading(false);
    // });
    carRef.current = car;

    // Animation
    const timeStep = 1 / 60;
    let lastCallTime: number | null = null;

    const animate = () => {
      stats.begin();

      if (cameraControllerRef.current) {
        cameraControllerRef.current.update();
      }

      const time = performance.now() / 1000;
      if (!lastCallTime) {
        world.step(timeStep);
      } else {
        const dt = time - lastCallTime;
        world.step(timeStep, dt);
      }
      lastCallTime = time;

      renderer.render(scene, camera);

      stats.end();
      requestAnimationFrame(animate);
    };

    // const animate = () => {
    //   stats.begin();

    //   // if (cameraControllerRef.current && values['Camera Settings'].cameraMode !== 'orbit') {
    //   //   cameraControllerRef.current.update();
    //   //   controls.enabled = false;
    //   // } else {
    //   //   controls.enabled = true;
    //   //   controls.update();
    //   // }

    //   controls.update();

    //   const time = performance.now() / 1000;
    //   if (!lastCallTime) {
    //     world.step(timeStep);
    //   } else {
    //     const dt = time - lastCallTime;
    //     world.step(timeStep, dt);
    //   }
    //   lastCallTime = time;

    //   renderer.render(scene, camera);

    //   stats.end();
    //   requestAnimationFrame(animate);
    // };

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    animate();
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      webApp.requestFullscreen();
    }
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(stats.dom);

      // Dispose of Three.js resources
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          }
        }
      });

      // Dispose of textures
      environmentMapTexture.dispose();

      // Dispose of renderer
      renderer.dispose();

      // Remove Cannon.js world
      world.bodies.forEach((body) => {
        world.removeBody(body);
      });

      cameraControllerRef.current?.dispose();
      cameraControllerRef.current = null;
      // Clear car reference
      carRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (cameraControllerRef.current && values && typeof values === 'object') {
      const cameraMode = (values as any)['Camera Settings']?.cameraMode;
      if (cameraMode) {
        cameraControllerRef.current.setMode({
          type: cameraMode,
        });
      }
    }
  }, [values]);

  // Update car parameters when controls change
  useEffect(() => {
    if (!carRef.current) return;

    // Update vehicle physics
    if (carRef.current?.car?.chassisBody && values?.chassisMass !== undefined) {
      carRef.current.car.chassisBody.mass = values.chassisMass;
    }

    // Update suspension settings
    carRef.current.updateVehicleOptions({
      suspensionStiffness: values.suspensionStiffness,
      suspensionRestLength: values.suspensionRestLength,
      frictionSlip: values.frictionSlip,
      dampingRelaxation: values.dampingRelaxation,
      dampingCompression: values.dampingCompression,
      maxSuspensionForce: values.maxSuspensionForce,
      maxSuspensionTravel: values.maxSuspensionTravel,
      rollInfluence: values.rollInfluence,
    });

    // Update vehicle controls
    carRef.current.controlOptions = {
      ...carRef.current.controlOptions,
      maxSteerVal: values.maxSteerVal,
      maxForce: values.maxForce,
      brakeForce: values.brakeForce,
      slowDownCar: values.slowDownCar,
    };

    // Update helpers visibility
    if (carRef.current.chassis?.helpChassis) {
      carRef.current.chassis.helpChassis.visible = values.showChassisHelper;
    }

    carRef.current.wheels.forEach((wheel) => {
      if (wheel.helpWheels) {
        wheel.helpWheels.visible = values.showWheelsHelper;
      }
    });
  }, [values]);

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <canvas ref={canvasRef} className='fixed top-0 left-0 outline-none' />

      {loading && (
        <div
          className={`
            absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-6 font-sans text-5xl text-white
            bg-white/30 rounded-3xl backdrop-blur-md
            pointer-events-none transition-opacity duration-300
            z-10
          `}
        >
          {Math.round(loadingProgress)}% Loading...
        </div>
      )}
    </div>
  );
}
