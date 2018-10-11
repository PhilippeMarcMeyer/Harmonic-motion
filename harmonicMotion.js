/*
Philippe MEYER 
inspired by the coding train !
DATE : 2018-10-10
v 0.2 : intrucing "span" mesuring the amplitude of the bob between 2 frames when crossing the south border (zero angle downward)
*/


let mainHeight = 640;
let	mainWidth = 640;
let origin;
let fr = 40;
let gravity = 0.8;
let relauchingSteps = 5;
let pendulums = [];
let minSize = Math.round(mainHeight/25);
let maxSize = Math.round(mainHeight/10);
let minLength = Math.round(mainHeight/65);
let maxLength = Math.round(mainHeight/22);
let bgColor;
function setup() {
	var cnv = createCanvas(mainWidth,mainHeight,P2D);
    cnv.parent('canvasZone');
	origin = createVector(mainWidth/2,mainHeight/2);

	var HalfPI = Math.PI/2;
	for(var i = 0; i < 7; i++){
		let angle = (random() < 0.5) ? -HalfPI : HalfPI;
		let r = map(random(),0,1,70,255);
		let g = map(random(),0,1,30,255);
		let b = map(random(),0,1,50,255);
		pendulums.push(new Pendulum(origin,angle,round(random(minLength,maxLength)*10),random(minSize,maxSize),color(r,g,b),990/1000));
	}
	pendulums.sort(function(a,b){
		return a.len <= b.len;
	});
	frameRate(fr);
	bgColor = color(245,245,245);
}

function draw() {

	background(bgColor);
	stroke(140);
	rect(0,0,mainWidth-1,mainHeight-1);
	strokeWeight(2);
	noFill();
	ellipse(mainWidth/2,mainHeight/2-3,6,6);
	strokeWeight(1);
	if(frameCount == 20) fr = floor(getFrameRate());
	pendulums.forEach(function(pendulum,i){
		
		pendulum.bob.previousPosition.x = pendulum.bob.position.x;
		pendulum.bob.previousPosition.y = pendulum.bob.position.y;
		
		pendulum.bob.position.x = pendulum.origin.x + pendulum.len * sin(pendulum.angle);
		pendulum.bob.position.y = pendulum.origin.y + pendulum.len * cos(pendulum.angle);
		
		pendulum.draw();
		
		if(pendulum.bob.released){		
		  if(!pendulum.relaunching){
			pendulum.acceleration = -1 * gravity/pendulum.len * sin(pendulum.angle);
			pendulum.previousAngle = pendulum.angle;
			pendulum.angle += pendulum.velocity;
			pendulum.velocity += pendulum.acceleration;
			pendulum.velocity *= pendulum.damping;
			if(pendulum.previousAngle < 0 && pendulum.angle > 0){ 
				// just crossing the downborder from left to right
				pendulum.span = pendulum.angle - pendulum.previousAngle;
			}else if(pendulum.previousAngle > 0 && pendulum.angle < 0){
				// just crossing the downborder from right to left
				pendulum.span = pendulum.previousAngle - pendulum.angle;
			}
			if(pendulum.span <0.001 || abs(pendulum.velocity) < 0.0000005){
				pendulum.span = 1;
				pendulum.relaunching = true;
				pendulum.angle =0;
				pendulum.velocity=0;
				pendulum.cpt = relauchingSteps;
			}
		  }else{
			  if(frameCount % fr == 0) {
				   pendulum.cpt--;
			  }
			  if(pendulum.cpt <= 0){
				  pendulum.velocity = random(0.09,0.37);
				  pendulum.relaunching = false;
			  }
		  }
		}
	})
}

function Pendulum(origin,angle,length,bobSize,bobColor,damping){
	this.origin = origin;
	this.startAngle = angle;
	this.angle = angle;
	this.previousAngle = angle;
	this.len = length;
	this.bob = new Bob(bobSize,bobColor,origin.x,origin.y+length);
	this.velocity = 0;
	this.acceleration = 0;
	this.damping = damping || 0.99;
	this.span = 1;
	this.relauching = false;
	this.cpt = 0;
	this.textSize = floor(bobSize/2);
	this.textOffset = floor(bobSize/6);
	this.draw = function(){
		push();
			stroke(140);
			noFill();
			line(this.origin.x,this.origin.y,this.bob.position.x,this.bob.position.y);
		pop();
		this.bob.draw();
		if(this.cpt > 0){
			push();
			stroke(0);
			fill(0);
			textSize(this.textSize);
			text(this.cpt,this.bob.position.x-this.textOffset,this.bob.position.y+this.textOffset);
			pop();
		}
	}
}

function Bob(size,pcolor,x,y){
	this.size = size;
	this.lightSizeX = floor(size/2.4);
	this.lightSizeY = floor(size/2.4);
	this.lightOffset= floor(size/6);
	this.color = pcolor;
	this.lightColor = color(255,255,255,50);
	this.position = createVector(x,y);
	this.previousPosition = createVector(0,0);
	this.released = true;
	this.draw = function(){
		push();
			stroke(0,0,0);
			noStroke();
			fill(this.color);
			ellipse(this.position.x,this.position.y,this.size,this.size);
			noStroke();
			fill(this.lightColor);
			rotate(this.angle);
			ellipse(this.position.x+this.lightOffset,this.position.y-this.lightOffset,this.lightSizeX,this.lightSizeY);
		pop();
	}
}

function mouseDragged() {
	var mx = mouseX;
	var my = mouseY;
	
	pendulums.forEach(function(pendulum){
		if(!pendulum.bob.released){
			var diff = p5.Vector.sub(origin, createVector(mx,my));
			pendulum.angle = atan2(-1*diff.y, diff.x) - radians(90);    
		}
	  });
  
    return false;
}

function mousePressed() {
  var mx = mouseX;
  var my = mouseY;
  var found = false;
  pendulums.forEach(function(pendulum){
	  if(!found){
		var d = dist(mx, my, pendulum.bob.position.x, pendulum.bob.position.y);
		if(d < pendulum.bob.size/2){
			 pendulum.bob.released = false;
			 var diff = p5.Vector.sub(pendulum.origin, createVector(mx,my));
			 pendulum.angle = atan2(-1*diff.y, diff.x) - radians(90);    
			 found = true;
		}
	  }
  });

}

function mouseReleased() {
	pendulums.forEach(function(pendulum){
		if(!pendulum.bob.released){
			pendulum.velocity = 0;
		}
		pendulum.bob.released= true;
  });
}

