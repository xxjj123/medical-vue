<template>

  <div>
    <div>
      <div ref="sceneContainer" class="h-full w-full"></div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import { xhr_getModel3d } from "@/api";
export default {
  name: "GltfViewer",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      model: null,
      controls: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initScene();

      window.addEventListener("resize", this.onWindowResize);
    })

  },
  computed: {
    ...mapState("viewInitStore", ["seriesInfo"]),
  },
  watch: {
    seriesInfo: {
      handler(nVal, oVal) {
        if (nVal) {
          this.download3D(nVal.seriesId);
        }
      },
      deep: true,
      immediate: true,
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize);
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initScene() {
      const width = this.$refs.sceneContainer.clientWidth;
      const height = this.$refs.sceneContainer.clientHeight;

      // 场景
      this.scene = new THREE.Scene();

      // 相机
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 5);

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x000000); // 设置背景色为黑色
      this.$refs.sceneContainer.appendChild(this.renderer.domElement);

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // 启用阻尼效果（惯性）
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = true;
      this.controls.maxPolarAngle = Math.PI; // 允许的最大极角
      this.controls.minPolarAngle = 0; // 允许的最小极角

      // 灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 增加环境光
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);
    },
    async download3D(seriesId) {
      try {
        const res = await xhr_getModel3d({
          seriesId: seriesId,
        });

        if (res) {
          const arraybuffer = res.data;

          if (arraybuffer) {
            this.loadModel(arraybuffer);
            console.log(arraybuffer);
          }
        } else {
          console.error("Request failed: No data returned");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    },
    load3D() {
      this.download3D();
      this.onWindowResize()
    },
    loadModel(arraybuffer) {
      const loader = new GLTFLoader();
      loader.parse(arraybuffer, "", (gltf) => {
        this.model = gltf.scene;
        this.model.rotation.x = Math.PI / 2;
        console.log(this.model.rotation);

        // 计算模型的包围盒
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 将模型居中
        this.model.position.x -= center.x;
        this.model.position.y -= center.y;
        this.model.position.z -= center.z;

        // 设置相机位置以适应模型
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        this.camera.position.z = cameraZ * 1.6; // 调整距离以适应模型大小

        // 将相机对准模型中心
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // 更新 OrbitControls 的目标为模型中心
        this.controls.target.copy(new THREE.Vector3(0, 0, 0));
        this.controls.update();
        console.log(this.controls);

        // 添加模型到场景
        this.scene.add(this.model);

        // 渲染场景
        this.animate();
      });
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update(); // 更新控制器
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      const width = this.$refs.sceneContainer.clientWidth;
      const height = this.$refs.sceneContainer.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    },
  },
};
</script>

<style scoped>
/* 为了确保Three.js画布填满容器 */
div {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
