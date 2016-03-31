/////////////////
///// EDGES /////
/////////////////

(function(exports){

// Create the connections, yo
exports.edges = [];
exports.Edge = function(config){

	var self = this;

	// Properties
	self.from = config.from;
	self.to = config.to;
	self.type = config.type;
	self.bidirectional = config.bidirectional;

	// Tell the nodes we're connected now.
	self.from.connections.push(self);
	self.to.connections.push(self);

	// Draw
	var f = self.from;
	var t = self.to;
	var art = Network.getEdgeArt(self.type);
	self.graphics = edgesSVG.line().attr({
		stroke: (art.color=="inherit" ? self.from.color : art.color),
		strokeWidth: art.thickness || 1,
		opacity: (art.color=="inherit" ? 0.5 : 1)
	});

	// Edit edge properties...
	self.edit = function(config){

		// Type!
		if(config.type){
			self.type = config.type;
			var art = Network.getEdgeArt(self.type);
			self.graphics.attr({
				stroke: (art.color=="inherit" ? self.from.color : art.color),
				strokeWidth: art.thickness || 1,
				opacity: (art.color=="inherit" ? 0.5 : 1)
			});
		}

	};

	// Update drawing
	self.draw = function(){
		var f = self.from;
		var t = self.to;
		self.graphics.attr({
			x1: f.x,
			y1: f.y,
			x2: t.x,
			y2: t.y
		});
	};
	self.draw();

	// Kill!
	self.kill = function(){

		// Remove from array
		var index = edges.indexOf(self);
		edges.splice(index,1);

		// Remove from the two nodes
		index = self.from.connections.indexOf(self);
		self.from.connections.splice(index,1);
		index = self.to.connections.indexOf(self);
		self.to.connections.splice(index,1);

		// Remove graphics
		self.graphics.remove();

	};

};

exports.Edge.getByEnds = function(from,to){
	for(var i=0;i<edges.length;i++){
		var edge = edges[i];
		if(edge.from==from && edge.to==to) return edge;
		if(edge.from.id==from && edge.to.id==to) return edge; // in case you passed strings
	}
	return null;
};

exports.Edge.getConnectedTo = function(node){

	var results = [];

	// All those edges where it's the "from" node,
	// OR bidirectional and it's the "to" node.
	for(var i=0;i<edges.length;i++){
		var edge = edges[i];

		if(edge.from==node){
			results.push(edge.to);
		}else if(edge.bidirectional && edge.to==node){
			results.push(edge.from);
		}

	}

	return results;

};

})(window);