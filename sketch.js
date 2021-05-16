var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var readState,changeState
var bed,wash,gar
var gameState = 0;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happydog.png");
mImage = loadImage("women3.png");
fImage = loadImage("father3.png");
bImage = loadImage("boy.png");
babyImg = loadImage("baby.png");
back = loadImage("back.jpg");
milk = loadImage("milky.png");
bed = loadImage("Bed Room.png");
wash = loadImage("Washroom.png");
gar = loadImage("Garden.png");
milk2 = loadImage("milk.png");
}

function setup() {
  database=firebase.database();
  createCanvas(700,700);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(480,600,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  mom = createSprite(80,420,30,30);
  mom.addImage(mImage);
  mom.scale =0.7;

  baby = createSprite(100,600,30,30);
  baby.addImage(babyImg);
  baby.scale =0.5;

  boy = createSprite(300,600,30,30);
  boy.addImage(bImage);
  boy.scale =0.65;

   papa = createSprite(350,400,30,30);
  papa.addImage(fImage);
  papa.scale =0.8;

  milky = createSprite(450,650,30,30)
  milky.visible = false
  
  feed=createButton("Feed the dog");
  feed.position(550,100);
  feed.mousePressed(feedDog);

   stroke("black")
   strokeWeight(2)

  addFood=createButton("Add Food");
  addFood.position(700,100);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState')
  readState.on("value",function(data){
    gameState = data.val()
  })
  
  

}

function draw() {
  background(back);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(20);
  if(lastFed>=12){
    textFont("oblique")
    fill("magenta");
    text("Last Feed : "+ lastFed%12 + "PM", 10,100);
   }else if(lastFed==0){
    textFont("oblique")
     fill("magenta")
     text("Last Feed : 12 AM",10,100);
   }else{
    textFont("oblique")
     fill("magenta");
     text("Last Feed : "+ lastFed + "AM", 10,100);
   }
   fill("lightgreen")
   textSize(30);
   text("Pet Care",300,30)
   stroke("white")
   line(280,35,440,35)

   if(gameState!="Hungry"){
     feed.hide()
     addFood.hide()
     dog.remove()
     mom.visible = false
     papa.visible = false
     boy.visible = false
     baby.visible = false
     background("white")
   }
   else{
     feed.show()
     addFood.show()
     dog.addImage(sadDog)
     mom.visible = true
     papa.visible = true
     boy.visible = true
     baby.visible = true
   }

   currentTime = hour();
   if(currentTime==(lastFed+1)){
     update("playing");
     foodObj.garden()
   }
   else if(currentTime==(lastFed+2)){
     update("sleeping")
     foodObj.bedroom()
   }
   else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("bathing")
    foodObj.washroom()
  }
  else{
    update("Hungry")
    foodObj.display();
  }

  if(foodS == 0){
    dog.addImage(happyDog)
    milk2.visible = false;
  }
  else{
    dog.addImage(sadDog)
    milk2.visible = true;
  }

  
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  milky.addImage(milk)
  milky.scale = 0.12
  milky.visible = true


  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState:state});

}