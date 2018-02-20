/**
 * Modify the state parameter from url and determine whether to 
 * modify the history or push to history
 *
 * @param {int} state - the scene to render 
 * @param {bool} change - whether to modify history or push to history
 */
Webvr.prototype.navigationState = function(state, change) {
  let stateObject = {};
  let url = window.location.pathname + "?" + "state=" + encodeURIComponent(state);
  if (change) {
    history.replaceState(stateObject, "navigation", url);
  } else {
    history.pushState(stateObject, "navigation", url);
  }
}

/**
 * Go to previous scene - triggered by window.onpopstate
 */
Webvr.prototype.previousState = function() {
  this.getScene(false);
}

/**
 * Gets the current state param
 * @return {int} scene
 */
Webvr.prototype.getUrlState = function() {
  let currentState = location.search.substr(1);
  let result = {};
  currentState.split("&").forEach((key) => {
    let value = key.split("=");
    result[value[0]] = decodeURIComponent(value[1]);
  });
  if (result.state) {
    return Number((result.state).replace("/", ""));
  }
  return 1;
}

/**
 * Gets the scene to render
 * @param {int} state - which scene to render
 */
Webvr.prototype.getScene = function(state) {
  if (state) {
    if (state > 3 || state < 1){
      state = 1; // reset to 1
    }
    this.state = state;
    // push new state
    this.navigationState(state, false);
  } else {
    this.state = this.getUrlState();
  }
  if (this.state > 3 || this.state < 1){
    this.state = 1; // reset to 1
  }
  switch(this.state) {
    case 3:
      this.clearScene();
      this.renderIsland();
      this.setupNavigation(false, true);
      break;
    case 2:
      this.clearScene();
      this.renderSnowfall();
      this.setupNavigation(true, true);
      break;
    case 1:
    default:
      this.clearScene();
      this.renderGalaxy();
      this.setupNavigation(true, false);
      break;
  }
}
