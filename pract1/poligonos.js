var unCuadradoVC = {        // estructura de vértices compartidos
  
  // tipo de primitiva gráfica con el que se ha de dibujar este modelo
  primitiva : WebGLRenderingContext.TRIANGLES,
  
  "vertices" : [            // vector de vértices, atributo de posición
  -0.5, -0.5, 0.0,          // v0
   0.5, -0.5, 0.0,          // v1
   0.5,  0.5, 0.0,          // v2
  -0.5,  0.5, 0.0],         // v3
  
  "indices" : [             // vector de índices
    0, 1, 2,                // t0
    0, 2, 3]                // t1
  
};

var unCuadradoCI = {          // estructura de caras independientes
  
  // tipo de primitiva gráfica con el que se ha de dibujar este modelo
  primitiva : WebGLRenderingContext.TRIANGLES,
  
  "vertices" : [            // hay un único vector, atributo de posición
  -0.5, -0.5, 0.0,          // t0 v0
   0.5, -0.5, 0.0,          // t0 v1
   0.5,  0.5, 0.0,          // t0 v2
  -0.5, -0.5, 0.0,          // t1 v0
   0.5,  0.5, 0.0,          // t1 v2
  -0.5,  0.5, 0.0]          // t1 v3
  
};

var j10VC = {
  
  primitiva : WebGLRenderingContext.TRIANGLES,
  
  "vertices" : [ ],
  
  "indices" : [ ]                  
  
};

var j10CI = {
  
  primitiva : WebGLRenderingContext.TRIANGLES,
  
  "vertices" : [ ]      
  
};

var j10VCstrip = {
  
  primitiva : WebGLRenderingContext.TRIANGLE_STRIP,
  
  "vertices" : [ ],
  
  "indices" : [ ]                  
  
};

var j10CIstrip = {
  
  primitiva : WebGLRenderingContext.TRIANGLE_STRIP,
  
  "vertices" : [ ]      
  
};