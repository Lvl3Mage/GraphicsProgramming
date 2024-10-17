#version 300 es

uniform vec4 iMouse;
in vec3 VertexPosition;
out vec2 uv;
void main() {


    gl_Position = vec4(VertexPosition, 1.0);
    uv = VertexPosition.xy;



}

    