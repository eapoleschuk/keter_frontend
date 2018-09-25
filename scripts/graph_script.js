var holder = document.getElementById('holder');

var r = Raphael("holder", 640, 480);

var connections = {};
var all_input_connectors = {};
var all_ouput_connectors = {};

Raphael.fn.connection = function (from, to, color) {
    var fromKey = getConnectorKey(from.rect_id, from.idx);
    var toKey = getConnectorKey(to.rect_id, to.idx);
    	console.log("CONNECTIONS")
    console.log(from)

    if(typeof(connections[fromKey]) != "undefined" && typeof(connections[fromKey][toKey]) != "undefined" && connections[fromKey][toKey] != 0)
    	//console.log("from")
        return;

    if(typeof(connections[fromKey]) == "undefined") 
        connections[fromKey] = {};
    if(typeof(connections[toKey]) == "undefined")
        connections[toKey] = {};

    var lineCode = "M" + Math.floor(from.attr("cx")) + " " + Math.floor(from.attr("cy")) + "L" + Math.floor(to.attr("cx")) + " " + Math.floor(to.attr("cy"));
    var line = r.path(lineCode);
    connections[fromKey][toKey] = line;
    connections[toKey][fromKey] = line;
    line.attr({stroke: color, fill: "none"}); 
    console.log("LINE")
    console.log(line);
};

var getConnectorKey = function(rect_id, connector_id) {
    return rect_id + ":" + connector_id;
}

var inp_clicked = null;
var output_clicked = null;

var cancelAnimInpOutput = function(){
    if(inp_clicked != null){
        inp_clicked.animate({"stroke-width": 1}, 100);
        inp_clicked = null;
    }
}

var dragNode = function(collection) { 
    return function () {
        for(var i = 0; i < collection.length; i++) {
            var elem = collection[i];
            if(elem.type == "ellipse"){
                elem.ox = elem.attr("cx");
                elem.oy = elem.attr("cy");
            } else {
                elem.ox = elem.attr("x");
                elem.oy = elem.attr("y");
            }
        }

        this.animate({"fill-opacity": 1.0}, 500);

        //cancelAnimInpOutput();
    };
};

var moveNode = function(collection) { 
    return function (dx, dy) {
        for(var i = 0; i < collection.length; i++) {
            var elem = collection[i];

            if(elem.type == "ellipse"){
                elem.attr({cx: elem.ox + dx, cy: elem.oy + dy});
                moveConnections(elem, elem.rect_id, elem.idx, dx, dy);
            } else {
                elem.attr({x: elem.ox + dx, y: elem.oy + dy});
            }
        }
    };
};

var moveConnections = function(elem, rect_id, connector_id, x, y) {
    var conn_key = getConnectorKey(rect_id, connector_id);
    if(typeof(connections[conn_key]) == "undefined") 
        return; //эта вершина никогда коннектилась
    var connectorsFromOtherEnd = connections[conn_key];
    
    for(var otherEndId in connectorsFromOtherEnd) {
        var corrLine = connections[conn_key][otherEndId];

        if(typeof(corrLine) != "undefined" && corrLine != 0) {
            var xStartCoorLine = corrLine.attr('path')[0][1];
            var yStartCoorLine = corrLine.attr('path')[0][2];
            // corrLine.attr('path')[0][1] = inp_clicked.attr("cx");
            // corrLine.attr('path')[0][2] = inp_clicked.attr("cy");
            // corrLine.attr('path')[1][1] = output_clicked.attr("cx");
            // corrLine.attr('path')[1][2] = output_clicked.attr("cy");
            corrLine.remove();
            //console.warn(connections[conn_key][otherEndId])
            	//all_input_connectors = ;
            	 connections[conn_key][otherEndId] = 0;
            	 connections[otherEndId][conn_key] = 0;
            
        } 
    }
console.log(map);
     map.forEach( (value, key, map) => { 
     	console.log(key); // огурцов: 500 гр, и т.д.
		r.connection(value, key, "#fff");
 		});
 }

var upNode  = function(collection) { 
    return function () {
           this.animate({"fill-opacity": 0}, 500);
    };
}
var map = new Map();

var all_inputs=[];
var all_outputs = [];
var connect = function(){

    if(inp_clicked != null && output_clicked != null) {
        r.connection(output_clicked, inp_clicked, "#fff");
        inp_clicked.animate({"stroke-width": 5.0}, 100);
        output_clicked.animate({"stroke-width": 1.0}, 100);
        all_inputs[all_inputs.length] = inp_clicked;
        all_outputs[all_outputs.length] = output_clicked;
        map.set(inp_clicked, output_clicked);
    }
}

var selected_rect = null;

var inpClick = function(rec, rect_id, index) { 
    return function(e) {
        if(inp_clicked == null){
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;

        } else {
            inp_clicked.animate({"stroke-width": 1}, 100);
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;
        } 
        console.log(rec);
        connect();
    }
}

var outputClick = function(rect_id, index) { 
    return function(e) {
        if(output_clicked==null){
            this.animate({"stroke-width": 5.0}, 100);
            output_clicked = this;
        } else {
            output_clicked.animate({"stroke-width": 1}, 100);
            this.animate({"stroke-width": 5.0}, 100);
            output_clicked = this;
        }
    }
}

var rect_id = 0;
var add_elem = function (cx, cy, inputs_count, outputs_count) {
    let WIDTH = 60;
    let HEIGHT = 60; 

    let rec = r.rect(cx - WIDTH / 2, cy - HEIGHT / 2, WIDTH, HEIGHT, 10);
    rect_id = rect_id + 1;
    let recColor = Raphael.getColor();    
    rec.attr({fill: recColor, stroke: recColor, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    rec.rect_id=rect_id;
    let col = [rec];
    rec.drag(moveNode(col), dragNode(col), upNode(col));
    //rec.click(function(){alert(rec.rect_id)})
    

    let inpColor = Raphael.getColor();    
    for(var i = 0; i < inputs_count; i++) {
        let heightDelta = HEIGHT / (inputs_count + 1);
    
        let elem = r.ellipse(cx - WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
        elem.idx = i;
        elem.rect_id = rect_id;
        
        elem.attr({fill: inpColor, stroke: inpColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
        elem.click(inpClick(rec, rec.rect_id, i));
        col.push(elem);
    }

    let outColor = Raphael.getColor();    
    for(var i = 0; i < outputs_count; i++) {
        let heightDelta = HEIGHT / (outputs_count + 1);
        let elem = r.ellipse(cx + WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
        elem.idx = i;
        elem.rect_id = rect_id;
       
        elem.attr({fill: outColor, stroke: outColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
        elem.click(outputClick(rec.rect_id, i));
        col.push(elem); 
    }
    
    let nodeName = r.text(cx, cy, rect_id+" node").attr({fill: "#fff"});
    col.push(nodeName);
    col.push()
};

btn_done = document.getElementById('add_button');
btn_done.onclick = function() {
    add_elem(290, 80, 6, 2);
};

var test_connection = function(){
    add_elem (290, 80, 2, 2);
    add_elem (390, 80, 2, 2);

}

test_connection();


