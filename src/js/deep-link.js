(function(){
  let canvas = document.getElementById('canvas');
  let vr = new Webvr(canvas);
  let urlState = vr.getUrlState();
  vr.navigationState(urlState, true);
  vr.setupVRDisplay();
  vr.init();
  // initial page load should be page 1
  window.onpopstate = function() {
    vr.previousState();
    return;
  }
  let renderer = vr.getRenderer();
  renderer.domElement.addEventListener("mousedown", onTouch, false);
  renderer.domElement.addEventListener("touchstart", onTouch, false);
  canvas.addEventListener("click", onTouch, false);

  // Solely for desktop testing
  $(document).keydown((e) => {
    switch(e.which) {
      case 37: //back
        console.log("prev scene");
        var state = vr.getState();
        vr.getScene(state-1);
        break;
      case 39: //forward
        console.log("next scene");
        var state = vr.getState();
        vr.getScene(state+1);
        break;
    }
  });

  function onTouch() {
    //console.log(pickedItem);
    if (pickedItem == "forward") {
      pickedItem = null;
      let state = vr.getState();
      vr.getScene(state+1);
      return;
    }
    if (pickedItem == "back") {
      pickedItem = null;
      let state = vr.getState();
      vr.getScene(state-1);
      return;
    }
  }
})();
