var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ghost, ghost_running, ghost_jumping, ghost_hit;

var road, invisible_ground;

var music;

var obstaclesGroup, obstacle_1, obstacle_2;

var bg;

var score = 0;

var game_over, restart;

obstaclesGroup = new Group();

function preload(){

  music = loadSound("music.mp3");

  bg_1 = loadImage("bg_1.png");

  ghost_running = loadImage("running.png");
  ghost_jumping = loadImage("jumping.png")
  ghost_hit = loadImage("over.png")

  obstacle_1 = loadImage("obstacle_1.png");
  obstacle_2 = loadImage("obstacle_2.png");

  road_img = loadImage("road.png");

  gameOverImg = loadImage("game_over.png")
}

function setup(){
  createCanvas(windowWidth, windowHeight);
 
  createCanvas(800, 400);

  
  road = createSprite(20,380,400,20);
  road.addImage(road_img);
  road.x = road.width /2;
  
  ghost = createSprite(20,300,20,50);
  ghost.addImage(ghost_running);
  ghost.scale = 0.8; // reduced ghost size from 2
  ghost.setCollider("circle", 0, 0, 30);

  ghost.x = 50;

  var invisible_ground = createSprite(200,300,400,5);
  invisible_ground.visible = false;

  obstaclesGroup = new Group();

  var restart = createSprite(200,150);
  
  restart.addImage(gameOverImg);
  restart.scale = 0.5;
  restart.visible = false;

}

function draw() {
  
  background(bg_1);
  
  textSize(30)
  text("Score : "+ score, 650, 60);
  
  if(gameState === PLAY){
    road.velocityX = -(6 + 3*score/100);
  
    score = score + Math.round(World.frameRate/60);
           
    if(keyDown("space") ){
      ghost.velocityY = -10 ;
      playSound(music);
    }

    ghost.velocityY += 0.8;
    
    if (road.x < 0){
      road.x = road.width/2;
    }
    
    if(obstaclesGroup.isTouching(ghost)){
      gameState = END;
    }

  }

    else if(gameState === END){
    restart.visible = true;
    
    road.velocityX = 0;
    ghost.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);    
 
    ghost.setAnimation("over.png");
    ghost.scale = 0.5;
    
    obstaclesGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart)) {
    reset();  
    ghost.collide(invisible_ground);
  }
 
  drawSprites();

  }

function reset(){
  
  gameState = PLAY;

  obstaclesGroup.destroyEach();

  ghost.setAnimation("running.png");
  ghost.scale = 1.5;

  restart.visible = false;

  score = 0;
}

function spawnObstacles(){
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600, 95, 20, 30);
    obstacle.velocityX = -6;
    obstacle.setCollider("circle ",0,0,45);
    
    obstacle.debug = true
    
    var random_num = Math.round(random(1,2)); 
    switch(random_num) {
      case 1: obstacle.addImage(obstacle_1);
              break;
      case 2: obstacle.addImage(obstacle_2);
              break;
      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = ghost.depth;
    ghost.depth += 1;
    obstaclesGroup.add(obstacle);
  }
}
