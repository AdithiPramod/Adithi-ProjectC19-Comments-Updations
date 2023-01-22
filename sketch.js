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
  //createCanvas(windowWidth, windowHeight);
 
  createCanvas(800, 400);

  //sprite variables need to be global for them to be accesible by draw function.
  // Here the same variables are made global and local which is not right(ex- road, ghost, invisible_ground..)
  //var road = createSprite(200,380,400,20);
  road = createSprite(20,380,400,20); //reduced x position from 200 to 20
  //in preload you have used loadImage so here addImage works
  //road.addAnimation(road_img);
  road.addImage(road_img);
  //the below line is missed-> it is need to get the road for every half of the width
  road.x = road.width /2;

  //var ghost = createSprite(200,300,20,50);
  ghost = createSprite(20,300,20,50);//reduced x position from 200 to 20
  //in preload you have used loadImage so here addImage works :) => if it was loadAnimation in preload then addAnimation works
  //ghost.addAnimation(ghost_running);
  ghost.addImage(ghost_running);
  ghost.scale = 0.8; // reduced ghost size from 2
  ghost.setCollider("circle", 0, 0, 30);

  ghost.x = 50;

  var invisible_ground = createSprite(200,300,400,5);
  invisible_ground.visible = false;

  //wrong function used to create a group and again variables need to be global and not both
  //var ObstaclesGroup = createGroup();
  //var CloudsGroup = createGroup();
  obstaclesGroup = new Group();

  var restart = createSprite(200,150);
  //in preload you have used loadImage so here addImage works
  //restart.addAnimation(gameOverImg);
  restart.addImage(gameOverImg);
  restart.scale = 0.5;
  restart.visible = false;

}

function draw() {
  
  background(bg_1);
  
  //background("cyan");
  textSize(30)
  //text("Score : "+ score, 1050, 60);
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
    
    //group name miss-spelt here
    /*if(ObstaclesGroup.isTouching(ghost)){
      gameState = END;
    }*/
    if(obstaclesGroup.isTouching(ghost)){
      gameState = END;
    }

  }
   //its not if=>it should be else if coz it either can be PLAY state else END state 
  //if(gameState === END){
    else if(gameState === END){
    restart.visible = true;
    
    road.velocityX = 0;
    ghost.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);    
 
    ghost.setAnimation("over.png");
    ghost.scale = 0.5;
    
    //group name miss-spelt here
    //ObstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart)) {
    reset();  
    ghost.collide(invisible_ground);
  }
 
  drawSprites();

  //Commented as they are already included
  //textSize(40);
  //text("SCORE: "+ score, 30, 50);
  }

function reset(){
  
  gameState = PLAY;

  obstaclesGroup.destroyEach();

  ghost.setAnimation("running.png");
  ghost.scale = 1.5;

  restart.visible = false;

  score = 0;
}

//repeatition of same function is not allowed
/*function spawnObstacles() {

  if(World.frameCount % 60 === 0) {

    var obstacle = createSprite(400,300,10,40);
    obstacle.velocityX = - (6 + 3*score/100);
    

    var random_num = randomNumber(1,6);
    obstacle.setAnimation("obstacle_1.png");
    
         
    obstacle.scale = 0.15;
    obstacle.lifetime = 70;
  
    ObstaclesGroup.add(obstacle);
  }
}*/

function spawnObstacles(){
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600, 95, 20, 30);
    obstacle.velocityX = -6;
    obstacle.setCollider("circle ",0,0,45);
    
    obstacle.debug = true
  
    //obstacle.velocityX = -(6 + 3*score/100);
    
    var random_num = Math.round(random(1,2));
    //wrong image name used obstacle1 & obstacle2 doesn't exists; The loaded image names are obstacle_1 , obstacle_2
    /*switch(random_num) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }*/
     
    switch(random_num) {
      case 1: obstacle.addImage(obstacle_1);
              break;
      case 2: obstacle.addImage(obstacle_2);
              break;
      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //there is no trex here- so replacing trex with ghost :D
    //obstacle.depth = trex.depth;
    //trex.depth += 1;
    obstacle.depth = ghost.depth;
    ghost.depth += 1;
    obstaclesGroup.add(obstacle);
  }
}