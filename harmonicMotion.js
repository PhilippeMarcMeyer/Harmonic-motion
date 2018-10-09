/*
Philippe MEYER 
DATE : 2018-10-09

SOH CAH
sin(a) = x / len
cos(a) y / len

x = len * sin(a);
y = len * cos(a);

the pendulum has a force of gravity 
Fp = G * mass * sin(angle)
A = G * sin(angle) // acceleration
*/


let mainHeight = 320;
let	mainWidth = 640;
let origin;
let bob;
let len =150;
let angle = Math.PI/3;
let bobSize = 32;
let aVelocity = 0;
let aAcceleration = 0;
let gravity = 0.8;
let damping = 0.99;
let released = true;
let controlPt1,controlPt2;


function setup() {
	var cnv = createCanvas(mainWidth,mainHeight,P2D);
    cnv.parent('canvasZone');
	origin = createVector(mainWidth/2,0);
	bob = createVector(mainWidth/2,len);
	controlPt1 = createVector(origin.x,origin.y + (len *0.05));
	controlPt2 = createVector(origin.x,origin.y + (len *0.1));
}

function draw() {
	background(255);
	
	bob.x = origin.x + len * sin(angle);
	bob.y = origin.y + len * cos(angle);
	
	bezier(origin.x,origin.y,controlPt1.x,controlPt1.y,controlPt2.x,controlPt2.y,bob.x,bob.y);
	
	push();
		stroke(0,0,0);
		fill(255,0,0);
		ellipse(bob.x,bob.y,bobSize,bobSize);
	pop();
		
	 if(released){		
		aAcceleration = -1 * gravity/len * sin(angle);
		angle += aVelocity;
		aVelocity += aAcceleration;
		aVelocity *= damping;
	 }
}

function mouseDragged() {
	if(!released){
	  var mx = mouseX;
	  var my = mouseY;
		 var diff = p5.Vector.sub(origin, createVector(mx,my));

		angle = atan2(-1*diff.y, diff.x) - radians(90);    
	}
  return false;
}

function mousePressed() {
	
  var mx = mouseX;
  var my = mouseY;
  
  var d = dist(mx, my, bob.x, bob.y);
	if(d < bobSize/2){
		 released = false;
		 var diff = p5.Vector.sub(origin, createVector(mx,my));
		 angle = atan2(-1*diff.y, diff.x) - radians(90);    
	}
}

function mouseReleased() {
	if(!released){
	  var x = mouseX;
	  var y = mouseY;
	   released = true;
	   aVelocity = 0;
	}
 
}

