var unCuadradoVC = {        // estructura de vértices compartidos

	// tipo de primitiva gráfica con el que se ha de dibujar este modelo
	primitiva: WebGLRenderingContext.TRIANGLES,

	"vertices": [            // vector de vértices, atributo de posición
		-0.5, -0.5, 0.0,          // v0
		0.5, -0.5, 0.0,          // v1
		0.5, 0.5, 0.0,          // v2
		-0.5, 0.5, 0.0,
	],         // v3

	"indices": [             // vector de índices
		0, 1, 2,                // t0
		0, 2, 3,
	],                // t1
};

var cubo = {  // 24 vértices, 12 triángulos, 12 aristas

	primitiva: WebGLRenderingContext.TRIANGLE_STRIP,

	"vertices" : [-0.5, -0.5,  0.5,
		0.5, -0.5,  0.5,
		0.5,  0.5,  0.5,
		-0.5,  0.5,  0.5,
		-0.5, -0.5, -0.5,
		0.5, -0.5, -0.5,
		0.5,  0.5, -0.5,
		-0.5,  0.5, -0.5],

	"indices" :  [4,5,0,1,3,1,2,5,6,4,7,0,7,3,6,2]

};

var unCuadradoCI = {          // estructura de caras independientes

	// tipo de primitiva gráfica con el que se ha de dibujar este modelo
	primitiva: WebGLRenderingContext.TRIANGLES,

	"vertices": [            // hay un único vector, atributo de posición
		-0.5, -0.5, 0.0,          // t0 v0
		0.5, -0.5, 0.0,          // t0 v1
		0.5, 0.5, 0.0,          // t0 v2
		-0.5, -0.5, 0.0,          // t1 v0
		0.5, 0.5, 0.0,          // t1 v2
		-0.5, 0.5, 0.0,
	],          // t1 v3

};

var j10VC = {

	primitiva: WebGLRenderingContext.TRIANGLES,

	"vertices": [
		-0.5, -0.7, -0.5,
		0.5, -0.7, -0.5,
		0.0, 0.7, 0.0,
		0.5, -0.7, 0.5,
		-0.5, -0.7, 0.5,

		0.0, 0.0, -0.7,
		0.7, 0.0, 0.0,
		0.0, 0.0, 0.7,
		-0.7, 0.0, 0.0,

	],

	"indices": [
		1, 3, 0,
		0, 3, 4,
		6, 3, 1,
		7, 4, 3,
		8, 0, 4,
		5, 1, 0,
		7, 3, 6,
		8, 4, 7,
		5, 0, 8,
		5, 0, 8,
		5, 6, 1,
		2, 7, 6,
		2, 8, 7,
		2, 5, 8,
		2, 6, 5,
	],

};
// let verts = [
// 	[-0.5, -0.7, -0.5],
// 	[0.5, -0.7, -0.5],
// 	[0.0, 0.7, 0.0],
// 	[0.5, -0.7, 0.5],
// 	[-0.5, -0.7, 0.5],
// 	[0.0, 0.0, -0.7],
// 	[0.7, 0.0, 0.0],
// 	[0.0, 0.0, 0.7],
// 	[-0.7, 0.0, 0.0],
//
// ];
// let indices = [
// 	1, 3, 0,
// 	0, 3, 4,
// 	6, 3, 1,
// 	7, 4, 3,
// 	8, 0, 4,
// 	5, 1, 0,
// 	7, 3, 6,
// 	8, 4, 7,
// 	5, 0, 8,
// 	5, 0, 8,
// 	5, 6, 1,
// 	2, 7, 6,
// 	2, 8, 7,
// 	2, 5, 8,
// 	2, 6, 5,
// ];
//
// let sepIndex = [];
// for (let index of indices) {
// 	sepIndex.push(...verts[index]);
// }
// console.log(sepIndex);
// let formatted = "";
// for (let i = 0; i < sepIndex.length; i += 3) {
// 	formatted += `${sepIndex[i]}, ${sepIndex[i + 1]}, ${sepIndex[i + 2]},\n`;
// }
// console.log(formatted);

var j10CI = {

	primitiva: WebGLRenderingContext.TRIANGLES,

	"vertices": [
		0.5, -0.7, -0.5,
		0.5, -0.7, 0.5,
		-0.5, -0.7, -0.5,
		-0.5, -0.7, -0.5,
		0.5, -0.7, 0.5,
		-0.5, -0.7, 0.5,
		0.7, 0, 0,
		0.5, -0.7, 0.5,
		0.5, -0.7, -0.5,
		0, 0, 0.7,
		-0.5, -0.7, 0.5,
		0.5, -0.7, 0.5,
		-0.7, 0, 0,
		-0.5, -0.7, -0.5,
		-0.5, -0.7, 0.5,
		0, 0, -0.7,
		0.5, -0.7, -0.5,
		-0.5, -0.7, -0.5,
		0, 0, 0.7,
		0.5, -0.7, 0.5,
		0.7, 0, 0,
		-0.7, 0, 0,
		-0.5, -0.7, 0.5,
		0, 0, 0.7,
		0, 0, -0.7,
		-0.5, -0.7, -0.5,
		-0.7, 0, 0,
		0, 0, -0.7,
		-0.5, -0.7, -0.5,
		-0.7, 0, 0,
		0, 0, -0.7,
		0.7, 0, 0,
		0.5, -0.7, -0.5,
		0, 0.7, 0,
		0, 0, 0.7,
		0.7, 0, 0,
		0, 0.7, 0,
		-0.7, 0, 0,
		0, 0, 0.7,
		0, 0.7, 0,
		0, 0, -0.7,
		-0.7, 0, 0,
		0, 0.7, 0,
		0.7, 0, 0,
		0, 0, -0.7,
	],

};

var j10VCstrip = {

	primitiva: WebGLRenderingContext.TRIANGLE_STRIP,

	"vertices": [
		-0.5, -0.7, -0.5,
		0.5, -0.7, -0.5,
		0.0, 0.7, 0.0,
		0.5, -0.7, 0.5,
		-0.5, -0.7, 0.5,

		0.0, 0.0, -0.7,
		0.7, 0.0, 0.0,
		0.0, 0.0, 0.7,
		-0.7, 0.0, 0.0,
	],

	"indices": [0,1,5,6,2,7,3,7,4,7,8,2,8,5,8,0,4,0,3,1,6
	],

};

var j10CIstrip = {

	primitiva: WebGLRenderingContext.TRIANGLE_STRIP,

	"vertices": [],

};