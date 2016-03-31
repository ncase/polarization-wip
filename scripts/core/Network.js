(function(exports){

//////////////////////////
// CREATING THE NETWORK //
//////////////////////////

exports.Network = {};

// Create a model + centered container SVG.
exports.modelSVG = Snap("#model");
var matrix = new Snap.Matrix();
matrix.translate(modelSVG.node.clientWidth/2, modelSVG.node.clientHeight/2);
matrix.scale(2.5);
Network.matrix = matrix;
var containerSVG = modelSVG.group().attr({ transform:matrix });

// Edges below nodes
exports.edgesSVG = containerSVG.group();
exports.nodesSVG = containerSVG.group();

// Init
Network.init = function(config){

	Network.config = config;

	// Clear arrays & SVG
	nodesSVG.clear();
	edgesSVG.clear();
	nodes = [];
	edges = [];

	// Stages
	Network.stageIndex = -1;
	Network.stages = config.stages;

	// First stage
	Network.nextStage();

};

// Next Stage
Network.nextStage = function(){

	// Get next stage
	if(Network.stageIndex>=Network.stages.length-1) return;
	Network.stageIndex++;
	Network.stage = Network.stages[Network.stageIndex];
	var stage = Network.stage;

	// Random placement
	var _random = function(amount){
		return (Math.random()-0.5)*amount;
	};

	// Create new nodes
	var newNodes = [];
	for(var i=0; i<stage.nodes.length; i++){
		var n = stage.nodes[i];
		var node = new Node({
			id: n.id,
			type: n.type,
			x: n.x || _random(400),
			y: n.y || _random(400)
		});
		newNodes.push(node);
		nodes.push(node);
	}

	// Create new edges
	for(var i=0; i<stage.edges.length; i++){
		var e = stage.edges[i];
		var from = Node.getById(e.from);
		var to = Node.getById(e.to);
		var edge = new Edge({
			bidirectional: e.bidirectional,
			type: e.type,
			from: from,
			to: to
		});
		edges.push(edge);

		// If exactly one of those nodes are new,
		// have it "spring" off the existing node
		if(newNodes.indexOf(from)<0 && newNodes.indexOf(to)>=0){
			to.x = from.x + _random(5);
			to.y = from.y + _random(5);
		}else if(newNodes.indexOf(to)<0 && newNodes.indexOf(from)>=0){
			from.x = to.x + _random(5);
			from.y = to.y + _random(5);
		}

	}

};

// UPDATING
function update(){

	// Update all nodes, nerd
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		node.update();
		node.draw();
	}

	// RAF that again
	requestAnimationFrame(update);

}
requestAnimationFrame(update);

// Art...
Network.getNodeArt = function(nodeType){
	var arts = Network.config.legend.nodes;
	for(var i=0;i<arts.length;i++){
		var art = arts[i];
		if(art.id==nodeType) return art;
	}
	return null;
};
Network.getEdgeArt = function(edgeType){
	var arts = Network.config.legend.edges;
	for(var i=0;i<arts.length;i++){
		var art = arts[i];
		if(art.type==edgeType) return art;
	}
	return null;
};

})(window);