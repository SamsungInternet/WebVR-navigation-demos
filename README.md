# WebVR Navigation

Demos of WebVR navigation techniques for WebVR 1.1 Spec. 

## Background

[WebVR 1.1](https://immersive-web.github.io/webvr/spec/1.1/#interface-vrdisplayeventreason) specification supports navigation. 

### Link Traversal

For those using A-Frame, the A-Frame team have added [Link Traversal](https://aframe.io/blog/aframe-v0.6.0/) to navigate from one WebVR page to another WebVR page. Link traversal uses URLs to navigate to new scenes. This means Link Traversal works the in the same way as how current web pages work. No need to manipulate the web history or using URL parameters.

 * [A-Frame demo](https://ada-a-frame.glitch.me/link-traversal.html) by [Ada](https://github.com/AdaRoseCannon)

#### Links (These demos are not implemented in A-frame.) - You can press the "back" or "next" to get to a different scene.

 * [Galaxy Links](https://samsunginter.net/WebVR-navigation-demos/links-galaxy.html)

 * [Snow Links](https://samsunginter.net/WebVR-navigation-demos/links-snowfall.html)

 * [Island Links](https://samsunginter.net/WebVR-navigation-demos/links-island.html)


### Deep Link

 This demo follows Oculus's navigation concept called [Deep Linking](https://developer.oculus.com/documentation/vrweb/latest/concepts/carmel-navigation/). The idea is to introduce WebVR to WebVR page navigation while in Webvr presentation mode. The idea utilizes the [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). The history API allows for manipulation of the history and push new "states" to the history stack.

#### Deep Link demo - You can press the "back" or "next" to get to different scene.

 * [Deep Link](https://samsunginter.net/WebVR-navigation-demos/deep-link.html)

Thanks @[Tim Chang](https://github.com/timchang514), for help during his time (Summer'17) as an intern on my team.