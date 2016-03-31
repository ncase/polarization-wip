// POPULATE THE STAGE
var the_only_stage = {
	nodes:[],
	edges:[]
};
var NUM_PEEPS = 30;
for(var i=0;i<NUM_PEEPS;i++){
	the_only_stage.nodes.push({
		id: i.toString(), 
		type: "peep"
	});
}


// RANDOM NETWORK
/*
for(var i=0;i<NUM_PEEPS*2;i++){
	
	var to, from;
	from = i%NUM_PEEPS;
	do{ to = (Math.floor(Math.random()*NUM_PEEPS));
	}while(to==from);

	the_only_stage.edges.push({
		from: from.toString(),
		to: to.toString(),
		type: "friends",
		bidirectional: true
	});

}
*/

// LOOP
for(var i=0;i<NUM_PEEPS;i++){
	the_only_stage.edges.push({
		from: i.toString(),
		to: ((i+1)%NUM_PEEPS).toString(),
		type: "friends",
		bidirectional: true
	});
	the_only_stage.edges.push({
		from: i.toString(),
		to: ((i+2)%NUM_PEEPS).toString(),
		type: "friends",
		bidirectional: true
	});
	/*
	the_only_stage.edges.push({
		from: i.toString(),
		to: ((i+3)%NUM_PEEPS).toString(),
		type: "friends",
		bidirectional: true
	});*/
}

// GRID
/*
for(var x=0;x<(NUM_SIDE-1);x++){
	for(var y=0;y<(NUM_SIDE-1);y++){

		var from = (y*NUM_SIDE)+x;
		var to1 = (y*NUM_SIDE)+(x+1);
		var to2 = ((y+1)*NUM_SIDE)+x;

		the_only_stage.edges.push({
			from: from.toString(),
			to: to1.toString(),
			type: "friends",
			bidirectional: true
		});

		the_only_stage.edges.push({
			from: from.toString(),
			to: to2.toString(),
			type: "friends",
			bidirectional: true
		});

	}
}
*/

// INIT
Network.init({
	legend:{
		nodes:[
			{id:"peep", color:"#666666"}
		],
		edges:[
			{type:"friends", color:"#cccccc"}
		]
	},
	stages:[the_only_stage]
});

