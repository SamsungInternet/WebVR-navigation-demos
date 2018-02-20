/*
  Sets up the galaxy scene
 */
Webvr.prototype.getScene = function(state) {
  this.state = 1;
  this.renderGalaxy();
  this.setupNavigation(true, false);
};

(function(){
  let canvas = document.getElementById('canvas');
  let vr = new Webvr(canvas);
  vr.setupVRDisplay();
  vr.init();

  vr.renderGalaxy();
  vr.setupNavigation(true, false);

  let renderer = vr.getRenderer();
  renderer.domElement.addEventListener("mousedown", onTouch, false);
  renderer.domElement.addEventListener("touchstart", onTouch, false);
  canvas.addEventListener("click", onTouch, false);

  function onTouch() {
    //console.log(pickedItem);
    if (pickedItem == "forward") {
      pickedItem = null;
      location.href = "/wvr/links-snow.html";
    }
  }
})();
