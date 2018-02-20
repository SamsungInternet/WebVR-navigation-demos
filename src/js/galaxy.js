/**
 * renders the galaxy up to the asteroid belt
 */
Webvr.prototype.renderGalaxy = function() {
  let loader = new THREE.TextureLoader();
  const SCALE = 3;
  const PLANET_SCALE = 2;

  // Planet radius, Million Miles
  const MERCURY = 36;
  const VENUS = 66;
  const EARTH = 93;
  const MARS = 141;

  // Sun
  loader.load('src/img/2k_sun.jpg', (texture) => {
    let geometry = new THREE.SphereGeometry(40, 20, 20);
    let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    this.sun = new THREE.Mesh(geometry, material);
    this.sun.position.x = 0;
    this.sun.position.y = 0;
    this.sun.position.z = -150;
    this.sun.rotation.x = 10;
    this.scene.add(this.sun);
  });

  // Mercury
  loader.load('src/img/2k_mercury.jpg', (texture) => {
    let geometry = new THREE.SphereGeometry(1.9 * PLANET_SCALE, 20, 20);
    let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    this.mercury = new THREE.Mesh(geometry, material);
    this.mercury.position.x = MERCURY * SCALE;
    this.mercury.position.y = -MERCURY * SCALE;
    this.mercury.position.z = -150;
    this.mercuryPivot.position.x = 0;
    this.mercuryPivot.position.y = 0;
    this.mercuryPivot.position.z = -150;
    this.mercuryGroup.add(this.mercuryPivot);
    this.mercuryPivot.add(this.mercury);
    this.scene.add(this.mercuryGroup);
  });

  // Venus
  loader.load('src/img/2k_venus_atmosphere.jpg', (texture) => {
    let geometry = new THREE.SphereGeometry(4.7 * PLANET_SCALE, 20, 20);
    let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    this.venus = new THREE.Mesh(geometry, material);
    this.venus.position.x = VENUS * SCALE;
    this.venus.position.y = -VENUS * SCALE;
    this.venus.position.z = -150;
    this.venusPivot.position.x = 0;
    this.venusPivot.position.y = 0;
    this.venusPivot.position.z = -150;
    this.venusGroup.add(this.venusPivot);
    this.venusPivot.add(this.venus);
    this.scene.add(this.venusGroup);
  });

  // Earth
  loader.load('src/img/earth_atmos_4096.jpg', (texture) => {
    let geometry = new THREE.SphereGeometry(5 * PLANET_SCALE, 20, 20);
    let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    this.earth = new THREE.Mesh(geometry, material);
    this.earth.position.x = EARTH * SCALE;
    this.earth.position.y = -EARTH * SCALE;
    this.earth.position.z = -150;
    this.earthPivot.position.x = 0;
    this.earthPivot.position.y = 0;
    this.earthPivot.position.z = -150;
    this.earthGroup.add(this.earthPivot);
    this.earthPivot.add(this.earth);
    this.earthPivot.add(this.moonGroup);
    this.scene.add(this.earthGroup);
  });

  // Moon
  loader.load('src/img/moon_1024.jpg', (texture) => {
  let geometry = new THREE.SphereGeometry(1.42 * PLANET_SCALE, 20, 20)
  let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
  this.moon = new THREE.Mesh(geometry, material);
  this.moon.position.x = 8 * SCALE;
  this.moon.position.y = -8 * SCALE;
  this.moon.position.z = -150;
  this.moon.rotation.x = 10;
  this.moonPivot.position.x = EARTH * SCALE;
  this.moonPivot.position.y = -EARTH * SCALE;
  this.moonPivot.rotation.z = 0;
  this.moonGroup.add(this.moonPivot);
  this.moonPivot.add(this.moon);
  });

  // Mars
  loader.load('src/img/2k_mars.jpg', (texture) => {
    let geometry = new THREE.SphereGeometry(4.7 * PLANET_SCALE, 20, 20);
    let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    this.mars = new THREE.Mesh(geometry, material);
    this.mars.position.x = MARS * SCALE;
    this.mars.position.y = -MARS * SCALE;
    this.mars.position.z = -150;
    this.marsPivot.position.x = 0;
    this.marsPivot.position.y = 0;
    this.marsPivot.position.z = -150;
    this.marsGroup.add(this.marsPivot);
    this.marsPivot.add(this.mars);
    this.scene.add(this.marsGroup);
  });

  // Light
  let light = new THREE.AmbientLight(0xFFFFFF);
  light.intensity = 200;
  this.scene.add(light);

  // Skybox
  let materials = [];
  let suffixes = ["bk", "ft", "up", "dn", "lf", "rt"]
  let skyGeo = new THREE.BoxBufferGeometry(50000, 50000, 50000);
  let skyLoader = new THREE.TextureLoader();
  for (var i = 0; i < 6; i++) {
      materials.push(new THREE.MeshBasicMaterial({ map: skyLoader.load("src/img/corona_" + suffixes[i] + ".png"), side: THREE.DoubleSide }));
  }
  let sky = new THREE.Mesh(skyGeo, materials);                // Create sky mesh from geometry and material
  sky.material.side = THREE.DoubleSide;
  this.scene.add(sky);
}

Webvr.prototype.galaxyAnimation = function() {
  const rot_speed = 0.4;
  try {
    this.earth.rotation.y += rot_speed;
    this.moon.rotation.y += (rot_speed / 27.322);
    this.moonPivot.rotation.z += rot_speed / 27.322;
    this.earthPivot.rotation.z += rot_speed / 365;
    this.marsPivot.rotation.z += rot_speed / 687;
    this.mars.rotation.y += rot_speed;
    this.venusPivot.rotation.z += rot_speed / 225;
    this.venus.rotation.y += rot_speed / 116;
    this.mercury.rotation.y += rot_speed / 58.5;
    this.mercuryPivot.rotation.z += rot_speed / 88;
  } catch (e) {
    //
  }
}