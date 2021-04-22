var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var key1, key

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,PLAY = 1,END = 0,gameState = PLAY,gameover,goimg,restart, rimg;


function preload(){
  trex_running = loadAnimation("images/trex1.png","images/trex3.png","images/trex4.png");
  trex_collided = loadImage("images/trex_collided.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  
  goimg = loadImage("images/gameOver.png");
  rimg = loadImage("images/restart.png");
  bg = loadImage("images/bg.png");
  key1 = loadImage("images/key.png");
}

function setup() {
  createCanvas(displayWidth-10,displayHeight-150);
  
  trex = createSprite(displayWidth/2-550,displayHeight/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/2,displayHeight/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  key = createSprite(displayWidth/2,displayHeight/2+100);
  key.addImage(key1);
  key.scale = 0.3;

  invisibleGround = createSprite(displayWidth/2-600,displayHeight/2+10,400,20);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameover = createSprite(displayWidth/2,displayHeight/2-100);
  gameover.addImage(goimg);
  gameover.scale = 0.5;
  gameover.visible = false;
  
  restart = createSprite(displayWidth/2,displayHeight/2-50);
  restart.addImage(rimg);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background("#c68767");
  image(bg,displayWidth,displayHeight,displayWidth,displayHeight);
  textSize(20);
  text("Score: "+ score, displayWidth/2+400,displayHeight/4);
  
  if(gameState === PLAY){
    key.visible = true;
    score = score + Math.round(frameCount%2);
    if(keyDown("space") && trex.y>=displayHeight/4+120) {
    trex.velocityY = -10;
  }else if(mousePressedOver(key) && trex.y>=displayHeight/4+120) {
    trex.velocityY = -10;
  }
  
  trex.velocityY = trex.velocityY + 0.8
  ground.velocityX = -4;
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  spawnClouds();
  spawnObstacles();
  if(obstaclesGroup.isTouching(trex) && gameState === PLAY){
    gameState = END;
  }
  }
  else if(gameState === END){
    gameover.visible = true;
    restart.visible = true;

    key.visible = false;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation(trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }
  if(mousePressedOver(restart)) {
    reset();
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}
function reset(){
  gameState = PLAY;
  
  gameover.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight/4+70,40,10);
    cloud.y = Math.round(random(displayHeight/4+40,displayHeight/4+70));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight/2-20,10,40);
    obstacle.velocityX = -(6+score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}