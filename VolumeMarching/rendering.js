/**
 * @typedef Renderer
 * @prop {WebGL2RenderingContext} gl - The rendering context of the renderer
 * @prop {WebGLProgram} program - The program of the renderer
 * @prop {HTMLElement} canvas - The canvas the renderer is bound to
 * @methos BindModel - Binds a new model to the renderer
 * @methos Draw - draws the renderer
 */

/**
 *
 * @param canvas The canvas to initialize the renderer for
 * @param vertexSource - The source of the vertex shader
 * @param fragmentSource - The source of the fragment shader
 * @returns {Promise<Renderer>}
 */
async function InitRenderer(canvas, vertexSource, fragmentSource) {
	const gl = GetWebGLContext(canvas);
	if (!gl) {
		alert("WebGL 2.0 is not available");
		return null;
	}

	gl.clearColor(1.0, 0.0, 1.0, 1.0);


	const vertexShader = CompileShader(gl, vertexSource, gl.VERTEX_SHADER);
	const fragmentShader = CompileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);


	const program = CreateProgram(gl, [vertexShader, fragmentShader]);


	const vertexAttrib = gl.getAttribLocation(program, "VertexPosition");


	let vertexBuffer;
	let triangleBuffer;
	gl.enableVertexAttribArray(vertexAttrib);

	let triangleLength;
	return {
		gl:gl,
		program:program,
		canvas:canvas,
		/**
		 * 
		 * @param {number[]} vertices - The array of vertices to draw
		 * @param {number[]} indices - The array of indices to draw
		 */
		BindModel(vertices, indices) {

			const vertexData = new Float32Array(vertices);
			vertexBuffer = InitBuffer(gl,vertexData, gl.ARRAY_BUFFER);
			const triangleData = new Uint16Array(indices);
			triangleBuffer = InitBuffer(gl,triangleData, gl.ELEMENT_ARRAY_BUFFER);
			triangleLength = indices.length;
		},
		Draw() {
			DrawBuffers(gl, vertexBuffer, vertexAttrib, triangleBuffer, triangleLength);
		},
	};
}


function GetWebGLContext(canvas) {

	try {
		/**
		 * @type {WebGL2RenderingContext}
		 */
		return canvas.getContext("webgl2");
	} catch (e) {
	}

	return null;

}

function CreateProgram(gl, shaders = []) {
	let pg = gl.createProgram();
	shaders.forEach(shader => {
		console.log(shader);
		gl.attachShader(pg, shader);
	});

	gl.linkProgram(pg);
	gl.useProgram(pg);
	return pg;
}

function GetResource(path) {
	return new Promise((resolve, reject) => {
		fetch(path, {}).then(response => {
			let text = response.text();
			text.then(text => {
				resolve(text);
			});
		}).catch(error => {
			reject(error);
		});
	});
}

function CompileShader(gl, shaderContent, shaderType) {

	const shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderContent);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		console.error("Shader compilation errors" + "\n" + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;

}

/**
 * @param gl - The WebGL context
 * @param data - The final data that will be assigned to the buffer
 * @param type - The type of the bugger
 * @param usage - The usage of the buffer, assigned as Static draw by default
 * @returns WebGLBuffer
 */
function InitBuffer(gl, data, type, usage = gl.STATIC_DRAW) {
	const buffer = gl.createBuffer();
	gl.bindBuffer(type, buffer);
	gl.bufferData(type, data, usage);
	return buffer;
}

function DrawBuffers(gl, vertexBuffer, vertexAttribute, triangleBuffer, triangleIndexCount) {
	const vertexComponents = 3;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // Needed?
	gl.vertexAttribPointer(vertexAttribute, vertexComponents, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
	gl.drawElements(gl.TRIANGLES, triangleIndexCount, gl.UNSIGNED_SHORT, 0);
}