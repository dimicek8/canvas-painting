const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");
let isMouseDown = false;

canv.width = window.innerWidth;
canv.height = window.innerHeight;

grad = ctx.createLinearGradient(0, 0, 600, 0);

grad.addColorStop(0, "red");
grad.addColorStop(0.8, "green");
grad.addColorStop(1, "magenta");

const textHeading = {
    fillStyle: grad,
    textAlign: "center",
    font: "100px Courier New",
    text: "Paint here",
    x: canv.width / 2,
    y: 100
}

function textRefresh(ctx, textHeading) {
    ctx.fillStyle = textHeading.fillStyle;
    ctx.textAlign = textHeading.textAlign;
    ctx.font = textHeading.font;
    ctx.fillText(textHeading.text, textHeading.x, textHeading.y);
}

textRefresh(ctx, textHeading);

let coords = [];

canv.addEventListener("mousedown", function(event) {
    isMouseDown = true;
})
canv.addEventListener("mouseup", function(event) {
    isMouseDown = false;
    ctx.beginPath();
    coords.push(0);
})


canv.addEventListener("mousemove", function(event) {
    if (isMouseDown) {
        coords.push([event.clientX, event.clientY]);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 30;
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(event.clientX, event.clientY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
    }
});


function save() {
    localStorage.setItem("coords", JSON.stringify(coords));
}

function clear() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function replay() {
    let drawTimer = setInterval(function() {
        if (!coords.length) {
            clearInterval(drawTimer);
            ctx.beginPath();
            return;
        } 
            let crd = coords.shift();
            let event = {
                clientX: crd["0"],
                clientY: crd["1"]
            };
            ctx.strokeStyle = grad;
            ctx.lineWidth = 30;
            ctx.lineTo(event.clientX, event.clientY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(event.clientX, event.clientY, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(event.clientX, event.clientY);
        
    }, 5)
}

document.addEventListener("keydown", function(event) {
    if (event.key === "s") {
        save();
        console.log("Saved");
    }
    if (event.key === "r") {
        coords = JSON.parse(localStorage.getItem("coords"));
        clear();
        textRefresh(ctx, textHeading);
        replay();
        console.log("Replaying...");
    }
    if (event.key === "c") {
        clear();
        textRefresh(ctx, textHeading);
    }
})

document.getElementById("save-button").addEventListener("click", function(event) {
    save();
})

document.getElementById("replay-button").addEventListener("click", function(event) {
    coords = JSON.parse(localStorage.getItem("coords"));
        clear();
        textRefresh(ctx, textHeading);
        replay();
})

document.getElementById("clear-button").addEventListener("click", function(event) {
        clear();
        textRefresh(ctx, textHeading);
        console.log("Clear")
})