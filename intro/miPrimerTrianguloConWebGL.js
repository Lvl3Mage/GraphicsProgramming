var gl = null;
var program;

var exampleTriangle = {

  "vertices" : [-1, -1, 0.0,
                1, -1, 0.0,
                1, 1, 0.0,
                -1, 1, 0.0],

  "indices" : [ 0, 1, 2, 0, 3, 2 ]

};

function getWebGLContext() {

  var canvas = document.getElementById("myCanvas");

  try {
    /**
     * @type {WebGL2RenderingContext}
     */
    return canvas.getContext("webgl2");
  }
  catch(e) {
  }

  return null;

}

function initShaders() {

  // paso 1
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById('myVertexShader').text);
  gl.compileShader(vertexShader);
  
  var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    console.error( "could not compile shader:" + gl.getShaderInfoLog(vertexShader));
  }

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById('myFragmentShader').text);
  gl.compileShader(fragmentShader);
  var success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    console.error( "could not compile shader:" + gl.getShaderInfoLog(fragmentShader));
  }
  
  // paso 2
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // paso 3
  gl.linkProgram(program);
  gl.useProgram(program);
  

  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

}

function initRendering() {

  gl.clearColor(0.0,0.0,1.0,1.0);

}
  
function initBuffers(model) {

  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

  model.idBufferIndices = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

}

function draw(model) {

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  
}

function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(exampleTriangle);

}

function initWebGL() {
      
  gl = getWebGLContext();
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }

  initShaders();
  initBuffers(exampleTriangle);
  initRendering();
  startTime = performance.now();
  update();
  

}
let mousePosition = [0.5,0.5];
document.onmousemove = function(e) {
    mousePosition = [e.clientX, e.clientY];
};
let startTime;
function update(){
  
  let mouseAttrib = gl.getUniformLocation(program, "iMouse");
  let canvas = document.getElementById("myCanvas");
  let localMousePosition = [(mousePosition[0] - canvas.offsetLeft) / canvas.clientWidth, (mousePosition[1] - canvas.offsetTop)/canvas.clientHeight];
  localMousePosition[0] = Math.min(1, Math.max(0, localMousePosition[0]));
  localMousePosition[1] = Math.min(1, Math.max(0, localMousePosition[1]));
  gl.uniform4f(mouseAttrib, localMousePosition[0], 1-localMousePosition[1],0,0);
  let timeAttrib = gl.getUniformLocation(program, "iTime");
  let currentTime = performance.now() - startTime;
  gl.uniform1f(timeAttrib, currentTime/1000);
  drawScene();
  requestAnimationFrame(update);
}

initWebGL();     
