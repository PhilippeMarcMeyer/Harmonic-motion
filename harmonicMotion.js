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


function setup() {
	var cnv = createCanvas(mainWidth,mainHeight,P2D);
    cnv.parent('canvasZone');
	origin = createVector(mainWidth/2,0);
	bob = createVector(mainWidth/2,len);

}

function draw() {
	background(255);
	
     bob.x = origin.x + len * sin(angle);
	 bob.y = origin.y + len * cos(angle);
	 
	 
	 if(released){
		line(origin.x,origin.y,bob.x,bob.y);
		ellipse(bob.x,bob.y,bobSize,bobSize);
		
		aAcceleration = -1 * gravity/len * sin(angle);
		angle += aVelocity;
		aVelocity += aAcceleration;
		aVelocity *= damping;
	 }
}


function mouseDragged() {
	if(!released){
	  var x = mouseX;
	  var y = mouseY;
	}
  return false;
}

function mousePressed() {
	
  var x = mouseX;
  var y = mouseY;
  if(x >= (bob.x - bobSize/2) && x <= (bob.x + bobSize/2)){
	  if(y >= (bob.y- bobSize/2) && y <= (bob.y + bobSize/2)){
	    	released = false;
	  }
  }

}

function mouseReleased() {
	
	if(!released){
	  var x = mouseX;
	  var y = mouseY;
	   released = true;
	}
 
}

