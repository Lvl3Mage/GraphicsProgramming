//
// Programa ejemplo para utilizar una cámara interactiva
//


function drawGlobo () {

	// obtiene la matriz de transformación de la cámara
	var cameraMatrix = getCameraMatrix();



	drawCylinder(cameraMatrix, [0,0.25+0.0625,-0.3], mat4.create(), [0.0625,0.0625,1]);
	
	let cylMatR = mat4.create();
	
	mat4.fromQuat(cylMatR,[ -0.551937, 0, 0, 0.8338858 ]);
	let otherCyl = drawCylinder(cameraMatrix, [0,0.25+0.0625,-0.3], cylMatR, [0.0625,0.0625,3], [false,true]);
	drawBigSphere(cameraMatrix,otherCyl,cylMatR);
	
	drawBase(cameraMatrix);

}
function drawBigSphere(camMat, cylMat, cylRotMat){
	let spherePos = vec3.fromValues(0,0,0.5);
	let worldSpherePos = vec3.create();
	vec3.transformMat4(worldSpherePos,spherePos,cylMat);
	let matT = mat4.create();
	mat4.fromTranslation(matT,worldSpherePos);
	let matS = mat4.create();
	mat4.fromScaling(matS,[1.2,1.2,1.2]);
	setUniform("modelViewMatrix", concat(camMat, matT,cylRotMat,matS));
	draw(esfera);
}
function drawCylinder(camMat, pos, rotMat, scale, caps = [true,true]){
	var matT = mat4.create();
	var matS = mat4.create();
	
	mat4.fromTranslation(matT, pos);
	mat4.fromScaling(matS, scale);
	let cylinderMat = concat(matT, rotMat,matS);
	setUniform("modelViewMatrix", concat(camMat, cylinderMat));
	draw(cilindro);
	if (caps[0]){
		let locPosCap1 = vec3.fromValues(0,0,0);
		let worldPosCap1 = vec3.create();
		vec3.transformMat4(worldPosCap1, locPosCap1, cylinderMat);
		let MCapT = mat4.create();
		mat4.fromTranslation(MCapT,worldPosCap1);
		let MCapS = mat4.create();
		mat4.fromScaling(MCapS,[scale[0],scale[1], Math.min(scale[0],scale[1])]);
		setUniform("modelViewMatrix", concat(camMat, MCapT,MCapS));
		draw(esfera);
	}
	if (caps[1]){
		let locPosCap1 = vec3.fromValues(0,0,1);
		let worldPosCap1 = vec3.create();
		vec3.transformMat4(worldPosCap1, locPosCap1, cylinderMat);
		let MCapT = mat4.create();
		let MCapS = mat4.create();
		mat4.fromScaling(MCapS,[scale[0],scale[1], Math.min(scale[0],scale[1])]);
		mat4.fromTranslation(MCapT,worldPosCap1);
		setUniform("modelViewMatrix", concat(camMat, MCapT,MCapS));
		draw(esfera);
	}
	return cylinderMat;
	
	
}
function drawBase(camMat){
	// calcula la matriz de transformación del modelo
	var matS  = mat4.create();
	var matRx = mat4.create();

	// dibujo la base
	mat4.fromScaling   (matS, [1, 1, 0.25]);
	mat4.fromXRotation (matRx, -Math.PI/2);
	setUniform ("modelViewMatrix", concat (camMat, matRx, matS));
	draw(cono);
}


//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	// establece la matriz de transformación de la proyección
	setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());

	drawGlobo ();

}

if (initWebGL()) {

	initShaders("myVertexShader","myFragmentShader");
	initAttributesRefs("VertexPosition");
	initUniformRefs("modelViewMatrix","projectionMatrix");

	initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
	initRendering("DEPTH_TEST","CULL_FACE");
	initHandlers();

	requestAnimationFrame(drawScene);

}