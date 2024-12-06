var nElementos = 35;
var incrementoAnguloEntreFrames = 0, anguloTotal = 0;
var anguloEntreDosElementos = 2 * Math.PI / nElementos;
var incrementoAngulo = anguloEntreDosElementos / 10;
let fanRotations = 10;
let bladeAmount = 5;
let bodySize = 0.5;
let fanHeight = 2;

let orthoMode = false;

function drawZootropo() {
	var matYR = mat4.create();
	var matYR2 = mat4.create();
	var matS = mat4.create();
	var matT = mat4.create();
	var matC = getCameraMatrix();

	mat4.fromScaling(matS, [0.1, 0.1, 0.1]);
	mat4.fromTranslation(matT, [1, 0, 0]);
	mat4.fromYRotation(matYR2, anguloTotal);
	for (var i = 0; i < nElementos; i++) {
		mat4.fromYRotation(matYR, anguloEntreDosElementos * i);
		let t = i / nElementos;
		fanHeight = 2 + Math.sin(t * 2 * Math.PI) * 0.5;
		drawFan(concat(matC, matYR2, matYR, matT, matS), t);
	}

}

function drawFan(mat, t) {

	mat = drawFanBase(mat);
	mat = drawFanTop(mat, t);
	drawRotor(mat, t);
}
function switchToTexture(textureId, uniformName) {
	setUniform(uniformName, 3);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, texturesId[textureId]);
}

function drawFanTop(mat, t) {
	let rot = mat4.create();
	mat4.fromXRotation(rot, Math.PI / 2);
	let spin = mat4.create();
	let phase = t * 2 * Math.PI;
	let angle = Math.PI * 0.5 * Math.sin(phase);


	mat4.fromYRotation(spin, angle);
	mat = concat(mat, rot, spin);

	let bodyScale = mat4.create();
	mat4.fromScaling(bodyScale, [bodySize, bodySize, 0.3]);

	let frontTranslation = mat4.create();
	mat4.fromTranslation(frontTranslation, [0, 0, -0.2]);

	drawModel(cilindro,concat(mat, frontTranslation, bodyScale));

	let frontCover = mat4.create();
	mat4.fromTranslation(frontCover, [0, 0, 1]);

	let frontScale = mat4.create();
	mat4.fromScaling(frontScale, [bodySize, bodySize, 0.1]);

	drawModel(esfera,concat(mat, frontTranslation, frontScale));

	let backTranslation = mat4.create();
	mat4.fromTranslation(backTranslation, [0, 0, 0.1]);

	drawModel(tapa,concat(mat, backTranslation, frontScale));

	mat = concat(mat, frontTranslation);

	return mat;
}

function drawRotor(mat, t) {
	let rotation = t * 2 * Math.PI * fanRotations;
	let rot = mat4.create();
	mat4.fromZRotation(rot, rotation);
	mat = concat(mat, rot);
	let rotorScale = mat4.create();
	mat4.fromScaling(rotorScale, [0.1, 0.1, 0.2]);
	let flip = mat4.create();
	mat4.fromXRotation(flip, Math.PI);
	drawModel(cilindro,concat(mat, rotorScale, flip));
	let rotorCover = mat4.create();
	mat4.fromTranslation(rotorCover, [0, 0, -0.2]);
	mat = concat(mat, rotorCover);
	drawModel(tapa, concat(mat, rotorScale, flip));
	drawBlades(mat, bladeAmount);
}

function drawBlades(mat, amount) {

	let bladeScale = mat4.create();
	mat4.fromScaling(bladeScale, [0.1, 1, 0.1]);

	let bladeOffset = mat4.create();
	mat4.fromTranslation(bladeOffset, [0, 0.05, 0]);

	let bladeRotation = mat4.create();
	let bladeAngle = Math.PI * 2 / amount;
	for (let i = 0; i < amount; i++) {
		mat4.fromZRotation(bladeRotation, bladeAngle * i);
		drawModel(rotorBlade,concat(mat, bladeRotation, bladeOffset, bladeScale));
		drawModel(rotorBladeInverse,concat(mat, bladeRotation, bladeOffset, bladeScale));
	}


}

function drawFanBase(mat) {
	let rot = mat4.create();
	mat4.fromXRotation(rot, -Math.PI / 2);
	let scale = mat4.create();
	mat4.fromScaling(scale, [0.8, 0.2, 0.8]);
	let scale2 = mat4.create();
	mat4.fromScaling(scale2, [0.8, 0.1, 0.8]);

	let flip = mat4.create();
	mat4.fromXRotation(flip, Math.PI);
	drawModel(cono,concat(mat, scale, rot))
	drawModel(cilindro,concat(mat, scale2, rot, flip));

	let down = mat4.create();
	mat4.fromTranslation(down, [0, -0.1, 0]);
	drawModel(tapa,concat(mat, down, scale, rot, flip));

	let stickScale = mat4.create();
	mat4.fromScaling(stickScale, [0.1, fanHeight, 0.1]);
	drawModel(cilindro,concat(mat, stickScale, rot));
	let up = mat4.create();
	mat4.fromTranslation(up, [0, fanHeight, 0]);
	return concat(mat, up, rot);
}
function drawModel(model,mat){
	setUniform("modelViewMatrix",mat);
	setUniform("normalMatrix", getNormalMatrix(mat));
	draw(model);
}
function giraZootropo() {

	anguloTotal += incrementoAnguloEntreFrames;
	drawScene();

}

function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (orthoMode) {
		var x = radius * Math.sin(myPhi) * Math.sin(myZeta);
		var y = radius * Math.cos(myPhi);
		var z = radius * Math.sin(myPhi) * Math.cos(myZeta);
		setUniform("projectionMatrix", getOrthoProjectionMatrix(vec3.len(vec3.fromValues(x, y, z))));
	}
	else {
	    setUniform("projectionMatrix", getPerspectiveProjectionMatrix());

	}
	setMaterial(Glow);
	let light = getLightMatrix();
	let cameraMatrix = getCameraMatrix();
	drawModel(cono,concat(cameraMatrix,light, mat4.fromScaling(mat4.create(),[0.1,-0.1,0.1])))
	drawModel(cono,concat(cameraMatrix,light, mat4.fromScaling(mat4.create(),[0.1,0.1,0.1])))
	setMaterial(Tin);
	updateLight();
	switchToTexture(0,"albedoTexture");
	drawZootropo();

}

function initKeyboardHandler() {

	var angulo_html = document.getElementById("angulo");

	document.addEventListener("keydown",
		function (event) {
			switch (event.key) {
				case "w":
					incrementoAnguloEntreFrames += incrementoAngulo;
					break;
				case "s":
					incrementoAnguloEntreFrames -= incrementoAngulo;
					break;
                case " ":
                    orthoMode = !orthoMode;
                    break;
			}
			angulo_html.innerHTML = (incrementoAnguloEntreFrames * 180 / Math.PI).toFixed(1);
		}, false,
	);

}
function getLightMatrix() {
	return concat(
		mat4.fromYRotation(mat4.create(),Math.PI/4*performance.now()*0.001),
		mat4.fromXRotation(mat4.create(),-Math.PI/6),
		mat4.fromTranslation(mat4.create(),[0,0,1.5])
	);

}
function updateLight () {
	//local positions
	let lightCenter = vec3.fromValues(0,0,0);
	let lightTarget = vec3.fromValues(0,0,1);
	let lightMVM = getLightMatrix();
	//transform light positions to world using light matrix
	let worldCenter = vec3.create();
	let worldTarget = vec3.create();
	vec3.transformMat4(worldCenter, lightCenter, lightMVM);
	vec3.transformMat4(worldTarget, lightTarget, lightMVM);


	//Transforming the positions to eye space
	let EyeSpaceLightDir = vec3.create();
	let cameraMatrix = getCameraMatrix();
	let EyeSpaceLightCenter = vec3.create();
	let EyeSpaceLightTarget = vec3.create();
	vec3.transformMat4(EyeSpaceLightCenter, worldCenter, cameraMatrix);
	vec3.transformMat4(EyeSpaceLightTarget, worldTarget, cameraMatrix);

	//final direction calculation
	vec3.sub(EyeSpaceLightDir,EyeSpaceLightTarget,EyeSpaceLightCenter);

	setUniform("Light.La", [1.0, 1.0, 1.0]);
	setUniform("Light.Ld", [1.0, 1.0, 1.0]);
	setUniform("Light.Ls", [1.0, 1.0, 1.0]);
	setUniform("Light.Lp", EyeSpaceLightTarget);
	setUniform("Light.lightDir", EyeSpaceLightDir);
	setUniform("Light.lightSpotSize", [0.05]);

}
function setMaterial (M) {

	setUniform ("Material.Ka",        M.ambient);
	setUniform ("Material.Kd",        M.diffuse);
	setUniform ("Material.Ks",        M.specular);
	setUniform ("Material.shininess", M.shininess);

}

if (initWebGL()) {

	initShaders("myVertexShader", "myFragmentShader");
	initAttributesRefs("VertexPosition", "VertexNormal","VertexTexcoords");
	initUniformRefs("modelViewMatrix", "normalMatrix","projectionMatrix",
		"Material.Ka","Material.Kd","Material.Ks","Material.shininess",
		"Light.La","Light.Ld","Light.Ls","Light.Lp","Light.lightDir", "Light.lightSpotSize","albedoTexture");

	initPrimitives(plano, cubo, tapa, cono, cilindro, esfera, rotorBlade,rotorBladeInverse);
	initTextures("geom.png");
	initRendering("DEPTH_TEST", "CULL_FACE");

	gl.clearColor(0.15, 0.25, 0.35, 1.0);

	initHandlers();
	initKeyboardHandler();

	setInterval(giraZootropo, 40); // cada 40ms se ejecutará giraZootropo

}