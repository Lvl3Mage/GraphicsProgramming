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

  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }

  // especifica en RGBA el color de fondo (4 valores entre 0 y 1)
  gl.clearColor(1.0,0.0,0.0,1.0);
  
  // borra el Canvas utilizando el color especificado en la línea anterior
  gl.clear(gl.COLOR_BUFFER_BIT);     

    
}

initWebGL();
