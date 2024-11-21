
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

function drawLamp () {

	var cameraMatrix = getCameraMatrix();

	//Drawing the base plane
	let baseScale = mat4.create();
	mat4.fromScaling(baseScale,[3,3,3]);
	drawPlane(cameraMatrix,baseScale);

	//inverted so it is visible from below (optional but I like it)
	mat4.fromScaling(baseScale,[3,3,-3]);
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


	//the scale of all the cylinders
	let cylScale = mat4.create();
	mat4.fromScaling(cylScale,[0.2,0.2,3]);


	//the scale of all the spheres
	let sphereScale = mat4.create();
	mat4.fromScaling(sphereScale,[0.2,0.2,0.2]);


	//First cylinder with its sphere
	drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));
	drawCylinder(cameraMatrix,concat(accumulativeMatrix,cylScale));

	//moving the accumulative matrix to the first cylinder end
	let cylTMat = mat4.create();
	mat4.fromTranslation(cylTMat, [0,0,3]);
	accumulativeMatrix = concat(accumulativeMatrix,cylTMat);


	//second cylinder rotation
	//let alphaRot2 = mat4.create();
	//mat4.fromRotation(alphaRot2,Math.sin(performance.now()*0.001), [0,1,0]);
	accumulativeMatrix = concat(accumulativeMatrix,alphaRot);

	//drawing the second cylinder with its sphere
	drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));
	drawCylinder(cameraMatrix,concat(accumulativeMatrix,cylScale));

	//moving the accumulative matrix up the second cylinder (the same "cylTMat" matrix can be used for this since all the cylinders are the same length)
	accumulativeMatrix = concat(accumulativeMatrix,cylTMat);
	drawSphere(cameraMatrix,concat(accumulativeMatrix,sphereScale));

	//top cone rotation
	//let alphaRot3 = mat4.create();
	//mat4.fromRotation(alphaRot3,Math.sin(performance.now()*0.001), [0,1,0]);
	accumulativeMatrix = concat(accumulativeMatrix,alphaRot);

	//for positioning the top cone correctly since it is inverted by default
	let coneTranslate = mat4.create();
	mat4.fromTranslation(coneTranslate,[0,0,-1]);
	let coneRotate = mat4.create();
	mat4.fromRotation(coneRotate,Math.PI,[0,1,0]);


	//For cone to be visible from inside
	let coneInv = mat4.create();
	mat4.fromScaling(coneInv,[1,-1,1]);

	//Drawing top cone
	drawCone(cameraMatrix,concat(accumulativeMatrix,coneRotate,coneTranslate));
	drawCone(cameraMatrix,concat(accumulativeMatrix,coneRotate,coneTranslate,coneInv));



}
function drawCylinder(camMat, mat, caps = [true,true]){
	setUniform("modelViewMatrix", concat(camMat, mat));
	draw(cilindro);
}
function drawSphere(camMat,mat){
	setUniform("modelViewMatrix", concat(camMat, mat));
	draw(esfera);

}
function drawCone(camMat,mat){
	setUniform("modelViewMatrix", concat(camMat, mat));
	draw(cono);
}
function drawPlane(camMat,mat){
	setUniform("modelViewMatrix", concat(camMat, mat));
	draw(plano);

}

//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	// establece la matriz de transformación de la proyección
	setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());

	drawLamp ();

	//for continuous update
	//requestAnimationFrame(drawScene);

}

if (initWebGL()) {
	initShaders("myVertexShader","myFragmentShader");
	initAttributesRefs("VertexPosition");
	initUniformRefs("modelViewMatrix","projectionMatrix");

	initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
	initRendering("DEPTH_TEST","CULL_FACE");
	initHandlers();

	initKeyboardHandler();

	drawScene();

}