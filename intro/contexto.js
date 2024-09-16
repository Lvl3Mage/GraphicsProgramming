function getWebGLContext() {
  
  var canvas = document.getElementById("myCanvas");
  
  try {
    return canvas.getContext("webgl2");
  }
  catch(e) {
  }
  
  return null;
  
}

function initWebGL() {
  
  var gl = getWebGLContext();
  
  if (!gl)
    alert("WebGL 2.0 no está disponible");
  else
    alert("WebGL 2.0 disponible");

  
}

initWebGL();
