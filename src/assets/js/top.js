// swiper
// それぞれモジュールが別々になっているので、必要なものをインポートする。
// swiper.cssはscss/vendorに格納して使うこと
// 参考: https://swiperjs.com/api/#custom-build
import { Swiper, Navigation, Autoplay, EffectFade, Lazy } from 'swiper';
import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// css
import '../scss/top.scss';

document.addEventListener('DOMContentLoaded', () => {

    // サイズを指定
    const width = 400;
    const height = 400;

    // 各キャンバスに描画
    createCylinder("myCanvas1"); // 球体を円柱に変更
    createCube("myCanvas2");
    createTorus("myCanvas3");
    createExtrudedPolygon("myCanvas4");

    function createCylinder(canvasId) {
      const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(`#${canvasId}`), alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height);
      camera.position.set(0, 0, 1000);

      const cylinderRadius = 100; 
      const cylinderHeight = 400; 
      const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32); // 円柱を作成
      const cylinderMaterial = new THREE.MeshNormalMaterial();
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      scene.add(cylinder);

      function tick() {
        cylinder.rotation.y += 0.01;
        cylinder.rotation.x += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
      tick();
    }

    function createCube(canvasId) {
      const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(`#${canvasId}`), alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height);
      camera.position.set(0, 0, 1000);

      const geometry = new THREE.BoxGeometry(200, 200, 200);
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      function tick() {
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
      tick();
    }

    function createTorus(canvasId) {
      const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(`#${canvasId}`), alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height);
      camera.position.set(0, 0, 1000);

      const torusGeometry = new THREE.TorusGeometry(100, 40, 16, 100);
      const torusMaterial = new THREE.MeshNormalMaterial();
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      scene.add(torus);

      function tick() {
        torus.rotation.y += 0.01;
        torus.rotation.x += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
      tick();
    }

    function createExtrudedPolygon(canvasId) {
      const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(`#${canvasId}`), alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height);
      camera.position.set(0, 0, 1000);

      function createPolygon(sides, radius) {
        const shape = new THREE.Shape();
        const angle = (2 * Math.PI) / sides;
        for (let i = 0; i < sides; i++) {
          const x = radius * Math.cos(i * angle);
          const y = radius * Math.sin(i * angle);
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        shape.lineTo(radius, 0);
        return shape;
      }

      const polygonShape = createPolygon(5, 200); // 5辺の多角形（五角形）
      const extrudeSettings = { depth: 100, bevelEnabled: false };
      const geometry = new THREE.ExtrudeGeometry(polygonShape, extrudeSettings);
      const material = new THREE.MeshNormalMaterial();
      const polygonMesh = new THREE.Mesh(geometry, material);
      scene.add(polygonMesh);

      function tick() {
        polygonMesh.rotation.y += 0.01;
        polygonMesh.rotation.x += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
      tick();
    }

    gsap.registerPlugin(ScrollTrigger);
    // 各パララックス要素にアニメーションを適用
    for (let i = 1; i <= 4; i++) {
      gsap.fromTo(
          `.js-parallax-${i}`, // アニメーションさせる要素
          {
              yPercent: 100, // 下に要素の幅の1倍分移動
          },
          {
              yPercent: -100, // 上に要素の幅の1倍分移動
              ease: "none", // イージングなし
              scrollTrigger: {
                  trigger: `.js-parallax-${i}`, // アニメーションのトリガー要素
                  start: "top bottom", // アニメーション開始位置
                  end: "bottom top", // アニメーション終了位置
                  scrub: true, // スクロールに合わせて動く
              },
          }
      );
  }

});

