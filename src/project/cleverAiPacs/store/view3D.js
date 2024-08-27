import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { xhr_getModel3d } from "@/api";

export default {
  namespaced: true,
  state: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    model: null,
  },
  mutations: {
    SET_SCENE(state, scene) { state.scene = scene; },
    SET_CAMERA(state, camera) { state.camera = camera; },
    SET_RENDERER(state, renderer) { state.renderer = renderer; },
    SET_CONTROLS(state, controls) { state.controls = controls; },
    SET_MODEL(state, model) { state.model = model; },
  },
  actions: {
    initScene({ commit }, container) {
      console.log(container)
      const { scene, camera, renderer, controls } = initializeThree(container);
      commit("SET_SCENE", scene);
      commit("SET_CAMERA", camera);
      commit("SET_RENDERER", renderer);
      commit("SET_CONTROLS", controls);

      window.addEventListener("resize", () => resizeHandler(container, camera, renderer));
      animate(renderer, scene, camera, controls);
    },

    async loadModel({ state, commit }, seriesId) {
      try {
        const model = await loadGLTFModel(state, seriesId);
        state.scene.add(model);
        commit("SET_MODEL", model);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    },
  },
};

function initializeThree(container) {
  console.log(container)
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  return { scene, camera, renderer, controls };
}

function resizeHandler(container, camera, renderer) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate(renderer, scene, camera, controls) {
  function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  }
  render();
}

async function loadGLTFModel(state, seriesId) {
  const res = await xhr_getModel3d({ seriesId });
  if (!res || !res.data) {
    throw new Error("No data returned");
  }

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.parse(res.data, "", (gltf) => {
      const model = gltf.scene;
      model.rotation.x = Math.PI / 2;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = state.camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      state.camera.position.z = cameraZ * 1.6;

      state.camera.lookAt(new THREE.Vector3(0, 0, 0));
      state.controls.target.copy(new THREE.Vector3(0, 0, 0));
      state.controls.update();

      resolve(model);
    }, reject);
  });
}
