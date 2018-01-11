var htmlCanvas = document.getElementById("canvas"), context = htmlCanvas.getContext('2d'), player;

/**
 * Basic Animation Steps: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations#Basic_animation_steps
 */

function createImage(src, x, y, angle) {
    var img = new Image();
    img.src = src;
    img.width = 100;
    img.height = 100;
    this["x"] = x;
    this["y"] = y;
    this["image"] = img;
    this["angle"] = angle;
    return this;
}

function drawCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(500,500);
    context.rotate(2 *Math.PI/180);
    context.translate(-50,-50);
    context.drawImage(player["image"], 0, 0);
    //i know what the problem is... it's rotating around the corner, not the center.
    context.restore();
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') { // up arrow
        player["y"] = player["y"] - 1;
        player["angle"] = 0;
    }
    else if (e.keyCode == '40') { // down arrow
        player["y"] = player["y"] + 1;
        player["angle"] = 180;
    }
    else if (e.keyCode == '37') { // left arrow
        player["x"] = player["x"] - 1;
        player["angle"] = 270;
    }
    else if (e.keyCode == '39') { //right arrow
        player["x"] = player["x"] + 1;
        player["angle"] = 90;
    }
    drawCanvas();
}


window.onload = function(){
    htmlCanvas.width = window.innerWidth;
    htmlCanvas.height = window.innerHeight;

    player = createImage("bug.png", 100, 100, 0);
    player["image"].onload = function () {
        context.drawImage(player["image"], player["x"], player["y"]);
    }
}

document.onkeydown = checkKey;