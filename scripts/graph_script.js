Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

var holder = document.getElementById('holder');

var r = Raphael("holder", 640, 480);
var connections = [];
var inp_clicked = null;
var output_clicked = null;

var cancelAnimInpOutput = function(){
    if(inp_clicked != null){
            inp_clicked.animate({"stroke-width": 1}, 100);
            inp_clicked = null;
        }
        console.log('cancel');
}

var dragNode = function(collection) { 
	return function () {
		for(var i = 0; i < collection.length; i++) {
			var elem = collection[i];
            if(elem.type == "rect"){
                elem.ox = elem.attr("x");
                elem.oy = elem.attr("y");
            }
			//elem.ox = elem.type == "rect" ? elem.attr("x") : elem.attr("cx");
    		//elem.oy = elem.type == "rect" ? elem.attr("y") : elem.attr("cy");
            else if(elem.type == "text"){
                elem.x = elem.attr('x')
                console.log('x - text ');
            }
		}

		this.animate({"fill-opacity": 1.0}, 500);

        cancelAnimInpOutput();
	};
};

var moveNode = function(collection) { 
	return function (dx, dy) {
		for(var i = 0; i < collection.length; i++) {
			var elem = collection[i];

            if(elem.type == "rect"){
                elem.attr({x: elem.ox + dx, y: elem.oy + dy})
            }
			//var att = elem.type == "rect" ? {x: elem.ox + dx, y: elem.oy + dy} : {cx: elem.ox + dx, cy: elem.oy + dy};
			//elem.attr(att);
            else if(elem.type == "text"){
                elem.attr({x: elem.x +dx/1000, y: 100 })
                console.log("text");
            }
            
		}
	};
};

var upNode  = function(collection) { 
	return function () {
   		this.animate({"fill-opacity": 0}, 500);
	};
}

var connect = function(){
    if(inp_clicked!=null && output_clicked!=null){
            console.log("connect");
            connections.push(r.connection(inp_clicked, output_clicked, "#fff"));
        }
    console.log("conn - inp_clicked " + inp_clicked + " output_clicked " + output_clicked);
}

var inpClick = function(rect_id, index) { 
	return function(e) {
        if(inp_clicked == null){
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;
        }
        else {
            inp_clicked.animate({"stroke-width": 1}, 100);
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;

        } 
        //console.log("end  -  inp_clicked " + inp_clicked + " output_clicked " + output_clicked);
        connect();
		//console.log("input_id: " + index + " [" + rect_id + "]");
	}
    //connections.push(r.connection(shapes[1], shapes[1], "#fff"));
}

var outputClick = function(rect_id, index) { 
	return function(e) {
        if(output_clicked==null){
            this.animate({"stroke-width": 5.0}, 100);
            output_clicked = this;
            
        }
        else {
            output_clicked.animate({"stroke-width": 1}, 100);
            this.animate({"stroke-width": 5.0}, 100);
            output_clicked = this;
        } 
       // console.log("end  -  inp_clicked " + inp_clicked + " output_clicked " + output_clicked);
        connect();
       //console.log("output_id: " + index + " [" + rect_id + "]");
	}
}

var clickOff = function(collection){
    return function () {
        console.log('fff');
        for(var i = 0; i < collection.length; i++) {
            var elem = collection[i];

            if(elem.type == "rect"){
                alert("rect");
            }
            else if(elem.type == "ellipse"){
                alert('ellipse');
            }
        }

        //this.animate({"fill-opacity": 1.0}, 500);

        cancelAnimInpOutput();
    };
}

var rect_id = 0;
var add_elem = function (cx, cy, inputs_count, outputs_count) {
	let WIDTH = 60;
	let HEIGHT = 60; 

	let rec = r.rect(cx - WIDTH / 2, cy - HEIGHT / 2, WIDTH, HEIGHT, 10);
	rect_id = rect_id + 1;
	let recColor = Raphael.getColor();	
	rec.attr({fill: recColor, stroke: recColor, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
   
	let col = [rec];
    console.log(col);
	rec.drag(moveNode(col), dragNode(col), upNode(col));
    

	let inpColor = Raphael.getColor();	
	for(var i = 0; i < inputs_count; i++) {
		let heightDelta = HEIGHT / (inputs_count + 1);
	
		let elem = r.ellipse(cx - WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
		elem.attr({fill: inpColor, stroke: inpColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
		elem.click(inpClick(rect_id, i));
		col.push(elem);
	}

	let outColor = Raphael.getColor();	
	for(var i = 0; i < outputs_count; i++) {
		let heightDelta = HEIGHT / (outputs_count + 1);
		let elem = r.ellipse(cx + WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
		elem.attr({fill: outColor, stroke: outColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
		elem.click(outputClick(rect_id, i));
		col.push(elem); 
	}
    
    let nodeName = r.text(cx, cy, "text");
    col.push(nodeName);
};

//$('holder').bind('click',cancelAnimInpOutput());
//$('holder').parent().bind('click', cancelAnimInpOutput());
btn_done = document.getElementById('add_button');
btn_done.onclick = function() {
	add_elem(290, 80, 6, 2);
};
/*holder.onclick = function(){
    if(inp_clicked != null){
            inp_clicked.animate({"stroke-width": 1}, 100);
            inp_clicked = null;
            console.log('cancel');
        }
    console.log('holder' + inp_clicked)    
};*/
