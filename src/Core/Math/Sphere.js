import THREE from 'THREE';
import defaultValue from 'Core/defaultValue';


function Sphere(center,radius) {

	this.center = defaultValue(center,new THREE.Vector3());
	this.radius = defaultValue(radius,1.0);

}

Sphere.prototype.constructor = Sphere;

Sphere.prototype.setCenter = function(center) {

	this.center.copy(center);
};

Sphere.prototype.setRadius = function(radius) {

	this.radius = radius;
};

var vector = new THREE.Vector3();

Sphere.prototype.intersectWithRay = function(ray) {

    var pc = ray.closestPointToPoint(this.center);
    var a = pc.length(),d,b;

    // TODO: recompute mirror ray
    if (a > this.radius)
    {
        var mirrorPoint = pc.clone().setLength(this.radius*2 - a);
        d = ray.direction.subVectors(mirrorPoint,ray.origin).normalize();
        pc = ray.closestPointToPoint(this.center);
        a = pc.length();

        b = Math.sqrt(this.radius * this.radius - a * a);
        d.setLength(b);

        return vector.addVectors(pc, d);
    }

    // TODO: check all intersections : if (ray.origin.length() > this.radius)
    d = ray.direction.clone();
    b = Math.sqrt(this.radius * this.radius - a * a);
    d.setLength(b);

    return vector.subVectors(pc, d);

}

export default Sphere;
