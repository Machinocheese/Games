var htmlCanvas = document.getElementById("canvas"), context = htmlCanvas.getContext('2d'), player, bait;
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

function drawPlayer(){
    context.save();
    context.translate(player["x"] + player["width"] / 2, player["y"] + player["height"] / 2);
    context.rotate(player["angle"] *Math.PI/180);
    context.drawImage(player["image"], -1 * player["width"] / 2, -player["height"] / 2, player["width"], player["height"]);
    context.restore();
}

function createBait(){
    var baitWidth = 50;
    var baitHeight = 50;
    var x = Math.floor(Math.random() * window.innerWidth);
    var y = Math.floor(Math.random() * window.innerHeight);

    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x > window.innerWidth - baitWidth) x = window.innerWidth - baitWidth;
    if(y > window.innerHeight - baitHeight) y = window.innerHeight - baitHeight;

    console.log("Position: " + x + ' ' + y);
    bait = createImage("aphid.png", x, y, baitWidth, baitHeight, 0);
    bait["image"].onload = function(){
        context.drawImage(bait["image"], bait["x"], bait["y"], bait["width"], bait["height"]);
    }
}

function drawScore(){
    context.font = "30px Arial";
    context.fillText("Current Score: " + score, 10, 50);
}

function drawCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawScore();
    if(!checkCollision(player, bait))
        context.drawImage(bait["image"], bait["x"], bait["y"], bait["width"], bait["height"]); //draw bait
    else{
        score++;
        createBait();
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

    player = createImage("bug.png", 100, 100, 100, 100, 0);
    player["image"].onload = function () {
        context.drawImage(player["image"], player["x"], player["y"], player["width"], player["height"]);
    }

    drawScore();
    createBait();

    /** update this so that you can just call drawCanvas() */
}

document.onkeydown = checkKey;