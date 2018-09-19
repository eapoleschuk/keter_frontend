var holder = document.getElementById('holder');

var r = Raphael("holder", 640, 480);

var connections = {};
var all_input_connectors = {};
var all_ouput_connectors = {};

Raphael.fn.connection = function (to, from, color) {
    var fromKey = getConnectorKey(from.rect_id, from.idx);
    var toKey = getConnectorKey(to.rect_id, to.idx);

    if(typeof(connections[fromKey]) != "undefined" && typeof(connections[fromKey][toKey]) != "undefined" && connections[fromKey][toKey] != 0)
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

    console.log(fromKey + " " + toKey + " " + line);
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

        cancelAnimInpOutput();
    };
};

var moveNode = function(collection) { 
    return function (dx, dy) {
        for(var i = 0; i < collection.length; i++) {
            var elem = collection[i];

            if(elem.type == "ellipse"){
                elem.attr({cx: elem.ox + dx, cy: elem.oy + dy});
                moveConnections(elem.rect_id, elem.idx, dx, dy);
            } else {
                elem.attr({x: elem.ox + dx, y: elem.oy + dy});
            }
        }
    };
};

var moveConnections = function(rect_id, connector_id, x, y) {
    var conn_key = getConnectorKey(rect_id, connector_id);
    if(typeof(connections[conn_key]) == "undefined") 
        return; //эта вершина никогда коннектилась
    console.log(rect_id + " " + connector_id);
    var connectorsFromOtherEnd = connections[conn_key];

    for(var otherEndId in connectorsFromOtherEnd) {
        var corrLine = connections[conn_key][otherEndId];
        console.log(connections[conn_key][otherEndId]);
        if(typeof(corrLine) != "undefined" && corrLine != 0) {
            var xStartCoorLine = corrLine.attr('path')[0][1];
            var yStartCoorLine = corrLine.attr('path')[0][2];
            r.connection(inp_clicked, output_clicked, "#fff");
            //xStartCoorLine = xStartCoorLine+dx;
            //console.log(dx + " " + xStartCoorLine+ " " + yStartCoorLine);
           // r.connection(inp_clicked, output_clicked, "#fff");
        } 
    }
}

var upNode  = function(collection) { 
    return function () {
           this.animate({"fill-opacity": 0}, 500);
    };
}

var connect = function(){
    if(inp_clicked != null && output_clicked != null) {
        r.connection(inp_clicked, output_clicked, "#fff");
        console.log(inp_clicked.id + " " + output_clicked.id);
        inp_clicked.animate({"stroke-width": 1.0}, 100);
        output_clicked.animate({"stroke-width": 1.0}, 100);
        inp_clicked = null;
        output_clicked = null;
    }
}

var selected_rect = null;

var inpClick = function(rect_id, index) { 
    return function(e) {
        if(inp_clicked == null){
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;
        } else {
            inp_clicked.animate({"stroke-width": 1}, 100);
            this.animate({"stroke-width": 5.0}, 100);
            inp_clicked = this;
        } 

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

var clickOff = function(collection){
    return function () {
        for(var i = 0; i < collection.length; i++) {
            var elem = collection[i];

            if(elem.type == "rect"){
                alert("rect");
            }
            else if(elem.type == "ellipse"){
                alert('ellipse');
            }
        }

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
    rec.drag(moveNode(col), dragNode(col), upNode(col));
    

    let inpColor = Raphael.getColor();    
    for(var i = 0; i < inputs_count; i++) {
        let heightDelta = HEIGHT / (inputs_count + 1);
    
        let elem = r.ellipse(cx - WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
        elem.idx = i;
        elem.rect_id = rect_id;
        
        elem.attr({fill: inpColor, stroke: inpColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
        elem.click(inpClick(rect_id, i));
        col.push(elem);
    }

    let outColor = Raphael.getColor();    
    for(var i = 0; i < outputs_count; i++) {
        let heightDelta = HEIGHT / (outputs_count + 1);
        let elem = r.ellipse(cx + WIDTH / 2, cy - HEIGHT / 2 + heightDelta * (i + 1), 5, 5);
        elem.idx = i;
        elem.rect_id = rect_id;
       
        elem.attr({fill: outColor, stroke: outColor, "fill-opacity": 1.0, "stroke-width": 2, cursor: "move"});
        elem.click(outputClick(rect_id, i));
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


