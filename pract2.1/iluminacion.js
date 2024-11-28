/// <reference path="./gl-matrix-min.js />

//
// Primer ejemplo de Iluminación con el modelo de Phong
//q

var alfa = beta = 0.0;
function initKeyboardHandler () {
  document.addEventListener("keydown",
      function (event) {
        switch (event.key) {
          case `a`: alfa += 0.03; if (alfa > 1.05) alfa = 1.05; break;
          case `A`: alfa -= 0.03; if (alfa < -1.05) alfa = -1.05; break;
          case `d`: beta += 0.05; break;
          case `D`: beta -= 0.05; break;
        }
        requestAnimationFrame(drawScene);
      }, false);
}



var modeloSeleccionado = cono;

//
// Establece las propiedades de material según establece el modelo de ilumnación de Phong
//
function setMaterial (M) {
  
  setUniform ("Material.Ka",        M.ambient);
  setUniform ("Material.Kd",        M.diffuse);
  setUniform ("Material.Ks",        M.specular);
  setUniform ("Material.shininess", M.shininess);
  
}

//
// Establece las propiedades de la fuente de luz según establece el modelo de ilumnación de Phong
//
function updateLight () {
  let lightMVM = getLightMatrix();
  let lightCenter = vec3.fromValues(0,0,0);
  let lightTarget = vec3.fromValues(0,0,-1);


  let worldCenter = vec3.create();
  let worldTarget = vec3.create();
  vec3.transformMat4(worldCenter, lightCenter, lightMVM);
  vec3.transformMat4(worldTarget, lightTarget, lightMVM);


  let EyeSpaceLightDir = vec3.create();
  let cameraMatrix = getCameraMatrix();
  let EyeSpaceLightCenter = vec3.create();
  let EyeSpaceLightTarget = vec3.create();
  vec3.transformMat4(EyeSpaceLightCenter, worldCenter, cameraMatrix);
  vec3.transformMat4(EyeSpaceLightTarget, worldTarget, cameraMatrix);
  vec3.sub(EyeSpaceLightDir,EyeSpaceLightTarget,EyeSpaceLightCenter);


  setUniform("Light.La", [1.0, 1.0, 1.0]);
  setUniform("Light.Ld", [1.0, 1.0, 1.0]);
  setUniform("Light.Ls", [1.0, 1.0, 1.0]);
  setUniform("Light.Lp", EyeSpaceLightTarget);
  setUniform("Light.lightDir", EyeSpaceLightDir);
  setUniform("Light.lightSpotSize", [0.4, 0.4, 0.4]);
  
}
function getLightMatrix(){
  let accumulativeMatrix = mat4.create();
  mat4.fromRotation(accumulativeMatrix,-Math.PI*0.5,[1,0,0]);

  let betaMat = mat4.create();
  mat4.fromRotation(betaMat,beta, [0,0,1]);
  accumulativeMatrix = concat(accumulativeMatrix,betaMat);

  let baseConeScale = mat4.create();
  mat4.fromScaling(baseConeScale,[1,1,0.5]);

  let coneEndMat = mat4.create();
  mat4.fromTranslation(coneEndMat,[0,0.5,0]);
  accumulativeMatrix = concat(coneEndMat,accumulativeMatrix);

  let alphaRot = mat4.create();
  mat4.fromRotation(alphaRot,alfa, [0,1,0]);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot);

  let alphaRot2 = mat4.create();
  mat4.fromRotation(alphaRot2,-alfa*2, [0,1,0]);

  let cylScale = mat4.create();
  mat4.fromScaling(cylScale,[0.2,0.2,3]);

  let sphereScale = mat4.create();
  mat4.fromScaling(sphereScale,[0.2,0.2,0.2]);

  let cylTMat = mat4.create();
  mat4.fromTranslation(cylTMat, [0,0,3]);
  accumulativeMatrix = concat(accumulativeMatrix,cylTMat);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot2);
  accumulativeMatrix = concat(accumulativeMatrix,cylTMat);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot2);

  let coneTranslate = mat4.create();
  mat4.fromTranslation(coneTranslate,[0,0,-1]);
  let coneRotate = mat4.create();
  mat4.fromRotation(coneRotate,Math.PI,[0,1,0]);

  return concat(accumulativeMatrix,coneRotate,coneTranslate);

}
function drawLamp () {

  var cameraMatrix = getCameraMatrix();

  setMaterial (Polished_bronze);

  //Drawing the base plane
  let baseScale = mat4.create();
  drawPlane(cameraMatrix,baseScale);


  //inverted so it is visible from below (optional but I like it)
  mat4.fromScaling(baseScale,[15,15,-15]);
  drawPlane(cameraMatrix,baseScale);

  //This matrix will progressively accumulate the transforms done to the primitives
  //You can kind of think of this as a "turtle" that is moving with every transformation and helps us draw everything in a connected way
  //The accumulative matrix does not include scaling so that our model does not get progressively distorted
  let accumulativeMatrix = mat4.create();
  mat4.fromRotation(accumulativeMatrix,-Math.PI*0.5,[1,0,0]);//rotate cone up

  //beta rotation
  let betaMat = mat4.create();
  mat4.fromRotation(betaMat,beta, [0,0,1]);
  accumulativeMatrix = concat(accumulativeMatrix,betaMat);

  let baseConeScale = mat4.create();
  mat4.fromScaling(baseConeScale,[1,1,0.5]);



  setMaterial (Gold);
  //Base cone
  drawCone(cameraMatrix,concat(accumulativeMatrix,baseConeScale));


  //moving the accumulativeMatrix to the end of the base cone
  let coneEndMat = mat4.create();
  mat4.fromTranslation(coneEndMat,[0,0.5,0]);
  accumulativeMatrix = concat(coneEndMat,accumulativeMatrix);

  //First cylinder rotation
  let alphaRot = mat4.create();
  mat4.fromRotation(alphaRot,alfa, [0,1,0]);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot);

  let alphaRot2 = mat4.create();
  mat4.fromRotation(alphaRot2,-alfa*2, [0,1,0]);


  //the scale of all the cylinders
  let cylScale = mat4.create();
  mat4.fromScaling(cylScale,[0.2,0.2,3]);


  //the scale of all the spheres
  let sphereScale = mat4.create();
  mat4.fromScaling(sphereScale,[0.2,0.2,0.2]);


  setMaterial (Esmerald);
  //First cylinder with its sphere
  drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));

  setMaterial (Turquoise);
  drawCylinder(cameraMatrix,concat(accumulativeMatrix,cylScale));

  //moving the accumulative matrix to the first cylinder end
  let cylTMat = mat4.create();
  mat4.fromTranslation(cylTMat, [0,0,3]);
  accumulativeMatrix = concat(accumulativeMatrix,cylTMat);


  //second cylinder rotation
  //let alphaRot2 = mat4.create();
  //mat4.fromRotation(alphaRot2,Math.sin(performance.now()*0.001), [0,1,0]);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot2);

  setMaterial (Esmerald);
  //drawing the second cylinder with its sphere
  drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));

  setMaterial (Turquoise);
  drawCylinder(cameraMatrix,concat(accumulativeMatrix,cylScale));

  //moving the accumulative matrix up the second cylinder (the same "cylTMat" matrix can be used for this since all the cylinders are the same length)
  accumulativeMatrix = concat(accumulativeMatrix,cylTMat);

  setMaterial (Esmerald);
  drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));

  //top cone rotation
  //let alphaRot3 = mat4.create();
  //mat4.fromRotation(alphaRot3,Math.sin(performance.now()*0.001), [0,1,0]);
  accumulativeMatrix = concat(accumulativeMatrix,alphaRot2);

  //for positioning the top cone correctly since it is inverted by default
  let coneTranslate = mat4.create();
  mat4.fromTranslation(coneTranslate,[0,0,-1]);
  let coneRotate = mat4.create();
  mat4.fromRotation(coneRotate,Math.PI,[0,1,0]);


  //For cone to be visible from inside
  let coneInv = mat4.create();
  mat4.fromScaling(coneInv,[1,-1,1]);


  setMaterial (Ruby);
  //Drawing top cone
  drawCone(cameraMatrix,concat(accumulativeMatrix,coneRotate,coneTranslate));
  drawCone(cameraMatrix,concat(accumulativeMatrix,coneRotate,coneTranslate,coneInv));

  return concat(accumulativeMatrix,coneRotate,coneTranslate);


}
function drawModel(camMat,mat,model) {
  setUniform("modelViewMatrix", concat(camMat, mat));
  setUniform ("normalMatrix", getNormalMatrix(concat(camMat, mat)));
  draw(model);
}
function drawCylinder(camMat, mat){
  drawModel(camMat, mat, cilindro);
}
function drawSphere(camMat,mat){
  drawModel(camMat, mat, esfera);

}
function drawCone(camMat,mat){
  drawModel(camMat, mat, cono);
}
function drawPlane(camMat,mat){
  drawModel(camMat, mat, plano);

}

//
// Dibujado de la escena
//
function drawScene() {

  // Esta parte NO cambia por el hecho de haber añadido iluminación
  var matS = mat4.create();
  var modelViewMatrix = mat4.create();
  var cameraMatrix = getCameraMatrix();
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());
  
  mat4.fromScaling (matS, [0.5, 0.5, 0.5]);
  modelViewMatrix = concat (cameraMatrix, matS);
  setUniform ("modelViewMatrix", modelViewMatrix);
  
  // Esta es la parte que SI que cambia ...
  setUniform ("normalMatrix", getNormalMatrix(modelViewMatrix)); // NUEVO
                                              // NUEVO

  updateLight();
  drawLamp();
  
}

if (initWebGL()) {
  initKeyboardHandler();
  initShaders("myVertexShader","myFragmentShader");
  
  initAttributesRefs("VertexPosition",
                     "VertexNormal");                            // NUEVO
  
  initUniformRefs("modelViewMatrix","projectionMatrix",
  "normalMatrix",                                                // NUEVO
  "Material.Ka","Material.Kd","Material.Ks","Material.shininess",// NUEVO
  "Light.La","Light.Ld","Light.Ls","Light.Lp", "Light.lightDir", "Light.lightSpotSize");                  // NUEVO
  
  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  
  initRendering("DEPTH_TEST");
  initHandlers();

  drawScene();// NUEVO

  
}