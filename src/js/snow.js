/**
 * renders a snowy scene
 */

Webvr.prototype.renderSnowfall = function() {
  // Snow
  let textureLoader = new THREE.TextureLoader();
  let snowflake = textureLoader.load("src/img/snowflake2.png");
  let pointMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    map: snowflake,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    size: 15
  });

  let px, py, pz;
  for (let i = 0; i < this.pCount; i++) {
    px = Math.random() * 5000 - 2500;
    py = Math.random() * 5000 - 2500;
    pz = Math.random() * 5000 - 2500;
    let point = new THREE.Vector3(px, py, pz);
    point.velocity = new THREE.Vector3(0, -5, 0);
    this.points.vertices.push(point);
  }

  let pointSystem = new THREE.Points(this.points, pointMaterial);
  this.scene.add(pointSystem);

  // Skybox
  let light = new THREE.AmbientLight(0xFFFFFF);
  light.intensity = 200;
  this.scene.add(light);

  let skyGeo = new THREE.BoxBufferGeometry(2500, 2500, 2500);
  let skyLoader = new THREE.TextureLoader();
  let skyMtl = new THREE.MeshPhongMaterial({
        map: skyLoader.load("src/img/night_2.jpg"), overdraw: 0.5  // Note: not sure if this image is free use
  });

  let materials = [];
  let t = [];
  let loader = new THREE.TextureLoader();
  for (let i = 0; i < 6; i++) {
      t[i] = skyLoader.load("src/img/night_2.jpg"); //2048x256 // changed
      t[i].repeat.x  = 1 / 4;
      t[i].repeat.y = 1 / 3;
      t[i].minFilter = THREE.NearestFilter;
      t[i].wrapS = t[i].wrapT = THREE.RepeatWrapping
  }
  t[0].offset.x = 2 / 4;  // Right
  t[0].offset.y = 1 / 3;
  t[1].offset.x = 0 / 4;  // Left
  t[1].offset.y = 1 / 3;
  t[2].offset.x = 1 / 4;  // Down
  t[2].offset.y = 2 / 3;
  t[3].offset.x = 1 / 4;  // Up
  t[3].offset.y = 0 / 3;
  t[4].offset.x = 1 / 4;  // Front
  t[4].offset.y = 1 / 3;
  t[5].offset.x = 3 / 4;  // Back
  t[5].offset.y = 1 / 3;
  for (let i = 0; i < 6; i++) {
      materials.push(new THREE.MeshBasicMaterial({ map: t[i], side: THREE.DoubleSide }));
  }

  let sky = new THREE.Mesh(skyGeo, materials)
  sky.material.side = THREE.DoubleSide;
  this.scene.add(sky);
}

Webvr.prototype.drawParticles = function() {
  for (let i = 0; i < this.pCount; i++) {
    let point = this.points.vertices[i];
    point.x += point.velocity.x;
    point.y += point.velocity.y;
    point.z += point.velocity.z;

    point.x += this.wind.x
    point.y += this.wind.y
    point.z += this.wind.z

    let pointThresh = 2500;
    if (Math.random() > 0.9) {
      if (Math.abs(point.x) > pointThresh) {
        point.x *= -1;
      }
      if (Math.abs(point.y) > pointThresh) {
        point.y *= -1;
      }
      if (Math.abs(point.z) > pointThresh) {
        point.z *= -1;
      }
    }
    this.points.verticesNeedUpdate = true;
  }
}

Webvr.prototype.snowAnimation = function() {
  this.drawParticles();
}
