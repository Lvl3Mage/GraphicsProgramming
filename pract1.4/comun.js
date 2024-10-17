//
// Funciones que son comunes a los diversos ejemplos con los que vas a trabajar
//
var  gl, program;

// variables para gobernar posición y parámetros de la cámara
var myZeta = 0.0, myPhi = Math.PI/2.0, radius = 4.0, fovy = 1.0;

var uniformIdxs = new Map();
var texturesId = [];

// control del número de atributos por vértice
const POSITION                  = 0;
const POSTION_NORMAL            = 1;
const POSITION_NORMAL_TEXCOORDS = 2;

var attributes = -1;

//
// Obtiene un contexto WebGL 2, devuelve null si no existe
//
function getWebGLContext() {
  
  var canvas = document.getElementById("myCanvas");
  
  try {
    return canvas.getContext("webgl2");
  }
  catch(e) {
  }
  
  return null;
  
}

//
// Compila los shaders de vértices y fragmentos, los enlaza y crea un programa
// También instala el programa ejecutable en la GPU
// Recuerda que los fuentes de los Shaders están en el archivo .html
// 
function initShaders(vertexSh, fragmentSh) {
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById(vertexSh).text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById(fragmentSh).text);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
}

function initAttributesRefs (...attrs) {
  
  for (let attr of attrs) {
    
    var idx = gl.getAttribLocation (program, attr);

    switch (attr) {
      case "VertexPosition" : 
      program.vertexPositionAttribute = idx;
      gl.enableVertexAttribArray (program.vertexPositionAttribute);
      break;
      case "VertexNormal" : 
      program.vertexNormalAttribute = idx;
      gl.enableVertexAttribArray (program.vertexNormalAttribute);
      break;
      case "VertexTexcoords" : 
      program.vertexTexcoordsAttribute = idx;
      gl.enableVertexAttribArray (program.vertexTexcoordsAttribute);
      break;
    }
  }

  attributes = attrs.length - 1;
  
}

//
// Cada modelo que forme parte de tu escena ha de ser alojado 
// en la memoria del sistema gráfico para ser dibujado de manera eficiente
//
function initBuffers(model) {
  
  // crea un buffer de memoria y lo rellena con los datos del vector de vértices
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  
  // el vector de índices solo existe en la estructura de vértices compartidos
  if ('indices' in model) {  
    // crea un buffer de memoria y lo rellena con los datos del vector de índices
    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
  }
  
}

//
// sube a la memoria del sistema gráfico las siguientes primitivas
//
function initPrimitives (...modelos) {
  
  for (let modelo of modelos) initBuffers (modelo);
  
}

//
// Obtiene referencias a las variables uniform de los shaders
// 
function initUniformRefs (...uniforms) {
  
  for (let uniform of uniforms) uniformIdxs.set (uniform, gl.getUniformLocation(program, uniform));
  
}

function concat(...M) {
  
  var result = mat4.create();
  
  for (let m of M) mat4.multiply (result, result, m);
  
  return result;
  
}

function setUniform (name, value) {
  
  var ref = uniformIdxs.get(name);
  
  switch (value.length) {
    case 16: gl.uniformMatrix4fv(ref, false, value); break;
    case  9: gl.uniformMatrix3fv(ref, false, value); break;
    case  4: gl.uniform4fv(ref, value); break;
    case  3: gl.uniform3fv(ref, value); break;
    case  1: gl.uniform1f(ref, value[0]); break;
    case  undefined: gl.uniform1i(ref, value); break;
  }
  
}

//
// Esta función ordena el dibujado del modelo
//
function draw (model) {
  
  var nAttr = (attributes == POSITION ? 3 : (attributes == POSTION_NORMAL ? 6 : 8));
  
  // selecciona el vector de vértices que se ha de utilizar para dibujar el modelo
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  
  switch(attributes) {
    case POSITION_NORMAL_TEXCOORDS: gl.vertexAttribPointer (program.vertexTexcoordsAttribute, 2, gl.FLOAT, false, nAttr*4, 6*4);
    case POSTION_NORMAL: gl.vertexAttribPointer (program.vertexNormalAttribute, 3, gl.FLOAT, false, nAttr*4, 3*4);
    case POSITION: gl.vertexAttribPointer (program.vertexPositionAttribute, 3, gl.FLOAT, false, nAttr*4, 0);
  }
  
  if ('indices' in model) {  // vértices compartidos
    
    // selecciona el vector de índices que se ha de utilizar
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    
    // ordena el dibujado
    gl.drawElements(model.primitiva, model.indices.length, gl.UNSIGNED_SHORT, 0);
    
  } else { // caras independientes
    
    // no hay vector de índices, se ordena directamente el dibujado
    gl.drawArrays (model.primitiva, 0, model.vertices.length / nAttr);
    
  }
  
}

//
// Obtiene la matriz de transformación de la proyección perspectiva
//
function getPerspectiveProjectionMatrix () { return mat4.perspective(mat4.create(), fovy, 1.0, 0.1, 100.0); }

//
// Obtiene y establece la matriz de transformación de la cámara en el shader de vértices
//
function getCameraMatrix() {
  
  // coordenadas esféricas a rectangulares: https://en.wikipedia.org/wiki/Spherical_coordinate_system
  var x = radius * Math.sin(myPhi) * Math.sin(myZeta);
  var y = radius * Math.cos(myPhi);
  var z = radius * Math.sin(myPhi) * Math.cos(myZeta);

  return mat4.lookAt(mat4.create(), [x, y, z], [0, 0, 0], [0, 1, 0]);
  
}

function getRotationMatrix() {

  var matResult = mat4.create();
  var aux = radius;
  
  radius = 0.01;

  // se escala por -1 en Z pq en NDC Opengl es left handed
  matResult = concat (mat4.fromScaling (mat4.create(),[1,1,-1]), getCameraMatrix());

  radius = aux;

  return matResult

}

function getNormalMatrix (M) { return mat3.normalFromMat4(mat3.create(), M);}

//
// Esta función la puedes utilizar para establecer parámetros que no suelen cambiar 
// a lo largo de la ejecución del código
//
function initRendering(...renderOptions) {
  
//  gl.clearColor(0.15,0.25,0.35,1.0);  // establece el color de fondo del canvas en RGBA
  gl.clearColor(1,1,1,1.0);  // establece el color de fondo del canvas en RGBA
  gl.cullFace  (gl.BACK);             // elimina las caras traseras, valor por defecto
  gl.frontFace (gl.CCW);              // el orden de los vértices es en antihorario, valor por defecto 

  for (let option of renderOptions) {
    switch (option) {
      case "CULL_FACE":  gl.enable (gl.CULL_FACE);  break;
      case "DEPTH_TEST": gl.enable (gl.DEPTH_TEST); break;
    }
  }
  
}

function setTexture (image, texturePos) {
  
  // se indica el objeto textura
  gl.bindTexture(gl.TEXTURE_2D, texturesId[texturePos]);
  
  // Descomentar si es necesario voltear la textura
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  // datos de la textura
  gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  // parámetros de filtrado
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // parámetros de repetición (ccordenadas de textura mayores a uno)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  
  // creación del mipmap
  gl.generateMipmap(gl.TEXTURE_2D);
  
  texturesId[texturePos].loaded = true; // textura ya disponible
  
  requestAnimationFrame(drawScene);
  
}

function loadTextureFromServer (filename, texturePos) {
  
  var image = new Image();
  
  image.addEventListener("load",
  function() {
    setTexture(image, texturePos);
  },
  false);
  image.addEventListener("error",
  function(err) {
    console.log("MALA SUERTE: no esta disponible " + this.src);
  },
  false);
  image.crossOrigin = 'anonymous'; // Esto evita que Chrome se queje de SecurityError al cargar la imagen de otro dominio
  image.src         = filename;
  
}

function initTextures(...filenames) {
  
  var serverUrl    = "http://cphoto.uji.es/vj1221/assets/textures/";
  
  var texturePos = 0;
  
  for (let name of filenames) {
    
    // creo el objeto textura
    texturesId[texturePos] = gl.createTexture();
    texturesId[texturePos].loaded = false;
    
    // solicito la carga de la textura
    loadTextureFromServer(serverUrl + name, texturePos);
    texturePos++;
    
  }
  
}

function initHandlers() {
  
  var mouseDown = false;
  var lastMouseX;
  var lastMouseY;
  
  var canvas = document.getElementById("myCanvas");
  
  canvas.addEventListener("mousedown", function(event) {
    mouseDown  = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }, false);
  
  canvas.addEventListener("mouseup", function() {
    mouseDown = false;
  }, false);
  
  canvas.addEventListener("wheel", function (event) {
    
    var delta = 0.0;
    
    if (event.deltaMode == 0)
    delta = event.deltaY * 0.001;
    else if (event.deltaMode == 1)
    delta = event.deltaY * 0.03;
    else
    delta = event.deltaY;
    
    if (event.shiftKey == 1) { // fovy
      
      fovy *= Math.exp(delta)
      fovy = Math.max (0.1, Math.min(3.0, fovy));
      
    } else {
      
      radius *= Math.exp(delta);
      radius  = Math.max(Math.min(radius, 30), 0.05);
      
    }
    
    event.preventDefault();
    requestAnimationFrame(drawScene);
    
  }, false);
  
  canvas.addEventListener("mousemove", function (event) {
    
    if (!mouseDown) {
      return;
    }
    
    var newX = event.clientX;
    var newY = event.clientY;
    
    myZeta -= (newX - lastMouseX) * 0.005;
    myPhi  -= (newY - lastMouseY) * 0.005;
    
    var margen = 0.01;
    myPhi = Math.min (Math.max(myPhi, margen), Math.PI - margen);
    
    lastMouseX = newX
    lastMouseY = newY;
    
    event.preventDefault();
    requestAnimationFrame(drawScene);
    
  }, false);
  
  var botones = document.getElementsByTagName("button");
  
  for (var i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click",
    function(){
      switch (this.innerHTML) {
        case "Plano":    modeloSeleccionado = plano;    break;
        case "Cubo":     modeloSeleccionado = cubo;     break;
        case "Tapa":     modeloSeleccionado = tapa;     break;
        case "Cono":     modeloSeleccionado = cono;     break;
        case "Cilindro": modeloSeleccionado = cilindro; break;
        case "Esfera":   modeloSeleccionado = esfera;   break;
      }
      requestAnimationFrame(drawScene);
    }, false);
  }
  
  var menuTexturas = document.getElementById("textures");

  if (menuTexturas != null) {
    menuTexturas.addEventListener("change", 
    function() {
      switch (this.value) {
        case "Puntos": texturaSeleccionada = 0; break;
        case "Abeja":  texturaSeleccionada = 1; break;
        case "Figura": texturaSeleccionada = 2; break;
      } 
      requestAnimationFrame(drawScene);
    }, false);
    
  }

}
  
//
// Trata de obtener un contexto para WebGL 2
//
function initWebGL() {
    
  gl = getWebGLContext();
   
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return false;
  }
    
  return true;
    
}