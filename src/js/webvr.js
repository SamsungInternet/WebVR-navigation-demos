var pickedItem = null;

var Webvr = function(canvas) {
  // set up webgl scene
  this.canvas = canvas;
  this.gl = canvas.getContext("webgl");
  // renderer is for non vr presentation
  this.renderer = new THREE.WebGLRenderer({canvas: canvas});
  this.renderer.setClearColor(0x000000, 1);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(this.canvas.width, this.canvas.height);
  // set up scene and camera
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x000000);
  this.camera = new THREE.PerspectiveCamera(107, window.innerWidth / window.innerHeight, 0.5, 50000);
  this.camera.position.z = 50;
  this.camera.name = "camera";
  this.scene.add(this.camera);
  // set up controls for vr
  this.controls = new THREE.VRControls(this.camera);
  // stereo view when presenting in VR mode
  this.effect = new THREE.StereoEffect(this.renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  // add a pointer to camera for interacting with objects in scene
  this.crosshair = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.04, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true
    })
 );
  this.crosshair.position.z = -4;
  this.camera.add(this.crosshair);

  // pointer for vr controller
  this.pointer = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.04, 32),
    new THREE.MeshBasicMaterial({
      color: 0xf426ff,
      opacity: 0.5,
      transparent: true
    })
 );
  this.pointer.position.z = -4;
  this.camera.add(this.pointer);

  // touch events
  this.userTap = false;
  // scene specific vars
  this.state = 1; // keep track of scene for history
  this.controller = null;

  // Galaxy
  this.sun = new THREE.Object3D();
  this.mercury = new THREE.Object3D();
  this.venus = new THREE.Object3D();
  this.earth = new THREE.Object3D();
  this.moon = new THREE.Object3D();
  this.mars = new THREE.Object3D();
  this.mercuryGroup = new THREE.Group();
  this.mercuryPivot = new THREE.Object3D();
  this.venusGroup = new THREE.Group();
  this.venusPivot = new THREE.Object3D();
  this.earthGroup = new THREE.Group();
  this.earthPivot = new THREE.Object3D();
  this.moonGroup = new THREE.Group();
  this.moonPivot = new THREE.Object3D();
  this.marsGroup = new THREE.Group();
  this.marsPivot = new THREE.Object3D();

  // Snow
  this.pCount = 5000;
  this.points = new THREE.Geometry();
  this.wind = new THREE.Vector3(Math.random(-1, 1), Math.random(-1, 1), Math.random(-1, 1));

  // Island
  this.raycaster = new THREE.Raycaster();
  this.treeCache = [];
}

/**
 * Initialize beginning scene and add event listeners for vr
 */
Webvr.prototype.init = function() {
  this.getScene(false);
  this.onResize();
  this.animate();
  // add event listeners
  window.addEventListener("resize", this.onResize.bind(this), false);
  window.addEventListener("vrdisplayactivate", this.onVREnterPresent.bind(this), false);
}

/**
 * clears canvas for next redraw
 */
Webvr.prototype.clearScene = function() {
  console.log("start to clear scene");
  while(this.scene.children.length > 1) {
    this.scene.remove(this.scene.children[1]);
  }
  // readd camera
  this.scene.add(this.camera);
  console.log("finish clear scene");
}

/**
 * detect if WebVR is enabled
 */
Webvr.prototype.setupVRDisplay = function() {
  // Get VR displays
  let button = document.getElementById("button");
  if (navigator.getVRDisplays) {
    console.log("finding valid display");
    // frameData = new VRFrameData();
    navigator.getVRDisplays().then(displays => {
      // grab an available VR display
      // No VR display found
      if (displays.length === 0) {
        console.warn("No devices available able to present.");
        return;
      }
      this.vrDisplay = displays[displays.length - 1];
      console.log("found vr display");
      this.vrDisplay.depthNear = 0.1;
      this.vrDisplay.depthFar = 8192.0;  // From 4096
      // Request vr mode from device
      if (this.vrDisplay.capabilities.canPresent) {
        button.addEventListener("click", this.onVREnterPresent.bind(this), false);
      }
    }).catch((err) => {
      console.error(err);
    });
  } else {
    let warning = document.getElementById("warning");
    warning.innerHTML = "VR Display not found.";
    button.style.display = "none";
  }
}

/**
 * resizes canvas when entering and exiting WebVR mode
 */
Webvr.prototype.onResize = function() {
  if (this.vrDisplay && this.vrDisplay.isPresenting) {
    let leftEye = this.vrDisplay.getEyeParameters("left");
    let rightEye = this.vrDisplay.getEyeParameters("right");
    this.renderer.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
    this.renderer.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
  } else {
    this.renderer.width = this.renderer.offsetWidth * window.devicePixelRatio;
    this.renderer.height = this.renderer.offsetHeight * window.devicePixelRatio;
    this.canvas.removeAttribute("style");
  }
}

/**
 * enters WebVR mode from event listener
 */
Webvr.prototype.onVREnterPresent = function() {
  this.vrDisplay.requestPresent([{
    source: this.canvas
  }]).then(function(){
    console.log("Successfully entered vr");
  }, (err) => {
    console.warn(err.message);
  });
}

/**
 * Draws next and back text buttons on each scene for navigation to next scene
 * only for Deep-linking
 * I can do better than this.
 *
 * @param {bool} canGoForward - if scene can navigate to next scene
 * @param {bool} canGoBack - if scene can navigate to previous scene
 */
Webvr.prototype.setupNavigation = function(canGoForward, canGoBack) {
  // forward and back buttons using history api
  // https://developer.mozilla.org/en-US/docs/Web/API/History_API
  let forward = null;
  let back = null;
  let buttonGeometry = new THREE.PlaneGeometry(20, 25, 32);
  let buttonMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    opacity: 0.0
  });
  buttonMaterial.transparent = true;
  let fontLoader = new THREE.FontLoader();
  fontLoader.load("src/fonts/helvetiker_regular.typeface.json", (font) => {
    let options = {
      font: font,
      size: 5,
      height: 1,
      curveSegments: 6,
      bevelEnabled: false,
      bevelThickness: 8,
      bevelSize: 4,
      bevelSegments: 2
    };
    let material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    forward = new THREE.TextGeometry("Next", options);
    let forwardTextMesh = new THREE.Mesh(forward, material);
    forwardTextMesh.position.z = -105;
    forwardTextMesh.position.x = 55;
    forwardTextMesh.position.y = -5;
    forwardTextMesh.name = "forward";
    // add for now ---
    if (canGoForward) {
      let plane = new THREE.Mesh(buttonGeometry, buttonMaterial);
      plane.name = "forward";
      plane.position.z = -105;
      plane.position.y = -5;
      plane.position.x = 60;
      this.scene.add(forwardTextMesh);
      this.scene.add(plane);
    }

    back = new THREE.TextGeometry("Back", options);
    let backTextMesh = new THREE.Mesh(back, material);
    backTextMesh.name = "back";
    backTextMesh.position.z = -105;
    backTextMesh.position.x = -55;
    backTextMesh.position.y = -7;

    if (canGoBack) {
      let quad = new THREE.Mesh( buttonGeometry, buttonMaterial);
      quad.name = "back";
      quad.position.z = -105;
      quad.position.y = -7;
      quad.position.x = -50;
      this.scene.add(backTextMesh);
      this.scene.add(quad);
    }
  });
}

/**
 * Object picker to pick things in the scene
 */
Webvr.prototype.picker = function() {
  let self = this;
  let ray = new THREE.Raycaster(self.camera.position, self.camera.position.normalize());
  let intersects = ray.intersectObjects(self.scene.children);
  let len = intersects.length;
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      try {
        if (intersects[i].object.name) {
          pickedItem = intersects[i].object.name;
        }
      } catch(err) {
        //
      }
    }
  }
}

/**
 * Animation for scene
 */
Webvr.prototype.animate = function() {
  if (this.vrDisplay) {
    this.vrDisplay.requestAnimationFrame(this.animate.bind(this));
    if (this.vrDisplay.isPresenting) {
      // Render stero view when presenting in VR
      this.controls.update();
      this.picker();
      this.effect.render(this.scene, this.camera);
      this.vrDisplay.submitFrame();
      this.getAnimation();
    } else {
      // VR display is available, but not presenting in VR
      this.controls.update();
      this.picker();
      //console.log(pickedItem);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.renderer.render(this.scene, this.camera);
      this.getAnimation();
    }
  } else {
    // No VRDisplay found.
    window.requestAnimationFrame(this.animate.bind(this));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.render(this.scene, this.camera);
    this.getAnimation();
  }
}

/**
 * Get correct animation
 */
Webvr.prototype.getAnimation = function() {
  switch (this.state) {
    case 1:
      this.galaxyAnimation();
      break;
    case 2:
      this.snowAnimation();
      break;
    case 3:
      this.islandAnimation();
      break;
  }
}

/**
 * Return curent state of scene
 */
Webvr.prototype.getState = function() {
  return this.state;
}

/**
 * Return renderer
 */
Webvr.prototype.getRenderer = function() {
  return this.renderer;
}