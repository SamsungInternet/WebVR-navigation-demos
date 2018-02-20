/*
  Sets up the island scene
 */
Webvr.prototype.getScene = function(state) {
  this.state = 3;
  this.renderIsland();
  this.setupNavigation(false, true);
};

(function(){
  let canvas = document.getElementById('canvas');
  let vr = new Webvr(canvas);
  vr.setupVRDisplay();
  vr.init();

  let renderer = vr.getRenderer();
  renderer.domElement.addEventListener("mousedown", onTouch, false);
  renderer.domElement.addEventListener("touchstart", onTouch, false);
  canvas.addEventListener("click", onTouch, false);

  function onTouch() {
    if (pickedItem == "back") {
      pickedItem = null;
      location.href = "/wvr/links-snow.html";
    }
  }
})();
