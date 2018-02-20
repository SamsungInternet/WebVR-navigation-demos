/**
 * Adapted from https://codepen.io/chribbe/pen/LVwgJE
 * renders an island
 */

Webvr.prototype.renderIsland = function () {
  let self = this;

  this.scene.background = new THREE.Color(0x6092c1);

  // Lighting
  let light = new THREE.HemisphereLight(0xffffff, 0xb3858c, .55);
  this.scene.add(light);

  let shadowLight = new THREE.DirectionalLight(0xffe79d, .7);
  shadowLight.position.set(80, 120, 50);
  shadowLight.castShadow = true;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  this.scene.add(shadowLight);

  let backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(200, 100, 100);
  this.scene.add(backLight);

  // Water
  let waterGeo = new THREE.BoxGeometry(10000, 10000, 100, 22, 22);
  for (let i = 0; i < waterGeo.vertices.length; i++) {
    let vertex = waterGeo.vertices[i];
    if (vertex.z > 0) {
      vertex.z += Math.random() * 2 - 1;
      vertex.x += Math.random() * 5 - 2.5;
      vertex.y += Math.random() * 5 - 2.5;
    }
    vertex.wave = Math.random() * 100;
  }
  waterGeo.computeFaceNormals();
  waterGeo.computeVertexNormals();

  let waterMtl = new THREE.MeshLambertMaterial({
    color: 0x6092c1,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });

  let sea = new THREE.Mesh(waterGeo, waterMtl);
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -105;
  sea.receiveShadow = true;
  this.scene.add(sea);

  // Island
  let islandGeo = new THREE.PlaneGeometry(1000, 1000, 60, 60);
  let zeroVector = new THREE.Vector3();

  let mods = [];
  let modVector;
  let modAmount = Math.floor(Math.random() * 6 + 1);

  for (let j = 0; j < modAmount; j++) {
    let modVector = new THREE.Vector3(Math.random() * 350, Math.random() * 350, 0);
    modVector.radius = Math.random() * 400;
    modVector.dir = Math.random() * 1 - .6 + modVector.radius / 5000;
    mods.push(modVector);
  }
  let midY = 0;
  for (let i = 0; i < islandGeo.vertices.length; i++) {
    let vertex = islandGeo.vertices[i];
    vertex.z = -vertex.distanceTo(zeroVector) * .15 + 15 + Math.random() * 3 - 6;
    for (let j = 0; j < mods.length; j++) {
      let modVector = mods[j];
      if (vertex.distanceTo(modVector) < modVector.radius) {
        vertex.z += vertex.distanceTo(modVector) / 2 * modVector.dir;
      }
    }
    vertex.y += Math.random() * 20 - 10;
    vertex.x += Math.random() * 20 - 10;
    midY += vertex.z;
  }

  midY = midY / islandGeo.vertices.length;

  islandGeo.computeFaceNormals();
  islandGeo.computeVertexNormals();
  let island = new THREE.Mesh(islandGeo, new THREE.MeshLambertMaterial({
    color: 0x9bb345,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide,
    wireframe: false
  }));
  island.rotation.x = -Math.PI / 2;
  island.position.y = -14;
  island.receiveShadow = true;
  island.castShadow = true;

  this.scene.add(island);

  // Trees
  let forest = this.make_forest(Math.random() * 20 + 10, new THREE.Vector3(0, 0, 0), 700);
  this.scene.add(forest.threegroup);

  let extraForests = Math.floor(Math.random() * 15);
  for (let i = 0; i < extraForests; i++) {
    let forest = this.make_forest(Math.random() * 100, new THREE.Vector3(Math.random() * 500 - 250, 0, Math.random() * 500 - 250), Math.random() * 300);
    this.scene.add(forest.threegroup);
  }

  // TODO: maybe birds?
}

Webvr.prototype.islandAnimation = function() {
  // Nothing to animate (yet)
}

Webvr.prototype.make_tree = function() {
  let height = 9 + Math.random() * 8;
  let boxGeom = new THREE.BoxGeometry(2, height, 1);
  this.root = new THREE.Mesh(boxGeom, this.yellowMat);
  this.root.position.y = 0;

  let sphereGeometry = new THREE.SphereGeometry(6, 8);

  for (let i = 0; i < sphereGeometry.vertices.length; i++) {
    let vertex = sphereGeometry.vertices[i];
    vertex.y += Math.random() * 3 - 1.5;
    vertex.x += Math.random() * 1 - .5;
    vertex.z += Math.random() * 1 - .5;
  }

  sphereGeometry.computeFaceNormals();
  sphereGeometry.computeVertexNormals();

  this.sphereGeometry = sphereGeometry;
  this.sphere = new THREE.Mesh(sphereGeometry, this.greenMat);
  this.sphere.position.y = height / 2 + 2;
  this.sphere.scale.y = .75 + Math.random() * .5;
}

Webvr.prototype.make_forest = function(amount, pos, radius) {
  if (!this.treeCache || this.treeCache.length < 5) {
    for (let i = 0; i < 10; i++) {
      let t = new this.make_tree();
      this.treeCache.push(t);
    }
  }

  let yellowMat = new THREE.MeshLambertMaterial({
    color: 0xffde79,
    shading: THREE.FlatShading
  });

  let greenMat = new THREE.MeshLambertMaterial({
    color: 0xa6d247,
    shading: THREE.FlatShading
  });

  let roots = [];
  let crowns = [];
  let downVector = new THREE.Vector3(0, -1, 0);
  for (let i = 0; i < amount; i++) {
    let c = {
      position: new THREE.Vector3()
    };
    c.position.y = 100;
    let angle = Math.random() * 360;
    let r_radius = Math.random() * radius;
    c.position.x = pos.x + r_radius * Math.cos(angle);
    c.position.z = pos.z + r_radius * Math.sin(angle);
    this.scene.updateMatrixWorld();
    this.raycaster.set(c.position, downVector);
    let collisions = this.raycaster.intersectObject(this.scene, true);

    if (collisions.length > 0) {
      if (collisions[0].object.name == "island") {
        let rnd = Math.floor(Math.random() * this.treeCache.length);
        c.root = this.treeCache[rnd].root.clone();
        c.sphere = this.treeCache[rnd].sphere.clone();

        c.root.position.y = c.sphere.position.y = collisions[0].point.y + 6;
        c.root.position.x = c.sphere.position.x = c.position.x;
        c.root.position.z = c.sphere.position.z = c.position.z;
        c.sphere.position.y += 4 + Math.random() * 4;
        roots.push(c.root);
        crowns.push(c.sphere);
      }
    } else {
      console.log("NOT FOUND")
    }
  }

  roots = this.mergeMeshes(roots);
  crowns = this.mergeMeshes(crowns);

  this.threegroup = new THREE.Group();
  this.roots = new THREE.Mesh(roots, yellowMat);
  this.crowns = new THREE.Mesh(crowns, greenMat);
  this.threegroup.add(this.roots);
  this.threegroup.add(this.crowns);

  this.threegroup.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return this;
}

Webvr.prototype.mergeMeshes = function(meshes) {
  let combined = new THREE.Geometry();

  for (let i = 0; i < meshes.length; i++) {
    meshes[i].updateMatrix();
    combined.merge(meshes[i].geometry, meshes[i].matrix);
  }

  return combined;
}
