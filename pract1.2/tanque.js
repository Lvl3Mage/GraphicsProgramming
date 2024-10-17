//
// Programa ejemplo para utilizar transformaciones geométricas
//




//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	
	
	var cameraRot = getRotationMatrix();
	for (let i = 0; i < 5; i++){
		drawWheel(cameraRot, [0.4 + i*-0.2,-0.2,-0.3],[0,1,0],0,[0.1,0.1,0.6]);
	}
	drawBase(cameraRot);
	drawDome(cameraRot);
	drawWheel(cameraRot, [0.25,0.1,0],[ -0.2505628, -0.9351131, -0.2505628 ],1.6378338,[0.03,0.03,0.6],[true,false]);
	requestAnimationFrame(drawScene);
}
function drawWheel(camRot, pos = [0,0,0],rotAxis = [0,0,1], rotAngle = 0,scale = [1,1,1], caps = [true,true]){
	let matT = mat4.create();
	mat4.fromTranslation(matT,pos);
	let matR = mat4.create();
	mat4.fromRotation(matR,rotAngle,rotAxis);
	let matS = mat4.create();
	mat4.fromScaling(matS,scale)
	
	let matCap1 = mat4.create();
	mat4.fromTranslation(matCap1,[0,0,1]);
	let matCap2 = mat4.create();
	mat4.fromRotation(matCap2,Math.PI, [0,1,0]);
	
	let wheelMat = concat(camRot,matT,matR,matS);
	
	if (caps[0]){
		setUniform("modelMatrix",concat(wheelMat,matCap1));
		draw(tapa);
		
	}
	if (caps[1]){
		setUniform("modelMatrix",concat(wheelMat,matCap2));
		draw(tapa);
	}
	
	setUniform ("modelMatrix", wheelMat);
	draw(cilindro);
}
function drawDome(cameraRotation){
	let matT = mat4.create();
	mat4.fromTranslation(matT,[0.25,0.1,0]);
	let matS = mat4.create();
	mat4.fromScaling(matS,[0.2,0.2,0.2]);
	setUniform ("modelMatrix", concat(cameraRotation, matT,matS));
	draw(esfera);
	
}

function drawBase(cameraRotation){
	var matS  = mat4.create();

	// Crea una transformación de escalado
	mat4.fromScaling (matS, [1.0, 0.2, 0.6]);

	// Establece como matriz de transformación del modelo: matR * matS
	setUniform ("modelMatrix", concat(cameraRotation, matS));

	// Dibuja la primitiva cubo
	draw(cubo);
}

if (initWebGL()) {

	initShaders("myVertexShader","myFragmentShader");
	initAttributesRefs("VertexPosition");
	initUniformRefs("modelMatrix");

	initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
	initRendering("DEPTH_TEST","CULL_FACE");
	initHandlers();

	requestAnimationFrame(drawScene);

}