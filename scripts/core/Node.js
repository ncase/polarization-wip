/////////////////
///// NODES /////
/////////////////

(function(exports){

// RANDO CONSTANTS
var DRAW_RADIUS = 10;
var RADIUS_PER_CONNECTION = 0;
var EDGE_LENGTH = 30;
var HOOKES_CONSTANT = 0.01;
var REPEL_CONSTANT = 60;
var DAMPENING = 0.95;
var GRAVITY = 0.05;

// Create the nodes, yo
exports.nodes = [];
exports.Node = function(config){
	
	var self = this;
	
	// Properties
	self.id = config.id;
	self.label = config.id; // HACK
	self.type = config.type;
	self.x = config.x;
	self.y = config.y;
	self.vel = { x:0, y:0 };

	// Connections
	self.connections = [];

	// HACK - WHATEVER
	if(window.ALTERNATE){
		self.belief = (parseInt(self.id)%2==0) ? 1 : -1;
	}else if(window.SEPARATE){
		self.belief = (Math.random()<0.5) ? 0.8 : -0.8;
		self.belief += (Math.random()*2-1)*0.2;
	}else if(window.START_RANDOM){
		self.belief = Math.random()*2-1;
	}else{
		self.belief = (Math.random()<0.5) ? 1 : -1;
	}

	// Draw
	self.graphics = nodesSVG.group().attr({
		cursor: "pointer"
	});
	self.color = Network.getNodeArt(self.type).color;
	self.body = self.graphics.circle(0, 0, DRAW_RADIUS).attr({
		fill: self.color
	});

	// MA FACE, MA BOOTIFUL FACE
	self.face = self.graphics.group().attr({
		fill: "#000",
		opacity: 0.75,
		stroke: "none"
	});
	self.face.circle(-6,-0.5,1.5);
	self.face.circle(6,-0.5,1.5);
	self.face.rect(-4,1,8,1);

	// Draw
	self.draw = function(){

		// HACK - BELIEF COLOR
		var hue = 0.85+self.belief*0.15;
		self.color = Snap.hsl(hue, 0.8, 0.6);
		self.body.attr({fill:self.color});

		// Size
		var radius = DRAW_RADIUS + self.connections.length*RADIUS_PER_CONNECTION;
		self.body.attr({ r:radius });
		//self.caption.attr({ y:-radius });

		// Translation...
		var matrix = new Snap.Matrix();
		matrix.translate(self.x, self.y);
		self.graphics.attr({
			transform: matrix
		});

		// Update connections, too.
		for(var i=0;i<self.connections.length;i++){
			self.connections[i].draw();
		}

	};
	self.draw();

	// Update
	self.springTo = function(other, edgeLength, hookesConstant){

		// How much force
		var dx = self.x - other.x;
		var dy = self.y - other.y;
		var distance = Math.sqrt(dx*dx+dy*dy);
		var displacement = edgeLength - distance;
		var force = hookesConstant * displacement;

		// In what direction
		var ux = dx/distance;
		var uy = dy/distance;
		self.vel.x += ux*force;
		self.vel.y += uy*force;

	};
	self.update = function(){	

		// PHYSICS ONLY IF NOT DRAGGED
		if(!self.isDragging){

			// Who are NOT connected to me?
			var notConnected = nodes.slice(0,nodes.length); // clones it
			notConnected.splice(notConnected.indexOf(self),1); // NOT SELF
			
			// Spring to the center
			self.springTo({x:0, y:0}, 0, 0.002);

			// Hooke's Law on connected
			for(var i=0;i<self.connections.length;i++){

				// The other node
				var c = self.connections[i];
				var other = (c.from==self) ? c.to : c.from;

				// not NOT connected
				notConnected.splice(notConnected.indexOf(other),1);

				// Spring to
				self.springTo(other, EDGE_LENGTH, HOOKES_CONSTANT);			

			}

			// On everyone who's NOT connected...
			for(var i=0;i<notConnected.length;i++){
				var other = notConnected[i];

				// How much force
				var dx = self.x - other.x;
				var dy = self.y - other.y;
				if(dx==0 && dy==0) dx=0.1; // edge case - do NOT overlap totally
				var distanceSquared = dx*dx+dy*dy;
				if(distanceSquared<100) distanceSquared=100; // stop that asymptote
				var force = REPEL_CONSTANT/distanceSquared;

				// In what direction
				var distance = Math.sqrt(distanceSquared);
				var ux = dx/distance;
				var uy = dy/distance;
				self.vel.x += ux*force;
				self.vel.y += uy*force;

			}

			// Position
			self.x += self.vel.x;
			self.y += self.vel.y;

			// Velocity dampening
			self.vel.x *= DAMPENING;
			self.vel.y *= DAMPENING;

		}

	};

	// Draggable
	self.isDragging = false;
	var move = function(dx,dy) {
		self.x = self.startDragX + dx/Network.matrix.a;
		self.y = self.startDragY + dy/Network.matrix.d;
		self.draw();
	}
	var start = function(){
		self.isDragging = true;
		self.startDragX = self.x;
		self.startDragY = self.y;
	};
	var end = function(){
		self.isDragging = false;
	}
	self.graphics.drag(move, start, end);

};

exports.Node.getById = function(id){
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		if(node.id==id) return node;
	}
	return null;
};

})(window);