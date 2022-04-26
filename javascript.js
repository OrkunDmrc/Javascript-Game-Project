var startButton = document.getElementById("basla");
var nextButton = document.getElementById("sonrakiLevel");
var replayButton = document.getElementById("yenidenBasla");
var tryagainButton = document.getElementById("tekrarDene");
var tryagainTitle = document.getElementById("bitti");
var mainMusic = document.getElementById("anaMuzik");
var jumpingSound = document.getElementById("ziplamaSesi");
var moneySound = document.getElementById("paraSesi");
var deadSound = document.getElementById("yanmaSesi");
var scoreText = document.getElementById("score");
var enerjiText = document.getElementById("enerji");
var point = 0;

var canvas =/**@type {HTMLCanvasElement} */ (document.getElementById("game-canvas"));
var ctx = canvas.getContext("2d");

var level = 0, section = 1, borderOfSection = 572;
var i = 0;
var char = new Image();

function startGame(){
    level = 1;
    tryagainTitle.style.display = "none";
    startButton.style.display = "none";
    scoreText.style.display = "block";
    enerjiText.style.display = "block";
    mainMusic.loop = true;
    mainMusic.play();
}

var diamond = new Image();
diamond.src = "tile/tile_0067.png";
var tile = new Image();
tile.src = "tiles.png";

var startScreen = new Image();
startScreen.src = "Oyun/startScreen.jpg";

var tus = { };
		
addEventListener("keydown",function(ev){
    tus[ev.keyCode] = true;
});

addEventListener("keyup",function(ev){
    delete tus[ev.keyCode]; //diziden siler
});

var charPosX = 25;
var charPosY = 50;
var health = 3; 

var moveSpeed;
var charMove = {
    moveSpeed:1
};

var coordinate = function(){
    charMove.x = charPosX;
    charMove.y = charPosY;
};

function levelUp(){
    level++;
    nextButton.style.display = "none";
    tryagainTitle.style.display = "none";
    prepareToDie();
}

function replay(){
    level = 1;
    replayButton.style.display = "none";
    tryagainButton.style.display = "none";
    tryagainTitle.style.display = "none";
    point = 0;
    canvas.style.background = "#dff6f5";
    prepareToDie();
}

function prepareToDie(){
    section = 1;
    borderOfSection = 572;
    charMove.x = 25;
    charMove.y = 50;
    charMove.moveSpeed = 1;
    platformX = 0;
    floorIndex = 0;
    charVirtualPosX = charPosX;
    energy = 1000;
    onFloor = false;
    isWorked = false;
    virtualPointsStartX = [];
    virtualPointsEndX = [];
    floors = [];
    countPoint = 0;
    virtualDiamondPosX = [];
    virtualDiamondPosY = [];
    diamondIsCollected = [];
    diamondIndex = 0;
    frame = requestAnimationFrame(update);
    isLevelUp = false;
    isGameOver = false;
    xRight = false;
    enemyPxX = 0; 
    enemyPxY = 0;
    xMove = 0; 
    yMove = 0;
    mainMusic.play();
}

var platformX = 0, floorIndex = 0;
var charVirtualPosX = charPosX;
var energy = 1000, onFloor = false;
var movement = function (){
    if(borderOfSection < charVirtualPosX){
        borderOfSection += 572;
        charMove.moveSpeed = charMove.moveSpeed + 0.3;
        section++;
        if(section >= 6){
            isLevelUp = true;
            switch(level){
                case 1:
                    canvas.style.background = "#ffeab4";
                    nextButton.style.display = "inline-block";
                    tryagainTitle.innerHTML = "Flying Creature Sabri";
                    tryagainTitle.style.display = "inline-block";
                    break;
                case 2:
                    canvas.style.background = "#bf51fe";
                    nextButton.style.display = "inline-block";
                    tryagainTitle.innerHTML = "Flying Creature Sabri";
                    tryagainTitle.style.display = "inline-block";
                    break;
                case 3:
                    canvas.style.background = "#fdac97";
                    nextButton.style.display = "inline-block";
                    tryagainTitle.innerHTML = "Flying Creature Sabri";
                    tryagainTitle.style.display = "inline-block";
                    break;
                case 4:
                    canvas.style.background = "#dff6f5";
                    replayButton.style.display = "inline-block";
                    tryagainTitle.innerHTML = "Tebrikler";
                    tryagainTitle.style.display = "inline-block";
                    break;
            }
        }
    }
 
    //yukari 38 asagi 40 sol 37 sag 39
    //hangi platformun üstünde olduğunu bulur
    for(var i=0;i<countPoint;i++){
        if(virtualPointsStartX[i] <= charVirtualPosX && virtualPointsEndX[i] > charVirtualPosX + 22){
            floorIndex = i;
            break;
        }
    }
    //sol
    if(37 in tus){
        if(charMove.x > 10){
            charVirtualPosX -= charMove.moveSpeed;
            charMove.x -= charMove.moveSpeed;
        }
    }
    //sag
    if(39 in tus){
        if(charMove.x < 44){
            charMove.x += charMove.moveSpeed;
        }
        else{
            platformX += charMove.moveSpeed;
        }
        charVirtualPosX += charMove.moveSpeed;
        
    }
    //yukarı
    if(38 in tus && energy > 0){
        charMove.y -= 2;
        energy -= 2;
        jumpingSound.play();
    }
    /*Yer Çekimi*/
    if(floors[floorIndex] > charMove.y + 22 || floors[floorIndex] < charMove.y + 22){
        charMove.y += 1;
    }else if(energy < 1000){
        energy++;
    }
    if(charMove.y > 175){
        gameOver();
    }
    /*elmas toplama*/
    for(var i=0;i<36;i++){
        if(diamondIsCollected[i] == false){
            if(charVirtualPosX <= (virtualDiamondPosX[i] + 20) && charMove.y <= (virtualDiamondPosY[i] + 20) && virtualDiamondPosX[i] <= (charVirtualPosX + 20) && virtualDiamondPosY[i] <= (charMove.y + 20)){
                diamondIsCollected[i] = true;
                point++;
                moneySound.play();
                break;
            }
        }
    }
    /*düşmana çarpma*/ 
    if(charMove.x <= (enemyPxX + 20) && charMove.y <= (enemyPxY + 20) && enemyPxX <= (charMove.x + 20) && enemyPxY <= (charMove.y + 15)){
        gameOver();
    }
}

function gameOver(){
    isGameOver = true;
    tryagainButton.style.display = "block";
    tryagainTitle.innerHTML = "Oyun Bitti";
    tryagainTitle.style.display = "inline-block";
    mainMusic.pause();
    deadSound.play();
}

var isGameOver = false;
var isLevelUp = false;
var update = function(){
    if(isLevelUp || isGameOver){
        cancelAnimationFrame(frame);
    }else{
        frame = requestAnimationFrame(update);
    }
    movement();
    drawAll();
}

var drawAll = function (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLevel();
};

function enemyMovement(x,y){
    if(xMove > 66){
        xRight = false;
    }else if(xMove < 0){
        xRight = true;
    }
    if(xRight){
        xMove++;
    }else{
        xMove--;
    }
    enemyPxX = x - xMove;
    enemyPxY = y;
}

var blockSrc = "tile/tile";
var enemyPxX = 0, enemyPxY = 0;
var xMove = 0, yMove = 0, xRight = false;
var drawBlock = function (blockX = 0, blockY = 0, block = 0, type = 0){
    var x = blockX * 22 - platformX, y = blockY * 22;
    if(x < 400 && x > -100){
        switch(type){
            case 0:
                var blockImg = new Image();
                switch(block){
                    case 122:
                        blockImg.src = "tile/tile_0122.png";
                        break;
                    case 22:
                        blockImg.src = "tile/tile_0022.png";
                        break;
                    case 121:
                        blockImg.src = "tile/tile_0121.png";
                        break;
                    case 123:
                        blockImg.src = "tile/tile_0123.png";
                        break;
                    case 53:
                        blockImg.src = "tile/tile_0053.png";
                        break;
                    case 73:
                        blockImg.src = "tile/tile_0073.png";
                        break;
                    case 133:
                        blockImg.src = "tile/tile_0133.png";
                        break;
                    case 102:
                        blockImg.src = "tile/tile_0102.png";
                        break;
                    case 62:
                        blockImg.src = "tile/tile_0062.png";
                        break;
                    case 154:
                        blockImg.src = "tile/tile_0154.png";
                        break;
                    case 78:
                        blockImg.src = "tile/tile_0078.png";
                        break;
                    case 126:
                        blockImg.src = "tile/tile_0126.png";
                        break;
                    case 29:
                        blockImg.src = "tile/tile_0029.png";
                        break;
                    case 1:
                        blockImg.src = "tile/tile_0001.png";
                        break;
                    case 2:
                        blockImg.src = "tile/tile_0002.png";
                        break;
                    case 3:
                        blockImg.src = "tile/tile_0003.png";
                        break;
                    case 61:
                        blockImg.src = "tile/tile_0061.png";
                        break;
                    case 63:
                        blockImg.src = "tile/tile_0063.png";
                        break;
                    case 77:
                        blockImg.src = "tile/tile_0077.png";
                        break;
                    case 79:
                        blockImg.src = "tile/tile_0079.png";
                        break;
                    default:
                        blockSrc = "tile/tile"
                        if(block < 10){
                            blockImg.src = blockSrc.concat("_000",block,".png");
                            //blockImg.src = "" + groupName + "/" + groupName + "_000" + block +".png";
                        }else if(block < 100){
                            blockImg.src = blockSrc.concat("_00",block,".png");
                            //blockImg.src = "" + groupName + "/" + groupName + "_00" + block +".png";
                        }else{
                            blockImg.src = blockSrc.concat("_0",block,".png");
                            //blockImg.src = "" + groupName + "/" + groupName + "_0" + block +".png";
                        }
                        break;
                }
                ctx.drawImage(blockImg, x, y,22,22);
                break;
            case 1:
                for(var i=0;i<4;i++){
                    if(block * 4 <= diamondIndex){
                        diamondIndex = (block - 1) * 4; 
                    }
                    if(diamondIsCollected[diamondIndex] == false){
                        ctx.drawImage(diamond, x + 22 * i, y);
                    }
                    diamondIndex++;
                }
                break;
                case 2:
                    var blockImg = new Image();
                    var time = new Date();
                    switch(block){
                        case 6:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0006.png";
                            }
                            else{
                                blockImg.src = "character/character_0007.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 12:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0012.png";
                            }
                            else{
                                blockImg.src = "character/character_0011.png";
                            }
                            yMove++;
                            enemyPxX = x;
                            enemyPxY = y - yMove;
                            break;
                        case 0:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0000.png";
                            }
                            else{
                                blockImg.src = "character/character_0001.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 2:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0002.png";
                            }
                            else{
                                blockImg.src = "character/character_0003.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 8:
                            blockImg.src = "character/character_0008.png";
                            enemyMovement(x,y);
                            break;
                        case 16:
                            if(time.getSeconds()%4==0){
                                blockImg.src = "character/character_0016.png";
                            }
                            else if(time.getSeconds()%4==1||time.getSeconds()%4==3){
                                blockImg.src = "character/character_0015.png";
                            }
                            else{
                                blockImg.src = "character/character_0017.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 9:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0009.png";
                            }
                            else{
                                blockImg.src = "character/character_0010.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 14:
                            if(time.getMilliseconds() < 500){
                                blockImg.src = "character/character_0014.png";
                            }
                            else{
                                blockImg.src = "character/character_0013.png";
                            }
                            enemyPxX = x;
                            enemyPxY = y;
                            break;
                        case 26:
                            if(time.getMilliseconds() <= 250){
                                blockImg.src = "character/character_0024.png";
                            }
                            else if((time.getMilliseconds() > 250 && time.getMilliseconds() <= 500) ||(time.getMilliseconds() > 750 )){
                                blockImg.src = "character/character_0025.png";
                            }
                            else if(time.getMilliseconds() > 500 && time.getMilliseconds() < 750){
                                blockImg.src = "character/character_0026.png";
                            }
                            enemyMovement(x,y);
                            break;
                        case 19:
                            if(time.getSeconds()%4==0){
                                bblockImg.src = "character/character_0019.png";
                            }
                            else if(time.getSeconds()%4==1||time.getSeconds()%4==3){
                                blockImg.src = "character/character_0018.png";
                            }
                            else{
                                blockImg.src = "character/character_0020.png";
                            }
                            enemyPxX = x;
                            enemyPxY = y;
                            break;
                        default:
                            break;
                    }
                ctx.drawImage(blockImg, enemyPxX, enemyPxY);
                if(enemyPxY < 0){
                    yMove = 0;
                }
                break;
            case 3:
                break;
            default:
                break;
        }
        
    }
}

var virtualPointsStartX = [], virtualPointsEndX = [];
var floors = [];
var countPoint = 0;
function defineCollider(pointStartX = 0, pointEndX = 0, floor = 0){
    virtualPointsStartX[countPoint] = pointStartX * 22;
    virtualPointsEndX[countPoint] = pointEndX * 22 + 22;
    floors[countPoint] = floor * 22;
    //alert("virtualPointsX[" + countPoint + "] = " + virtualPointsX[countPoint]);
    countPoint = countPoint + 1;
}

var virtualDiamondPosX = new Array(36), virtualDiamondPosY = new Array(36);
var diamondIsCollected = new Array(36), diamondIndex = 0;
function defineDiamonds(pointStartX = 0,floor = 0){
    for(var i=0;i<4;i++){
        virtualDiamondPosX[diamondIndex] = pointStartX * 22 + 22 * i;
        virtualDiamondPosY[diamondIndex] = floor * 22;
        diamondIsCollected[diamondIndex] = false;
        //console.log(virtualDiamondPosX[diamondIndex]);
        diamondIndex++;
    }
    if(diamondIndex >= 36){
        diamondIndex = 0;
    }
}

coordinate();
var frame = requestAnimationFrame(update);

var isWorked = false;
var drawLevel = function (){
    switch(level){
        case 0:
            ctx.drawImage(startScreen,0,0);
            break;
        case 1:
            if(!isWorked){
                //aşağı inişte sonu 1 arttır
                defineCollider(0,6,6);
                defineCollider(7,10,7);
                defineCollider(10,13,9);
                defineCollider(13,26,7);
                defineCollider(26,32,8);
                defineCollider(32,34,9);
                defineCollider(34,39,5);
                defineCollider(39,40,9);
                defineCollider(40,47,6);
                defineCollider(47,49,9);
                defineCollider(49,56,8);
                defineCollider(56,60,9);
                defineCollider(60,67,6);
                defineCollider(67,71,5);
                defineCollider(71,76,6);
                defineCollider(76,85,9);
                defineCollider(85,98,6);
                defineCollider(98,100,9);
                defineCollider(100,107,5);
                defineCollider(107,108,9);
                defineCollider(108,115,7);
                defineCollider(115,122,6);
                defineCollider(122,127,7);
                defineCollider(127,131,5);

                defineDiamonds(21,5);
                defineDiamonds(42,3);
                defineDiamonds(51,6);
                defineDiamonds(79,4);
                defineDiamonds(92,4);
                defineDiamonds(102,3);
                defineDiamonds(110,6);
                defineDiamonds(117,4);
                defineDiamonds(124,4);
                isWorked = true;
            }
            scoreText.innerHTML = "Score = " + point;
            enerjiText.innerHTML = "Enerji = " + energy;
            /*ctx.font = "10px Arial";
            ctx.fillText("Score = " + point, 20, 20);
            ctx.fillText("Enerji = " + energy, 20, 40);*/
            
            drawLevel1();
            drawChar();
            break;
        case 2:
            if(!isWorked){
                //aşağı inişte sonu 1 arttır
                defineCollider(0,9,6);
                defineCollider(9,17,5);
                defineCollider(17,21,4);
                defineCollider(21,27,6);
                defineCollider(27,33,5);
                defineCollider(33,35,9);
                defineCollider(35,41,4);
                defineCollider(41,44,9);
                defineCollider(44,54,4);
                defineCollider(54,56,5);
                defineCollider(56,63,5);
                defineCollider(63,65,9);
                defineCollider(65,84,5);
                defineCollider(84,88,7);
                defineCollider(88,89,9);
                defineCollider(89,94,7);
                defineCollider(94,95,9);
                defineCollider(95,100,8);
                defineCollider(100,101,9);
                defineCollider(101,106,7);
                defineCollider(106,107,9);
                defineCollider(107,113,7);
                defineCollider(113,116,4);
                defineCollider(116,128,7);
                defineCollider(128,131,4);

                defineDiamonds(12,4);
                defineDiamonds(32,3);
                defineDiamonds(47,3);
                defineDiamonds(62,3);
                defineDiamonds(85,5);
                defineDiamonds(93,4);
                defineDiamonds(99,4);
                defineDiamonds(116,2);
                isWorked = true;
            }
            scoreText.innerHTML = "Score = " + point;
            enerjiText.innerHTML = "Enerji = " + energy;
            drawLevel2();
            drawChar();
            break;
        case 3:
            if(!isWorked){
                //aşağı inişte sonu 1 arttır
                defineCollider(0,14,7);
                defineCollider(14,16,9);
                defineCollider(16,21,6);
                defineCollider(21,22,9);
                defineCollider(22,27,4);
                defineCollider(27,28,9);
                defineCollider(28,33,6);
                defineCollider(33,35,9);
                defineCollider(35,58,7);
                defineCollider(58,68,5);
                defineCollider(68,70,9);
                defineCollider(70,75,5);
                defineCollider(75,77,9);
                defineCollider(77,83,3);
                defineCollider(83,86,9);
                defineCollider(86,90,4);
                defineCollider(90,92,9);
                defineCollider(92,96,4);
                defineCollider(96,98,9);
                defineCollider(98,105,4);
                defineCollider(105,113,7);
                defineCollider(113,115,9);
                defineCollider(115,120,6);
                defineCollider(120,122,9);
                defineCollider(122,131,7);

                defineDiamonds(23,2);
                defineDiamonds(33,4);
                defineDiamonds(46,5);
                defineDiamonds(61,4);
                defineDiamonds(74,2);
                defineDiamonds(89,2);
                defineDiamonds(108,6);
                isWorked = true;
            }
            scoreText.innerHTML = "Score = " + point;
            enerjiText.innerHTML = "Enerji = " + energy;
            drawLevel3();
            drawChar();
            break;
        case 4:
            if(!isWorked){
                //aşağı inişte sonu 1 arttır
                defineCollider(0,6,3);
                defineCollider(6,9,4);
                defineCollider(9,12,5);
                defineCollider(12,15,6);
                defineCollider(15,18,7);
                defineCollider(18,20,9);
                defineCollider(20,25,6);
                defineCollider(25,27,9);
                defineCollider(27,32,4);
                defineCollider(32,33,9);
                defineCollider(33,38,8);
                defineCollider(38,39,9);
                defineCollider(39,44,6);
                defineCollider(44,47,9);
                defineCollider(47,53,4);
                defineCollider(53,57,6);
                defineCollider(57,59,9);
                defineCollider(59,65,6);
                defineCollider(65,71,9);
                defineCollider(71,77,5);
                defineCollider(77,80,9);
                defineCollider(80,85,5);
                defineCollider(85,88,9);
                defineCollider(88,93,4);
                defineCollider(93,94,9);
                defineCollider(94,99,2);
                defineCollider(99,100,9);
                defineCollider(100,104,4);
                defineCollider(104,105,9);
                defineCollider(105,117,6);
                defineCollider(117,119,9);
                defineCollider(119,124,4);
                defineCollider(124,126,9);
                defineCollider(126,131,4);

                defineDiamonds(17,4);
                defineDiamonds(25,3);
                defineDiamonds(31,3);
                defineDiamonds(40,4);
                defineDiamonds(56,4);
                defineDiamonds(66,4);
                defineDiamonds(77,3);
                defineDiamonds(89,3);
                defineDiamonds(109,5);
                isWorked = true;
            }
            scoreText.innerHTML = "Score = " + point;
            enerjiText.innerHTML = "Enerji = " + energy;
            drawLevel4();
            drawChar();
            break;
        case 5:
            var kupa = new Image();
            kupa.src="Oyun/award.png";
            ctx.drawImage(kupa,120,10,100,100);
            break;
        default:
            break;            
    }
}

function drawChar(){
    var time = new Date();
    if(time.getMilliseconds() < 500){
        char.src = "character/character_0004.png";
    }
    else{
        char.src = "character/character_0005.png";
    }
    if(!isLevelUp){
        ctx.drawImage(char,charMove.x,charMove.y,22,22);
    }
}

function drawLevel1(){
    switch(section){
        case 1:
            /*------------platform------------*/
            drawBlock(0,6,21);
            drawBlock(0,7,121);
            drawBlock(0,8,121);
            for(i=1;i<6;i++){
                drawBlock(i,6,22);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(6,6,23);
            drawBlock(6,7,24);
            drawBlock(6,8,122);
            drawBlock(7,7,22);
            drawBlock(7,8,122);
            drawBlock(8,7,22);
            drawBlock(8,8,122);
            drawBlock(9,7,23);
            drawBlock(9,8,123);
            drawBlock(14,7,21);
            drawBlock(14,8,121);
            /*------------dusmanlar-----------*/
            drawBlock(24,6,6,2);
            passingLevelSection1To2();
            break;
        case 2:
            /*------------platform------------*/
            passingLevelSection1To2();
            //2 block boşluk, y de 6. block
            drawBlock(41,6,1);
            for(i=42;i<46;i++){
                drawBlock(i,6,2);
            }
            drawBlock(46,6,3);
            /*------------dusmanlar-----------*/
            drawBlock(45,5,6,2);
            passingLevelSection2To3();
            break;
        case 3:
            /*------------platform------------*/
            passingLevelSection2To3();
            drawBlock(68,5,21);
            drawBlock(68,6,121);
            drawBlock(68,7,25);
            drawBlock(68,8,122);
            drawBlock(69,5,22);
            drawBlock(69,6,122);
            drawBlock(69,7,122);
            drawBlock(69,8,122);
            drawBlock(70,5,23);
            drawBlock(70,6,123);
            drawBlock(70,7,123);
            drawBlock(70,8,123);
            for(i=71;i<75;i++){
                drawBlock(i,6,133);
            }
            drawBlock(75,6,94);
            passingLevelSection3To4();
            
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 4:
            /*------------platform------------*/
            passingLevelSection3To4();
            drawBlock(97,6,23);
            drawBlock(97,7,123);
            drawBlock(97,8,123);
            passingLevelSection4To5();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 5:
            /*------------platform------------*/
            passingLevelSection4To5();
            drawBlock(121,6,3);
            drawBlock(123,7,93);
            for(i=124;i<128;i++){
                drawBlock(i,7,133);
            }
            drawBlock(128,5,93);
            drawBlock(128,6,115);
            drawBlock(128,7,114);
            drawBlock(129,5,21);
            drawBlock(129,6,121);
            drawBlock(129,7,121);
            drawBlock(129,8,121);
            for(i=130;i<145;i++){
                drawBlock(i,5,22);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/
            //bayrak
            drawBlock(130,3,112);
            drawBlock(130,4,131);
            //bayrak
            break;
        default:
            break;
    }
}

function drawLevel2(){
    switch(section){
        case 1:
            /*------------platform------------*/
            for(i=0;i<10;i++){
                drawBlock(i,6,62);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
                    
            }
            drawBlock(10,5,61);
            drawBlock(10,6,122);
            drawBlock(10,7,122);
            drawBlock(10,8,122);
            for(i=11;i<16;i++){
                drawBlock(i,5,62);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(16,4,125);
            drawBlock(16,5,63);
            drawBlock(16,6,123);
            drawBlock(16,7,123);
            drawBlock(16,8,123);
            drawBlock(18,4,41);
            drawBlock(19,3,128);
            drawBlock(19,4,42);
            drawBlock(20,4,43);
            for(i=17;i<22;i++){
                drawBlock(i,6,53);
                drawBlock(i,7,73);
                drawBlock(i,8,73);
            }
            passingLevelSection1To2();
            /*------------dusmanlar-----------*/
            break;
        case 2:
            /*------------platform------------*/
            passingLevelSection1To2();
            drawBlock(44,4,61);
            drawBlock(44,5,121);
            drawBlock(44,6,121);
            drawBlock(44,7,121);
            drawBlock(45,3,129);
            for(i=45;i<51;i++){
                drawBlock(i,4,62);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
            }
            drawBlock(47,6,44);
            drawBlock(50,6,44);
            passingLevelSection2To3();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 3:
            /*------------platform------------*/
            passingLevelSection2To3();
            for(i=66;i<75;i++){
                drawBlock(i,6,53);
                drawBlock(i,7,73);
                drawBlock(i,8,73);
            }
            drawBlock(66,5,93);
            drawBlock(66,6,73);
            for(i=67;i<75;i++){
                drawBlock(i,5,133);
            }
            drawBlock(75,4,125);
            drawBlock(75,5,61);
            drawBlock(75,6,121);
            drawBlock(75,7,121);
            drawBlock(75,8,121);
            passingLevelSection3To4();
            
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 4:
            /*------------platform------------*/
            passingLevelSection3To4();
            drawBlock(96,8,153);
            drawBlock(97,8,154);
            drawBlock(98,8,154);
            drawBlock(99,8,155);
            passingLevelSection4To5();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 5:
            /*------------platform------------*/
            passingLevelSection4To5();
            for(i=117;i<129;i++){
                drawBlock(i,7,62);
                drawBlock(i,8,122);
            }
            drawBlock(128,4,71);
            drawBlock(128,5,71);
            drawBlock(128,6,71);
            for(i=129;i<145;i++){
                drawBlock(i,4,62);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/
            //bayrak
            drawBlock(130,2,112);
            drawBlock(130,3,131);
            drawBlock(131,3,130);
            drawBlock(131,2,110);
            //bayrak
            break;
        default:
            break;
    }
}

function drawLevel3(){
    switch(section){
        case 1:
            /*------------platform------------*/
            for(i=0;i<13;i++){
                drawBlock(i,7,102);
                drawBlock(i,8,122);
            }
            drawBlock(6,6,64);
            drawBlock(9,6,145);
            drawBlock(13,6,144);
            drawBlock(13,7,103);
            drawBlock(13,8,123);
            drawBlock(17,6,153);
            drawBlock(18,6,154);
            drawBlock(19,6,154);
            drawBlock(20,6,155);
            passingLevelSection1To2();
            /*------------dusmanlar-----------*/
            break;
        case 2:
            /*------------platform------------*/
            passingLevelSection1To2();
            drawBlock(45,7,90);
            passingLevelSection2To3();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 3:
            /*------------platform------------*/
            passingLevelSection2To3();
            drawBlock(67,5,103);
            drawBlock(67,6,123);
            drawBlock(67,7,123);
            drawBlock(67,8,123);
            drawBlock(71,5,153);
            drawBlock(72,5,154);
            drawBlock(73,5,154);
            drawBlock(74,5,155);
            passingLevelSection3To4();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 4:
            /*------------platform------------*/
            passingLevelSection3To4();
            drawBlock(93,4,104);
            drawBlock(94,4,104);
            drawBlock(95,4,104);
            drawBlock(99,4,101);
            drawBlock(99,5,121);
            drawBlock(99,6,121);
            drawBlock(99,7,121);
            drawBlock(99,8,121);
            passingLevelSection4To5();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 5:
            /*------------platform------------*/
            passingLevelSection4To5();
            drawBlock(123,7,101);
            drawBlock(123,8,121);
            for(i=124;i<145;i++){
                drawBlock(i,7,102);
                drawBlock(i,8,122);
            }
            drawBlock(124,6,145);
            drawBlock(126,6,105);
            drawBlock(127,6,105);
            drawBlock(128,6,105);
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/
            //bayrak
            drawBlock(130,5,112);
            drawBlock(130,6,131);
            //bayrak
            break;
        default:
            break;
    }
}

function drawLevel4(){
    switch(section){
        case 1:
            /*------------platform------------*/
            for(i=0;i<6;i++){
                drawBlock(i,3,102);
                drawBlock(i,4,122);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(5,3,103);
            for(i=6;i<9;i++){
                drawBlock(i,4,102);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(8,4,103);
            for(i=9;i<12;i++){
                drawBlock(i,5,102);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(10,4,145);
            drawBlock(11,5,103);
            for(i=12;i<15;i++){
                drawBlock(i,6,102);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(14,6,103);
            for(i=15;i<18;i++){
                drawBlock(i,7,102);
                drawBlock(i,8,122);
            }
            drawBlock(17,6,144);
            drawBlock(17,7,103);
            drawBlock(17,8,123);
            passingLevelSection1To2();
            /*------------dusmanlar-----------*/
            break;
        case 2:
            /*------------platform------------*/
            passingLevelSection1To2();
            drawBlock(40,6,77);
            drawBlock(41,6,78);
            drawBlock(42,6,78);
            drawBlock(42,7,116);
            drawBlock(42,8,116);
            drawBlock(43,6,78);
            drawBlock(44,6,79);   
            passingLevelSection2To3();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 3:
            /*------------platform------------*/
            passingLevelSection2To3();
            drawBlock(72,5,105);
            drawBlock(72,6,71);
            drawBlock(72,7,71);
            drawBlock(72,8,73);
            for(i=73;i<77;i++){
                drawBlock(i,5,105);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            passingLevelSection3To4();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 4:
            /*------------platform------------*/
            passingLevelSection3To4();
            for(i=95;i<99;i++){
                drawBlock(i,2,29);
            }
            passingLevelSection4To5();
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/ 
            break;
        case 5:
            /*------------platform------------*/
            passingLevelSection4To5();
            drawBlock(120,4,153);
            drawBlock(121,4,154);
            drawBlock(122,4,154);
            drawBlock(123,4,155);
            drawBlock(127,4,21);
            drawBlock(127,5,121);
            drawBlock(127,6,121);
            drawBlock(127,7,121);
            drawBlock(127,8,121);
            for(i=128;i<145;i++){
                drawBlock(i,4,22);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(128,3,124);
            /*------------dusmanlar-----------*/

            /*------------arkaplanlar----------------------*/
            //bayrak
            drawBlock(130,2,112);
            drawBlock(130,3,131);
            //bayrak
            break;
        default:
            break;
    }
}

function passingLevelSection1To2(){
    switch(level){
        case 1:
            /*------------platform------------*/
            for(i=15;i<25;i++){
                drawBlock(i,7,22);
                drawBlock(i,8,122);
            }
            drawBlock(25,7,23);
            drawBlock(25,8,24);
            for(i=26;i<31;i++){
                drawBlock(i,8,22);
            }
            drawBlock(31,8,23);
            drawBlock(35,5,21);
            drawBlock(35,6,121);
            drawBlock(35,7,121);
            drawBlock(35,8,121);
            for(i=36;i<38;i++){
                drawBlock(i,5,22);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(38,5,23);
            drawBlock(38,6,123);
            drawBlock(38,7,123);
            drawBlock(38,8,123);
            /*------------elmaslar------------*/
            drawBlock(21,5,1,1);
            /*------------arkaplanlar----------------------*/
            drawBlock(6,5,126);
            drawBlock(14,6,126);
            drawBlock(25,6,126);
            break;
        case 2:
            drawBlock(22,6,61);
            drawBlock(22,7,121);
            drawBlock(22,8,121);
            for(i=23;i<26;i++){
                drawBlock(i,6,62);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(25,5,129);
            drawBlock(26,6,63);
            drawBlock(26,7,123);
            drawBlock(26,8,123);
            for(i=27;i<53;i++){
                drawBlock(i,8,53);
            }
            drawBlock(28,5,77);
            drawBlock(29,5,78);
            drawBlock(30,5,78);
            drawBlock(30,6,116);
            drawBlock(30,7,116);
            drawBlock(31,5,78);
            drawBlock(32,5,79);
            drawBlock(36,4,77);
            drawBlock(37,4,78);
            drawBlock(38,4,78);
            drawBlock(38,5,116);
            drawBlock(38,6,116);
            drawBlock(38,7,116);
            drawBlock(39,4,78);
            drawBlock(40,4,79);
            /*------------elmaslar------------*/
            drawBlock(12,4,1,1);
            drawBlock(32,3,2,1);
            /*------------dusmanlar-----------*/
            drawBlock(15,4,0,2);
            //drawBlock(34,9,12,2);
            //drawBlock(40,3,0,2);
            drawBlock(35,3,26,2);
            break;
        case 3:
            for(i=14;i<40;i++){
                drawBlock(i,8,53);
            }
            drawBlock(23,4,153);
            drawBlock(24,4,154);
            drawBlock(25,4,154);
            drawBlock(26,4,155);
            drawBlock(29,6,153);
            drawBlock(30,6,154);
            drawBlock(31,6,154);
            drawBlock(32,6,155);
            drawBlock(36,7,93);
            drawBlock(36,8,73);
            drawBlock(37,7,133);
            for(i=38;i<45;i++){
                drawBlock(i,7,104);
            }
            /*------------elmaslar------------*/
            drawBlock(23,2,1,1);
            drawBlock(33,4,2,1);
            /*------------dusmanlar-----------*/
            drawBlock(15,9,12,2);
            drawBlock(33,9,12,2);
            break;
        case 4:
            drawBlock(21,6,153);
            drawBlock(22,6,154);
            drawBlock(23,6,154);
            drawBlock(24,6,155);
            drawBlock(28,4,153);
            drawBlock(29,4,154);
            drawBlock(30,4,154);
            drawBlock(31,4,155);
            drawBlock(34,8,153);
            drawBlock(35,8,154);
            drawBlock(36,8,154);
            drawBlock(37,8,155);
            /*------------elmaslar------------*/
            drawBlock(17,4,1,1);
            drawBlock(25,3,2,1);
            drawBlock(31,3,3,1);
            /*------------dusmanlar-----------*/
            drawBlock(20,4,26,2);
            //drawBlock(34,3,26,2);
            break;
        default:
            break;
    }
}

function passingLevelSection2To3(){
    switch(level){
        case 1:
            /*------------platform------------*/
            drawBlock(50,8,21);
            for(i=51;i<55;i++){
                drawBlock(i,8,22);
            }
            drawBlock(55,8,23);
            for(i=56;i<61;i++){
                drawBlock(i,8,53);
            }
            drawBlock(61,6,93);
            drawBlock(61,7,21);
            drawBlock(61,8,121);
            for(i=62;i<68;i++){
                drawBlock(i,6,133);
                drawBlock(i,7,22);
                drawBlock(i,8,122);
            }
            /*------------elmaslar------------*/
            drawBlock(42,3,2,1);
            drawBlock(51,6,3,1);
            /*------------dusmanlar-----------*/
            drawBlock(59,9,12,2);
            /*------------arkaplanlar----------------------*/ 
            drawBlock(41,5,126);
            drawBlock(50,7,126);
            break;
        case 2:
            drawBlock(51,8,53);
            for(i=51;i<53;i++){
                drawBlock(i,4,62);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
            }
            drawBlock(52,3,127);
            drawBlock(52,8,53);
            drawBlock(53,4,63);
            drawBlock(53,5,123);
            drawBlock(53,6,123);
            drawBlock(53,7,123);
            drawBlock(53,8,53);
            for(i=54;i<66;i++){
                drawBlock(i,6,53);
                drawBlock(i,7,73);
                drawBlock(i,8,73);
            }
            drawBlock(57,6,73);
            drawBlock(62,6,73);
            drawBlock(57,5,93);
            for(i=58;i<62;i++){
                drawBlock(i,5,133);
            }
            drawBlock(62,5,94);
            /*------------elmaslar------------*/
            drawBlock(47,3,3,1);
            drawBlock(62,3,4,1);
            /*------------dusmanlar-----------*/
            drawBlock(55,9,12,2);
            //drawBlock(64,9,12,2);
            //drawBlock(69,7,0,2);
            break;
        case 3:
            for(i=40;i<59;i++){
                drawBlock(i,8,53);
            }
            for(i=46;i<51;i++){
                drawBlock(i,7,91);
            }
            drawBlock(51,7,92);
            for(i=52;i<59;i++){
                drawBlock(i,7,104);
            }
            drawBlock(58,5,71);
            drawBlock(58,6,71);
            for(i=59;i<67;i++){
                drawBlock(i,5,102);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(66,4,144);
            /*------------elmaslar------------*/
            drawBlock(46,5,3,1);
            drawBlock(61,4,4,1);
            /*------------dusmanlar-----------*/
            //drawBlock(41,6,16,2);
            //drawBlock(55,6,8,2);
            drawBlock(49,5,26,2);
            drawBlock(65,4,0,2);
            break;
        case 4:
            drawBlock(48,4,77);
            drawBlock(49,4,78);
            drawBlock(50,4,78);
            drawBlock(50,5,117);
            drawBlock(50,6,117);
            drawBlock(50,7,116);
            drawBlock(50,8,116);
            drawBlock(51,4,78);
            drawBlock(52,4,79);
            for(i=51;i<57;i++){
                drawBlock(i,6,119);
            }
            drawBlock(60,6,21);
            drawBlock(60,7,121);
            drawBlock(60,8,121);
            for(i=61;i<64;i++){
                drawBlock(i,6,22);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(64,6,23);
            drawBlock(64,7,123);
            drawBlock(64,8,123);
            drawBlock(61,5,126);
            drawBlock(64,5,124);
            for(i=65;i<72;i++){
                drawBlock(i,8,53);
            }
            /*------------elmaslar------------*/
            drawBlock(40,4,4,1);
            drawBlock(56,4,5,1);
            /*------------dusmanlar-----------*/
            drawBlock(41,4,26,2);
            drawBlock(59,4,26,2);
            break;
        default:
            break;
    }
}

function passingLevelSection3To4(){
    switch(level){
        case 1:
            /*------------platform------------*/
            for(i=71;i<91;i++){
                drawBlock(i,8,53);
            }
            drawBlock(75,8,73);
            drawBlock(75,7,34);
            drawBlock(86,8,73);
            drawBlock(86,7,34);
            //y de 6. block
            drawBlock(86,6,93);
            for(i=87;i<91;i++){
                drawBlock(i,6,133);
            }
            drawBlock(91,6,21);
            drawBlock(91,7,121);
            drawBlock(91,8,121);
            for(i=92;i<97;i++){
                drawBlock(i,6,22);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            /*------------elmaslar------------*/
            drawBlock(79,4,4,1);
            /*------------dusmanlar-----------*/
            //drawBlock(77,9,12,2);
            //drawBlock(84,9,12,2);
            drawBlock(82,4,26,2);
            //drawBlock(96,5,6,2);
            //drawBlock(99,9,12,2);
            /*------------arkaplanlar----------------------*/
            drawBlock(69,4,126);
            break;
        case 2:
            for(i=76;i<82;i++){
                drawBlock(i,5,62);
                drawBlock(i,8,122);
            }
            drawBlock(79,7,88);
            drawBlock(81,7,126);
            drawBlock(82,5,63);
            for(i=5;i<9;i++){
                drawBlock(83,i,71);
            }
            for(i=84;i<87;i++){
                drawBlock(i,7,62);
                drawBlock(i,8,122);
            }
            drawBlock(87,7,63);
            drawBlock(87,8,123);
            drawBlock(90,7,153);
            drawBlock(91,7,154);
            drawBlock(92,7,154);
            drawBlock(93,7,155);
            /*------------elmaslar------------*/
            drawBlock(85,5,5,1);
            /*------------dusmanlar-----------*/
            drawBlock(72,4,2,2);
            //drawBlock(79,7,2,2);
            break;
        case 3:
            for(i=68;i<81;i++){
                drawBlock(i,8,53);
            }
            drawBlock(78,3,77);
            drawBlock(79,3,78);
            drawBlock(80,3,78);
            drawBlock(80,4,116);
            drawBlock(80,5,116);
            drawBlock(80,6,116);
            drawBlock(80,7,116);
            drawBlock(81,2,144);
            drawBlock(81,3,78);
            drawBlock(82,3,79);
            for(i=81;i<99;i++){
                drawBlock(i,7,53);
                drawBlock(i,8,73);
            }
            drawBlock(87,4,104);
            drawBlock(88,4,104);
            drawBlock(89,4,104);
            /*------------elmaslar------------*/
            drawBlock(74,2,5,1);
            drawBlock(89,2,6,1);
            /*------------dusmanlar-----------*/
            //drawBlock(85,8,8,2);
            //drawBlock(97,8,2,2);
            drawBlock(92,2,26,2);
            drawBlock(104,3,9,2);
            break;
        case 4:
            for(i=77;i<100;i++){
                drawBlock(i,8,53);
            }
            drawBlock(81,5,14);
            drawBlock(82,5,13);
            drawBlock(83,5,12);
            drawBlock(83,6,32);
            drawBlock(83,7,32);
            drawBlock(84,5,13);
            drawBlock(85,5,15);
            drawBlock(89,4,153);
            drawBlock(90,4,154);
            drawBlock(91,4,154);
            drawBlock(92,4,155);
            /*------------elmaslar------------*/
            drawBlock(66,4,6,1);
            drawBlock(77,3,7,1);
            drawBlock(89,3,8,1);
            /*------------dusmanlar-----------*/
            //drawBlock(68,9,12,2);
            drawBlock(84,4,0,2);
            //drawBlock(87,9,12,2);
            break;
        default:
            break;
    }
}

function passingLevelSection4To5(){
    switch(level){
        case 1:
            /*------------platform------------*/
            for(i=98;i<129;i++){
                drawBlock(i,8,53);
            }
            drawBlock(109,8,73);
            drawBlock(114,8,73);
            drawBlock(123,8,73);
            drawBlock(101,5,1);
            for(i=102;i<106;i++){
                drawBlock(i,5,2);
            }
            drawBlock(106,5,3);
            drawBlock(109,7,93);
            for(i=110;i<114;i++){
                drawBlock(i,7,133);
            }
            drawBlock(114,7,94);
            drawBlock(116,6,1);
            for(i=117;i<121;i++){
                drawBlock(i,6,2);
            }
            /*------------elmaslar------------*/
            drawBlock(92,4,5,1);
            drawBlock(102,3,6,1);
            drawBlock(110,6,7,1);
            drawBlock(117,4,8,1);
            drawBlock(124,4,9,1);
            /*------------dusmanlar-----------*/
            drawBlock(105,4,6,2);
            //drawBlock(108,9,12,2);
            //drawBlock(115,9,12,2);
            drawBlock(120,5,6,2);
            /*------------arkaplanlar----------------------*/
            drawBlock(91,5,126);
            drawBlock(101,4,126);
            drawBlock(116,5,126);
            drawBlock(129,4,126);
            break;
        case 2:
            drawBlock(102,7,153);
            drawBlock(103,7,154);
            drawBlock(104,7,154);
            drawBlock(105,7,155);
            drawBlock(108,7,61);
            drawBlock(108,8,121);
            for(i=109;i<113;i++){
                drawBlock(i,7,62);
                drawBlock(i,8,122);
            }
            drawBlock(113,4,17);
            drawBlock(113,5,37);
            drawBlock(113,6,57);
            drawBlock(114,4,18);
            drawBlock(114,5,38);
            drawBlock(114,6,58);
            drawBlock(114,7,117);
            drawBlock(114,8,137);
            drawBlock(115,4,19);
            drawBlock(115,5,39);
            drawBlock(115,6,59);
            drawBlock(116,7,61);
            drawBlock(116,8,121);
            /*------------elmaslar------------*/
            drawBlock(93,4,6,1);
            drawBlock(99,4,7,1);
            drawBlock(116,2,8,1);
            /*------------dusmanlar-----------*/
            drawBlock(89,9,12,2);
            drawBlock(106,9,12,2);
            drawBlock(119,2,26,2);
            break;
        case 3:
            for(i=100;i<105;i++){
                drawBlock(i,4,102);
                drawBlock(i,5,122);
                drawBlock(i,6,122);
                drawBlock(i,7,122);
                drawBlock(i,8,122);
            }
            drawBlock(105,4,71);
            drawBlock(105,5,71);
            drawBlock(105,6,71);
            for(i=105;i<112;i++){
                drawBlock(i,7,102);
                drawBlock(i,8,122);
            }
            drawBlock(107,6,145);
            drawBlock(112,7,103);
            drawBlock(112,8,123);
            for(i=113;i<123;i++){
                drawBlock(i,8,53);
            }
            drawBlock(116,6,153);
            drawBlock(117,6,154);
            drawBlock(118,6,154);
            drawBlock(119,6,155);
            /*------------elmaslar------------*/
            drawBlock(108,6,7,1);
            /*------------dusmanlar-----------*/
            //drawBlock(114,9,12,2);
            drawBlock(121,9,12,2);
            break;
        case 4:
            for(i=100;i<127;i++){
                drawBlock(i,8,53);
            }
            drawBlock(101,4,29);
            drawBlock(102,4,29);
            drawBlock(103,4,29);
            drawBlock(106,6,29);
            drawBlock(107,6,29);
            drawBlock(108,6,29);
            drawBlock(109,6,90);
            drawBlock(110,6,91);
            drawBlock(111,6,91);
            drawBlock(112,6,91);
            drawBlock(113,6,92);
            drawBlock(114,6,29);
            drawBlock(115,6,29);
            drawBlock(116,6,29);
            /*------------elmaslar------------*/
            drawBlock(109,5,9,1);
            /*------------dusmanlar-----------*/
            drawBlock(100,9,12,2);
            drawBlock(112,5,0,2);
            drawBlock(128,2,26,2);

            //drawBlock(118,9,12,2);
            //drawBlock(126,9,12,2);
            break;
        default:
            break;
    }
    
}













