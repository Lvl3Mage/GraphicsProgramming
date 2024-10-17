//
// Programa ejemplo para el dibujado de modelos poligonales
//

// modelo a dibujar
var modeloSeleccionado = unCuadradoVC;

//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  
  setUniform ("modelMatrix", getRotationMatrix());     // permite rotar el modelo

  draw(modeloSeleccionado);  
  
}

if (initWebGL()) {

  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition");
  initUniformRefs("modelMatrix");

  initPrimitives(modeloSeleccionado);
  initRendering("CULL_FACE","DEPTH_TEST");
  initHandlers();

  requestAnimationFrame(drawScene);
  
}