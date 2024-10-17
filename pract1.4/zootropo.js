
var nElementos = 35;
var incrementoAnguloEntreFrames = 0, anguloTotal = 0;
var anguloEntreDosElementos = 2 * Math.PI / nElementos;
var incrementoAngulo = anguloEntreDosElementos / 10;

function drawZootropo () {

    var matYR  = mat4.create();
    var matYR2 = mat4.create();
    var matS   = mat4.create();
    var matT   = mat4.create();
    var matC   = getCameraMatrix();

    mat4.fromScaling     (matS, [0.1, 0.1, 0.1]);
    mat4.fromTranslation (matT, [1, 0, 0]);
    mat4.fromYRotation   (matYR2, anguloTotal);

    for (var i = 0; i < nElementos; i++) {
      mat4.fromYRotation (matYR,  anguloEntreDosElementos * i);
      drawFan(concat(matC, matYR2, matYR, matT, matS), i/nElementos);
    }
    
}
function drawFan(mat, t){
    mat = drawFanBase(mat);
    mat = drawFanTop(mat,t);
}
function drawFanTop(mat,t){
    let rot = mat4.create();
    mat4.fromXRotation(rot, Math.PI/2);
    let spin = mat4.create();
    let phase = t * 2*Math.PI;
    let angle = Math.PI*0.5 * Math.sin(phase);
    mat4.fromYRotation(spin, angle);
    mat = concat(mat,rot,spin);
    let scale = mat4.create();
    mat4.fromScaling(scale, [0.4,0.4,0.7]);
    let back = mat4.create();
    mat4.fromTranslation(back, [0,0,-0.5]);
    setUniform("modelViewMatrix", concat(mat,scale,back));
    draw(cilindro);
    return mat;
}
function drawFanBase(mat){
    let rot = mat4.create();
    mat4.fromXRotation(rot, -Math.PI/2);
    let scale = mat4.create();
    mat4.fromScaling(scale, [0.8,0.2,0.8]);
    let scale2 = mat4.create();
    mat4.fromScaling(scale2, [0.8,0.1,0.8]);

    let flip = mat4.create();
    mat4.fromXRotation(flip, Math.PI);
    setUniform("modelViewMatrix", concat(mat,scale,rot));
    draw(cono);
    setUniform("modelViewMatrix", concat(mat,scale2,rot,flip));
    draw(cilindro);

    let down = mat4.create();
    mat4.fromTranslation(down, [0,-0.1,0]);
    setUniform("modelViewMatrix", concat(mat,down,scale,rot,flip));
    draw(tapa);

    let stickScale = mat4.create();
    mat4.fromScaling(stickScale, [0.1,2,0.1]);
    setUniform("modelViewMatrix", concat(mat,stickScale,rot));
    draw(cilindro);
    let up = mat4.create();
    mat4.fromTranslation(up, [0,2,0]);
    return concat(mat,up,rot);
}
function giraZootropo () {
  
  anguloTotal += incrementoAnguloEntreFrames;
  drawScene();
    
}

function drawScene() {
    
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());

  drawZootropo();

}

function initKeyboardHandler () {
  
  var angulo_html = document.getElementById("angulo");

  document.addEventListener("keydown",
  function (event) {
      switch (event.key) {
        case 'w': incrementoAnguloEntreFrames += incrementoAngulo; break;
        case 's': incrementoAnguloEntreFrames -= incrementoAngulo; break;
      }
      angulo_html.innerHTML = (incrementoAnguloEntreFrames * 180 / Math.PI).toFixed(1);
  }, false);
  
}

if (initWebGL()) {
  
  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition");
  initUniformRefs("modelViewMatrix","projectionMatrix");
  
  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  initRendering("DEPTH_TEST","CULL_FACE");

  gl.clearColor(0.15,0.25,0.35,1.0);

  initHandlers();
  initKeyboardHandler();
  
  setInterval (giraZootropo, 40); // cada 40ms se ejecutará giraZootropo
  
}