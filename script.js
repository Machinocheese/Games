var htmlCanvas = document.getElementById("canvas"), context = htmlCanvas.getContext('2d'), player, bait, predator;
var speed = 50, score = 0;

/**
 * Basic Animation Steps: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations#Basic_animation_steps
 */

function createImage(src, x, y, width, height, angle) {
    var map = {};
    var img = new Image();
    img.src = src;
    map["x"] = x;
    map["y"] = y;
    map["width"] = width;
    map["height"] = height;
    map["image"] = img;
    map["angle"] = angle;
    return map;
}

function createPoint(objWidth, objHeight){
    var point = {};

    var x = Math.floor(Math.random() * window.innerWidth);
    var y = Math.floor(Math.random() * window.innerHeight);

    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x > window.innerWidth - objWidth) x = window.innerWidth - objWidth;
    if(y > window.innerHeight - objHeight) y = window.innerHeight - objHeight;
    point["x"] = x;
    point["y"] = y;

    return point;
}

function createPredator(){
    //predator currently only moves up or down. 
    //predator first moves in x. then y. then x.
    //make it only go in one direction.
    var point = createPoint(predator["width"], predator["height"]);
    predator["destination"] = point;
    predator["direction"] = Math.floor(Math.random() * 2);
    console.log(predator["destination"]);
}

function updatePredator(){
    //one if-statement handles the x-direction, the other handles the y-direction
    if(predator["direction"]){ //handle x-direction
        if(predator["destination"]["x"] > predator["x"]){
            predator["x"] += speed;
            predator["angle"] = 180;
        }
        else{
            predator["x"] -= speed;
            predator["angle"] = 0;
        }
    } else {
        if(predator["destination"]["y"] > predator["y"]){
            predator["y"] += speed;
            predator["angle"] = 270;
        }
        else{
            predator["y"] -= speed;
            predator["angle"] = 90;
        }
    }

    drawObject(predator);

    console.log("WHAT?: " + predator["x"] + ' ' + predator["destination"]["x"] + ' ' + Math.abs(predator["x"] - predator["destination"]["x"]) + ' ' + Math.abs(predator["y"] - predator["destination"]["y"]) <= speed);
    if(Math.abs(predator["x"] - predator["destination"]["x"]) <= speed && Math.abs(predator["y"] - predator["destination"]["y"]) <= speed)
        createPredator();
}

function createObject(image, width, height){
    var object;
    var point = createPoint(width, height);

    console.log("Position: " + point["x"] + ' ' + point["y"]);
    object = createImage(image, point["x"], point["y"], width, height, 0);
    object["image"].onload = function(){
        context.drawImage(object["image"], object["x"], object["y"], object["width"], object["height"]);
    }
    return object;
}

function drawObject(object){
    context.save();
    context.translate(object["x"] + object["width"] / 2, object["y"] + object["height"] / 2);
    context.rotate(object["angle"] *Math.PI/180);
    context.drawImage(object["image"], -1 * object["width"] / 2, -object["height"] / 2, object["width"], object["height"]);
    context.restore();
}

function drawScore(){
    context.font = "30px Arial";
    context.fillText("Current Score: " + score, 10, 50);
}

function drawCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawObject(player);
    drawScore();
    if(!checkCollision(player, bait))
        context.drawImage(bait["image"], bait["x"], bait["y"], bait["width"], bait["height"]); //draw bait
    else{
        score++;
        bait = createObject("aphid.png", 50, 50);
    }
}

function checkCollision(rect1, rect2){
    if(rect1["x"] > rect2["x"] && rect1["x"] < rect2["x"] + rect2["width"] || 
    rect2["x"] > rect1["x"] && rect2["x"] < rect1["x"] + rect1["width"])
        if(rect1["y"] > rect2["y"] && rect1["y"] < rect2["y"] + rect2["height"] ||
        rect2["y"] > rect1["y"] && rect2["y"] < rect1["y"] + rect1["height"])
            return true;
    return false;
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') { // up arrow
        player["y"] = player["y"] - speed;
        if(player["y"] < 0) player["y"] = 0;
        player["angle"] = 0;
    }
    else if (e.keyCode == '40') { // down arrow
        player["y"] = player["y"] + speed;
        if(player["y"] > window.innerHeight - player["height"]) player["y"] = window.innerHeight - player["height"];
        player["angle"] = 180;
    }
    else if (e.keyCode == '37') { // left arrow
        player["x"] = player["x"] - speed;
        if(player["x"] < 0) player["x"] = 0;
        player["angle"] = 270;
    }
    else if (e.keyCode == '39') { //right arrow
        player["x"] = player["x"] + speed;
        if(player["x"] > window.innerWidth - player["width"]) player["x"] = window.innerWidth - player["width"];
        player["angle"] = 90;
    }
    drawCanvas();
}

window.onload = function(){
    htmlCanvas.width = window.innerWidth;
    htmlCanvas.height = window.innerHeight;

    //TO-DO: implement collision check when creating object
    player = createObject("bug.png", 100, 100);
    bait = createObject("aphid.png", 50, 50);
    predator = createObject("predator.jpg", 200, 200);
    drawScore();

    createPredator();
    //setInterval(updatePredator, 100);
}

document.onkeydown = checkKey;