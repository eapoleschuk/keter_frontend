//alert("fff");
//если входов больше 16, то организовывать несколько входов в шину, как это сделано в схемах.
var rect, 
  canvas,
  //group,
  // для того, чтобы легче обращаться к элементам документа
  //$ = function(id){return document.getElementById(id)},
  button = document.getElementById('button'),
  btn_done = document.getElementById('btn_done'),
  btn_delete = document.getElementById('btn_delete'),
  y_output = -45,
  x_output = 50,
  arr_output_nodes = new Array(),
  canvas=new fabric.Canvas("paint"),
  input_circle;
   var group2;
//var node_and_outputs_group;
function makeLine(coords) {
    return new fabric.Line(coords, {
        fill: 'black',
        stroke: 'red',
        strokeWidth: 5,
        selectable: false
    });
}

function add_rect() {
    var rect = new fabric.Rect({
      originX: 'center', originY: 'center', fill: '#D8BFD8', width:200, height:200, });
  return rect;
  }

function add_text(chars){
  var text = new fabric.Text(chars,{ fontSize: 20, originX: 'center', originY: 'center', });
  return text;
  }

function add_circle(top,left){
  var circle = new fabric.Circle({ top:top, left: left, radius: 5, fill: 'gray', originX: 'center',
  originY: 'top'});
  circle.on('selected', function() {
      console.log('selected a circle');
    });
  return circle;
}

fabric.Group.prototype.getItemsByTopCoordinate = function(top) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].get("top") && objects[i].get("top") === top) {
      object = objects[i];
      break;
    }
  }

  return object;
};

      /*function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
      }
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      var canvas = document.getElementById('paint');
      var context = canvas.getContext('2d');

      canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
      }, false);*/

//////////////////////////////////////////////////////
/**
*
 */
/*const REC_WIDTH = 60;
const REC_HEIGHT = 30;
const TRI_WIDTH = 10;
const TRI_HEIGHT = 10;
var canvas = new fabric.Canvas('canvas');

resizeCanvas();

// we need this here because this is when the canvas gets initialized
['object:moving', 'object:scaling'].forEach(addChildMoveLine);

function addRect() {
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'blue',
        width: REC_WIDTH,
        height: REC_HEIGHT
    });
    canvas.add(rect);
}

function addChild() {
    if(canvas.getActiveObject() == null)
    {
        return;
    }
    canvas.addChild = {
        start: canvas.getActiveObject()
    };

    // for when addChild is clicked twice
    canvas.off('object:selected', addChildLine);
    canvas.on('object:selected', addChildLine);
}

function deleteObject() {
    var object = canvas.getActiveObject();

    // remove lines (if any)
    if (object.addChild) {
        if (object.addChild.lines)
        // step backwards since we are deleting
            for (var i = object.addChild.lines.length - 1; i >= 0; i--) {
                var line = object.addChild.lines[i];
                line.triangle.remove();
                line.addChildRemove();
                line.remove();
            }
    }

    object.remove();
}

function calcArrowAngle(x1, y1, x2, y2) {
    var angle = 0,
        x, y;

    x = (x2 - x1);
    y = (y2 - y1);

    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }

    return (angle * 180 / Math.PI + 90);
}

function addChildLine(options) {
    canvas.off('object:selected', addChildLine);

    // add the line
    var fromObject = canvas.addChild.start;
    var toObject = options.target;
    var from = fromObject.getCenterPoint();
    var to = toObject.getCenterPoint();
    var fromX = from.x;
    var fromY = from.y;
    var toX = to.x;
    var toY = to.y;

    // var disX = REC_WIDTH/2 + TRI_WIDTH/2;
    // var disY = REC_HEIGHT/2 + TRI_HEIGHT/2;

    //var distanceX, distanceY;

    //calibrateLine(fromX, fromY, toX, toY);

    var calibrateX = REC_WIDTH/2 + TRI_WIDTH/2;
    var calibrateY = REC_HEIGHT/2 + TRI_HEIGHT/2;

    var distanceX, distanceY;

    if (fromX < toX) {
        distanceX = toX - fromX;
    } else {
        distanceX = fromX - toX;
    }

    if (fromY < toY) {
        distanceY = toY - fromY;
    } else {
        distanceY = fromY - toY;
    }

    if (distanceX > distanceY) {

        if(fromX < toX) {
            toX -= calibrateX;
        } else {
            toX += calibrateX;
        }
    } else {
        if (fromY < toY) {
            toY -= calibrateY;
        } else {
            toY += calibrateY;
        }
    }

    var line = new fabric.Line([fromX, fromY, toX, toY], {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        fromObject: fromObject,
        toObject: toObject,
    });

    // leftover code that we might need but probably not
    /*
    centerX = (from.x + to.x)/2;
    centerY = (from.y + to.y)/2;
    deltaX = line.left - centerX;
    deltaY = line.top - centerY;
    

    line.triangle = new fabric.Triangle({
        left: line.x2,
        top: line.y2,
        angle: calcArrowAngle(line.x1, line.y1, line.x2, line.y2),
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        width: TRI_WIDTH,
        height: TRI_HEIGHT,
        fill: 'red',
        selectable: false,
    });

   // var Group = new fabric.Group([line, line.triangle]);
   // canvas.add(Group);

    canvas.add(line, line.triangle);

    // so that the line is behind the connected shapes
    line.sendToBack();

    // add a reference to the line to each object
    fromObject.addChild = fromObject.addChild || {};
    fromObject.addChild.lines = fromObject.addChild.lines || [];
    fromObject.addChild.lines.push(line);
    toObject.addChild = toObject.addChild || {};
    toObject.addChild.lines = toObject.addChild.lines || [];
    toObject.addChild.lines.push(line);
    
    // to remove line references when the line gets removed
    line.addChildRemove = function() {
        fromObject.addChild.lines.forEach(function(e, i, arr) {
            if (e === line)
                arr.splice(i, 1);
        });
    };

    // undefined instead of delete since we are anyway going to do this many times
    canvas.addChild = undefined;
}

function addChildMoveLine(event) {
    canvas.on(event, function(options) {
        var object = options.target;

        // udpate lines (if any)
        if (object.addChild && object.addChild.lines) {
            object.addChild.lines.forEach(function(line) {
                var fcenter = line.fromObject.getCenterPoint(),
                    fx = fcenter.x,
                    fy = fcenter.y,
                    tcenter = line.toObject.getCenterPoint(),
                    tx = tcenter.x,
                    ty = tcenter.y,
                    xdis = REC_WIDTH/2 + TRI_WIDTH/2,
                    ydis = REC_HEIGHT/2 + TRI_HEIGHT/2,
                    horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
                line.set({
                    'x1': fx,
                    'y1': fy,
                    'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) :                       0),
                    'y2': ty + ydis * (horizontal ?                       0 : (ty < line.y1 ? 1 : -1)),
                });
                line.triangle.set({
                    'left': line.x2, 'top': line.y2,
                    'angle': calcArrowAngle(line.x1, line.y1, line.x2, line.y2)
                });
            });
        }

        canvas.renderAll();
    });
}

function calibrateLine(fromX, fromY, toX, toY) {

    var distanceX = 0;
    var distanceY = 0;

    // if (fromX < toX) {
    //     distanceX = toX - fromX;
    // } else {
    //     distanceX = fromX - toX;
    // }

    // if (fromY < toY) {
    //     distanceY = toY - fromY;
    // } else {
    //     distanceY = fromY - toY;
    // }

    if (distanceX > distanceY) {

        if(fromX < toX) {
            toX -= disX;
        } else {
            toX += disX;
        }
    } else {
        if (fromY < toY) {
            toY -= disY;
        } else {
            toY += disY;
        }
    }
}

$(window).resize(resizeCanvas);


function resizeCanvas(){
    if($('canvas').height >= $('canvas').maxHeight) {
        $('canvas').setProperty('width', '800px', 'important')
    }
    $('canvas').height($('canvas').width() / 2.031);
    $('.canvas-container').height($('paint').width() / 2.031);
}
////////////////////////*/

function complete(num_output, num_input){
  var node_name= add_text(document.add_node.node_name.value);
  var node_num_output= num_output;//document.add_node.node_num_output.value;
  var node_num_input = num_input;
  var node_rect = add_rect();
  group2 = new fabric.Group([node_rect, node_name], {
    hoverCursor: 'pointer',
    left: 300, top:200,
    subTargetCheck: true, /*для прослушивания события внутри группы*/
    lockUniScaling: true, //To keep the text within the rectangle from getting distorted when its width or height are changed
  });
  var group_position_from_left_side = group2.get("left")
//alert('group2-left '+group2.get("left"));
  let current_circle_position_top = group2.get('top');
   // alert('cur-pos'+current_circle_position_top);
  let distance_between_circles = (node_rect.getScaledHeight()-1)/(node_num_output+1);
  // alert(distance_between_circles);
  for (let step = 0; step < node_num_output; step++) {
    current_circle_position_top=current_circle_position_top+distance_between_circles;
     // alert(current_circle_position_top);
    // output.set('top', current_position_y);
    let start_x_output = group_position_from_left_side + node_rect.getScaledWidth();
    var output_circle = new fabric.Circle({
      left: group_position_from_left_side + node_rect.getScaledWidth(),
      top: current_circle_position_top,
      fill: 'red', 
      width:10, 
      height:10,
      originX: 'center',
      originY: 'top',
      radius: 5,
    });
   // alert(group2.get("left"));
   group2.addWithUpdate(output_circle);
  }

  current_circle_position_top = group2.get('top');
  distance_between_circles = (node_rect.getScaledHeight()-1)/(node_num_input+1);
  for (let step = 0; step < node_num_input; step++) {
    current_circle_position_top=current_circle_position_top+distance_between_circles;
    //alert(step + ' ' + group_position_from_left_side);
    // output.set('top', current_position_y);
    //let start_x_output = group2.get("left");
    input_circle = new fabric.Circle({
      left: group_position_from_left_side,
      top: current_circle_position_top,
      fill: 'red', 
      width:10, 
      height:10,
      originX: 'center',
      originY: 'top',
      radius: 5,
    });
    //alert(group_position_from_left_side);
    input_circle.on('mouse:down', function () {
    console.log('mousedown');
    input_circle.set('fill', 'green');
  });
   group2.addWithUpdate(input_circle);
  }

  canvas.add(group2);
  canvas.renderAll();
   //node_and_outputs_group = group2;
  console.log(group2.getObjects()[3].get('top')==-75.5);
  
  

  group2.on('mousedown', function(e) { 
        // e.target should be the circle
        console.log(e.target
        //this._objects);
        );
    });

}


 //(function() {
  //var canvas = this.__canvas = new fabric.Canvas('c', { selection: false });
  //fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

  function makeCircle(left, top, line1, line2, line3, line4) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666',
      cornerStyle: 'circle',
    });
    c.hasControls = c.hasBorders = false;

    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;
    c.line4 = line4;
    console.log(c.line1);
    return c;
  }

  function makeLine(coords) {
    return new fabric.Line(coords, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false
    });
  }

  var line = makeLine([ 250, 125, 250, 175 ]),
      line2 = makeLine([ 250, 175, 250, 250 ]),
      line3 = makeLine([ 250, 250, 300, 350]),
      line4 = makeLine([ 250, 250, 200, 350]),
      line5 = makeLine([ 250, 175, 175, 225 ]),
      line6 = makeLine([ 250, 175, 325, 225 ]);

  canvas.add(line, line2, line3, line4, line5, line6);

  canvas.add(
    makeCircle(line.get('x1'), line.get('y1'), null, line),
    makeCircle(line.get('x2'), line.get('y2'), line, line2, line5, line6),
    //makeCircle(line2.get('x2'), line2.get('y2'), line2, line3, line4),
    makeCircle(line3.get('x2'), line3.get('y2'), line3),
    //makeCircle(line4.get('x2'), line4.get('y2'), line4),
    makeCircle(line5.get('x2'), line5.get('y2'), line5),
    makeCircle(line6.get('x2'), line6.get('y2'), line6)
  );

  canvas.on('object:moving', function(e) {
    var p = e.target;
    p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
    p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
    p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
    p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
    canvas.renderAll();
  });

canvas.setHeight(580);
canvas.setWidth(865);
//canvas.add(add_circle(100,100));
//canvas.add(add_circle(200,100));

    
//test:
complete(2, 2);
complete(8, 100);
//add_outputs_by_num(5);
btn_done.onclick = complete;//alert(document.add_node.node_name.value);
//btn_delete.onclick = deleteObject;

//Когда группа масштабируется, я хочу, чтобы объект прямоугольника изменял размер, но текстовый объект оставался одного и того же размера.
/*canvas.on({
    'object:scaling': function(p){
      console.log('p',p.target.ScaleX )
      //p.target._objects[0].scaleX = p.target.scaleX
      //p.target._objects[0].scaleY = p.target.scaleY
      
      //p.target.scaleX = 1
      //p.target.scaleY = 1
      if (p.target.scaleX < 1)
        p.target._objects[1].scaleX = 1 + (1 -p.target.scaleX )
      else
        p.target._objects[1].scaleX = 1 / (p.target.scaleX)
      if (p.target.scaleY < 1)
        p.target._objects[1].scaleY = 1 + (1 -p.target.scaleY)
      else
        p.target._objects[1].scaleY = 1 / (p.target.scaleY)
  
      canvas.renderAll()
    },
  });

//bounding with the bounding box
canvas.on('object:modified', function (e) {
    var obj = e.target;
    var rect = obj.getBoundingRect();
 
    if (rect.left < 0
        || rect.top < 0
        || rect.left + rect.width > canvas.getWidth()
        || rect.top + rect.height > canvas.getHeight()) {
        if (obj.getAngle() != obj.originalState.angle) {
            obj.setAngle(obj.originalState.angle);
        }
        else {
            obj.setTop(obj.originalState.top);
            obj.setLeft(obj.originalState.left);
            obj.setScaleX(obj.originalState.scaleX);
            obj.setScaleY(obj.originalState.scaleY);
        }
        obj.setCoords();
    }
});*/

canvas.on('mouse:down', function (e) {
  // clicked item will be
    //console.log(e.subTargets[0]); 
     //console.log(e.subTargets[0].get("top"));
     var clicked_output = group2.getItemsByTopCoordinate(e.subTargets[0].get("top"));
     //clicked_output.set({ fill: 'white' });;
     console.log('clicked_output');

  });

