var exampleTriangle = {

	"vertices": [
		-1, -1, 0.0,
		1, -1, 0.0,
		1, 1, 0.0,
		-1, 1, 0.0,
	],

	"indices": [0, 1, 2, 0, 3, 2],

};
let mousePosition = [0.5,0.5];
document.onmousemove = function(e) {
    mousePosition = [e.clientX, e.clientY];
};
let startTime;
async function Start() {

	const cvs = document.getElementById("rendererCanvas");

	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
	
	
	const vertexSource = await GetResource("./shaders/vertex.glsl");
	const fragmentSource = await GetResource("./shaders/fragment.glsl");
	
	const renderer = await InitRenderer(cvs,vertexSource,fragmentSource);
	renderer.BindModel(exampleTriangle.vertices, exampleTriangle.indices);
	startTime = performance.now();
	Update(renderer);
}

/**
 * 
 * @param {Renderer} renderer
 */
function Update(renderer){
	const gl = renderer.gl;
	const canvas = renderer.canvas;
	const program = renderer.program;
	
	let mouseAttrib = gl.getUniformLocation(program, "iMouse");
	let localMousePosition = [
		(mousePosition[0] - canvas.offsetLeft) / canvas.clientWidth,
		(mousePosition[1] - canvas.offsetTop) / canvas.clientHeight,
	];
	localMousePosition[0] = Math.min(1, Math.max(0, localMousePosition[0]));
	localMousePosition[1] = Math.min(1, Math.max(0, localMousePosition[1]));
	
	let aspectAttrib = gl.getUniformLocation(program, "iAspectRatio");
	gl.uniform1f(aspectAttrib, canvas.height / canvas.width);
	
	
	gl.uniform4f(mouseAttrib, localMousePosition[0], 1 - localMousePosition[1], 0, 0);
	
	
	let timeAttrib = gl.getUniformLocation(program, "iTime");
	let currentTime = performance.now() - startTime;
	gl.uniform1f(timeAttrib, currentTime / 1000);
	renderer.Draw();
	requestAnimationFrame(()=>Update(renderer));
}
Start();