#version 300 es
precision highp float;
uniform vec4 iMouse; 
uniform float iTime;
uniform float iAspectRatio;

in vec2 uv;
out vec4 fragmentColor;


mat4 EmptyTransform() {
    return mat4(
    vec4(1, 0, 0, 0),
    vec4(0, 1, 0, 0),
    vec4(0, 0, 1, 0),
    vec4(0, 0, 0, 1)
    );
}
mat4 TransformWithPosition(mat4 transform, vec3 pos) {
    transform[3].xyz = pos;
    transform[3].w = 1.0;
    return transform;
}

mat4 CameraTransform() {
    mat4 cameraMat = mat4(
    vec4(1, 0, 0, 0),
    vec4(0, 1, 0, 0),
    vec4(0, 0, 1, 0),
    vec4(0, 0, 0, 1)
    );
    //cameraMat[3].x = sin(iTime)*0.5;
    return cameraMat;
}

vec3 GetLightPos() {
    return vec3(0, 0, 0.2);
}
vec3 GetLightDir() {
    return vec3(-3, -3, -10);
}
vec3 UvPosToWorldPos(vec2 uvPos) {
    mat4 cameraMat = CameraTransform();
    uvPos -= vec2(0.5, 0.5);
    uvPos.y *= iAspectRatio;
    vec3 offset = vec3(uvPos.xy, 0);
    offset = (cameraMat * vec4(offset, 1)).xyz;
    return offset;
}
vec3 UVToViewDir(vec2 uv) {
    float FOV = 90.0;
    float radFOV = radians(FOV);
    float aspect = iAspectRatio;
    float angleX = mix(-radFOV * 0.5, radFOV * 0.5, uv.x);
    float angleY = mix(-radFOV * aspect * 0.5, radFOV * aspect * 0.5, uv.y);
    vec3 castDir = vec3(tan(angleX), tan(angleY), 0.75);
    mat4 transform = CameraTransform();
    transform[3].xyz = vec3(0);
    castDir = (transform * vec4(castDir, 1)).xyz;
    return normalize(castDir);

}
struct Material {
    vec3 primaryColor;
};
struct Sphere {
    vec3 position;
    mat4 transform;
    float radius;
};
float SphereSdf(Sphere sphere, vec3 pos) {
    vec4 posV = vec4(pos.x, pos.y, pos.z, 1);
    posV.xyz -= sphere.position;
    vec4 invPos = inverse(sphere.transform) * posV;
    float dist = length(invPos.xyz);
    dist -= sphere.radius;
    return dist;
}
struct Torus {
    vec3 position;
    mat4 transform;
    vec2 dimensions;
};
Torus Torus1() {
    mat4 transform = EmptyTransform();
    float a = 3.14159 * sin(iTime * 0.5f);
    transform[1][1] = cos(a);
    transform[1][2] = -sin(a);
    transform[2][1] = sin(a);
    transform[2][2] = cos(a);

    return Torus(vec3(0, 0, 0.2), transform, vec2(0.2, 0.05));
}


Sphere MouseSphere() {

    vec2 mouseCoord = vec2(iMouse.x, iMouse.y);
    vec3 pos = UvPosToWorldPos(mouseCoord);
    pos += UVToViewDir(mouseCoord) * 0.2;
    mat4 transform = EmptyTransform();
    return Sphere(pos, transform, 0.1);
}

float sdTorus(vec3 p, vec2 t)
{
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}
float TorusSdf(Torus torus, vec3 pos) {
    vec4 posV = vec4(pos.x, pos.y, pos.z, 1);
    posV.xyz -= torus.position;
    vec4 invPos = inverse(torus.transform) * posV;
    float dist = sdTorus(invPos.xyz, torus.dimensions);
    return dist;

}
float smin(float a, float b, float k)
{
    k *= 4.0;
    float x = (b - a) / k;
    float g = (x > 1.0) ? x :
    (x < -1.0) ? 0.0 :
    (x * (2.0 + x) + 1.0) / 4.0;
    return b - k * g;
}
float SceneSdf(vec3 pos) {
    float dist1 = SphereSdf(MouseSphere(), pos);
    float dist2 = TorusSdf(Torus1(), pos);
    return smin(dist1, dist2, 0.04);
}
float LightSdf(vec3 pos) {

    float dist3 = length(pos - GetLightPos());
    return dist3;
}
vec3 SceneNormalAtPoint(vec3 p) {
    const float h = 0.01; // replace by an appropriate value
    const vec2 k = vec2(1, -1);
    return normalize(k.xyy * SceneSdf(p + k.xyy * h) +
    k.yyx * SceneSdf(p + k.yyx * h) +
    k.yxy * SceneSdf(p + k.yxy * h) +
    k.xxx * SceneSdf(p + k.xxx * h));
}

struct CollisionData {
    bool collided;
    vec3 point;
    int stepAmount;
    bool lit;
};
bool MarchPointLight(vec3 point, vec3 target) {
    int iter = 0;
    vec3 dir = normalize(target - point);
    while (true) {
        float lightDist = length(target - point);
        if (lightDist < 0.1) {
            return true;
        }
        float sceneDist = SceneSdf(point);
        float dist = min(sceneDist, lightDist);
        float nextSceneDist = SceneSdf(point + dir * dist);
        if (sceneDist < 0.1 && nextSceneDist < sceneDist) {
            return false;
        }

        point += dir * dist;
        if (iter > 255) {
            return false;
        }
        iter += 1;

    }

}
CollisionData March(vec3 point, vec3 dir) {
    int iter = 0;
    CollisionData col;
    while (true) {
        float dist = SceneSdf(point);
        if (dist < 0.001) {
            bool lit = MarchPointLight(point, GetLightPos());
            col = CollisionData(true, point, iter, lit);
            break;
        }
        if (dist > 1000.0) {
            col = CollisionData(false, point, iter, false);
            break;
        }
        point += dir * dist;
        if (iter > 255) {
            col = CollisionData(false, point, iter, false);
            break;
        }
        iter += 1;

    }
    return col;

}

vec4 mainImage(vec2 uv)
{
    vec3 offset = UvPosToWorldPos(uv);
    vec3 castPos = offset;
    vec3 castDir = UVToViewDir(uv);
    CollisionData data = March(castPos, castDir);

    vec4 fragColor = vec4(0.2, 0.2, 0.3, 1.0);
    float outline = float(data.stepAmount) / 80.0;

    outline -= 0.3;
    outline *= 2.0;
    outline = clamp(outline, 0.0, 1.0);

    if (data.collided) {
        outline = 0.0;
        vec3 normal = SceneNormalAtPoint(data.point);
        vec3 light = GetLightPos();
        vec3 delta = light - data.point;
        delta = normalize(delta);
        float lit = dot(-delta, normal);
        bool inShadow = !data.lit;
        if (inShadow) {
            lit = 0.0;
        }
        //lit = clamp(lit,0.0,1.0);
        if (isnan(lit)) {
            fragColor.x = 1.0;

            return vec4(1.0, 0.0, 0.0, 1.0);
        }

        fragColor.xyz = mix(vec3(0.6, 0.8, 0.8) * 0.8, vec3(0.6, 0.8, 0.8) * 0.5, lit);
    }


    fragColor.xyz = mix(fragColor.xyz, vec3(0.6, 0.8, 1.0), outline);

    return fragColor;

}


void main() {
    vec2 uv = uv * 0.5 + 0.5;
    fragmentColor.xyz = mainImage(uv).xyz;
    fragmentColor.w = 1.0;

}







