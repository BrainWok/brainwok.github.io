var tooltip = document.getElementById("tooltip");
var tooltip_x = document.getElementById("tooltip_x");
var tooltip_y = document.getElementById("tooltip_y");
var coord = document.getElementById("coord");
var container = document.getElementsByClassName("blocks-container")[0];
var last_x = -1;
var last_y = -1;
var blocks = [];

var width = 16384;
var height = 16384;

let casesCouleur = [
//A trouver pour l'énigme
 //1re recherche
  ["m48_303837","4.072ap406","0,255,0","Kyan"],
 //2e recherche
  ["0b-ennb#5_","bp#_bt!oes","0,255,0","Elephant #1"],
  ["!r@n#4_een","_e#_0lsr$x","0,255,0","Elephant #2"],
  ["22$v#f_-01","vso#_fub-i","0,255,0","Elephant #3"],
//Refs UBM
  ["unebonnebo","utique_com","255,0,0","Mug UBM"],
  ["x0-#o98eyl","_e#_0lsr$x","255,0,0","Navo"],
  ["cp4luiki-f","0cherch@_i","255,0,0","Charlie"],
  ["$pa.dut0o_","la@_dzol3y","255,0,0","Laura Felpin"],
  ["44uv-n3!b@","?44n0ns@!m","255,0,0","Penelope Bagieu"],
//Incrustations
 // Objets
  ["7g8nolkfs$","#3$r0m-zat","255,0,0","Borne Incendie"],
  ["88j7#b5vwm","28#2-8vql0","255,0,0","Noix"],
  ["88j7#b5vwm","r$tk.t7p2o","255,0,0","Chapeau Shérif"],
 // Déguisements
  ["17a16_!29#","#h##.5?v#-","255,0,0","Cône"],
  ["#$5#lj_#f_","czo$l.#3s$","255,0,0","Lampe de Génie"],
  ["zrpj4x.vh$","sq_9v8ol$#","255,0,0","Bière Corona"],
 // Cinéma
  ["iw_.w--gl3","dggwitbkak","255,0,0","Stormtrooper"],
  ["88j7#b5vwm","c8bk#g1v@-","255,0,0","RoboCop"],
 //Animaux
  ["ou.qp#j?q-","mj@7bgjdvy","255,0,0","Chat"],
 //Objets sur la tête
  ["$ltd_4l#2z","c_wfg#4yj3","255,0,0","Sceau sur la tête"]
 //Autre
  [".mkz4_9_r$","@z3#_531u!","255,0,0","Pizza"],
  ["7g8nolkfs$","!?#whpqjzr","255,0,0","Homme qui tombe"],
  ["bvy2#xk!f#","0vry5i5e8b","255,0,0","Chaise roulante"],
  ["ge-9ep9##u","8_$2tl2d1k","255,0,0","Pelleteuse"], 
  ["cxus5zni5o","j_h335xqk.","255,0,0","Loupe"],
  ["@l#gy33##e","664--wcane","255,0,0","Oignon"],
  ["-7g4pvs80.","ahi3yh-lo_","255,0,0","Briques"]
];

function stopWheelZoom(event) {
    if (event.ctrlKey == true) {
        event.preventDefault();
    }
}

function stopKeyZoom(event) {
    if (event.ctrlKey && [48, 61, 96, 107, 109, 187, 189].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
}

function onMouseMove(e) {
    if (e.pageX > 0 && e.pageX < width && e.pageY > 0 && e.pageY < height) {

        if(e.pageX < width - 256) {
            tooltip.style.left = (e.clientX + 8) + "px";
        } else {
            tooltip.style.left = (e.clientX - 138) + "px";
        }

        if(e.pageY < height - 256) {
            tooltip.style.top = (e.clientY - 10) + "px";
        } else {
            tooltip.style.top = (e.clientY - 25) + "px";
        }

        var block_x = Math.floor(e.pageX / 64);
        var block_y = Math.floor(e.pageY / 64);

        if(block_x != last_x || block_y != last_y)
        {
            createBlockAtPosition(block_x, block_y);
            tooltip.style.display = "block";
            var text_x = x[block_x];
            var text_y = y[block_y];
            tooltip_x.innerText = text_x;
            tooltip_y.innerText = text_y;
            let objectName = "";
            for (var i = 0; i < casesCouleur.length; i++) {
                if (casesCouleur[i][0] == text_x && casesCouleur[i][1] == text_y) {
                    objectName = casesCouleur[i][3] + " - ";
                }
            }
            coord.innerText = objectName+"(" + block_x.toString() + ", " + block_y.toString() + ")";

            last_x = block_x;
            last_y = block_y;
        }
    } else {
        tooltip.style.display = "none";
        last_x = -1;
        last_y = -1;
    }
}

function createBlockAtPosition(x, y)
{
    var blockNode = document.createElement("div");
    blockNode.classList.add("block");
    blockNode.style.left = (x * 64) + "px";
    blockNode.style.top = (y * 64) + "px";
    container.append(blockNode);
    blocks.push({
        node: blockNode,
        x: x,
        y: y
    });
}

function hasBlockAtPosition(x, y) {

    blocks.forEach(block => {
        if(block.x == x && block.y == y) return true;
    });

    return false;
}

function removeTransparentBlocks() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if(window.getComputedStyle(blocks[i].node).opacity <= 0.01)
        {
            blocks[i].node.remove();
            blocks.splice(i, 1);
        }
    }
}

function update()
{
    removeTransparentBlocks();
    setTimeout(update, 100);
}

function onMouseOut(e) {
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
        tooltip.style.display = "none";
    }
}

function makeGrid(gSize) {
    for (j = 0; j < gSize; j++) {
        let row = document.createElement("div");
        container.appendChild(row).className = "gridRow";
        for (i = 0; i < gSize; i++) {
      	    let newCell = document.createElement("div");
 			row.appendChild(newCell).className = "cell";
        }
    }
    for (k = 0; k < casesCouleur.length; k++) {
      let caseX = x.indexOf(casesCouleur[k][0]);
      let caseY = y.indexOf(casesCouleur[k][1]);
      if (caseX != -1 && caseY != -1) {
        let caseEl = document.querySelector(".blocks-container > .gridRow:nth-child("+(caseY + 1).toString()+") > .cell:nth-child("+(caseX + 1).toString()+")");
        caseEl.style.backgroundColor = "rgba("+casesCouleur[k][2]+",0.3)";
        caseEl.style.border = "5px solid rgb("+casesCouleur[k][2]+")";
      }
    }
}

function loadMenu() {
  let menu = document.getElementById("obj_menu");
  for (i = 0; i < casesCouleur.length; i++) {
    menu.insertAdjacentHTML( 'beforeend', "<li><a href=\"#\" onclick=\"scrollToXY(\'"+casesCouleur[i][0]+"\',\'"+casesCouleur[i][1]+"\');return false;\">"+casesCouleur[i][3]+"</a></li>" );       
  }
}

document.addEventListener("DOMContentLoaded", function() {
    update();
    makeGrid(256);
    loadMenu();
});

document.addEventListener("keydown", stopKeyZoom);
document.addEventListener('mousewheel', stopWheelZoom);
document.addEventListener('DOMMouseScroll', stopWheelZoom);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseout', onMouseOut);
