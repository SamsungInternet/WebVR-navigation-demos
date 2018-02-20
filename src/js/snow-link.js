/*
  Sets up the snowy scene
 */
Webvr.prototype.getScene = function(state) {
  this.state = 2;
  this.renderSnowfall();
  this.setupNavigation(true, true);
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
    //console.log(pickedItem);
    if (pickedItem == "forward") {
      pickedItem = null;
      location.href = "/wvr/links-island.html";
    }
    if (pickedItem == "back") {
      pickedItem = null;
      location.href = "/wvr/links-galaxy.html";
    }
  }
})();
