//Create variables here

var dog, database, happyDog, foodS, foodStock;

var fedTime, lastFed;

var foodObj;

var btnFeedDog, btnAddFood;

do {
  name = prompt('Enter your Dog Name: ')
} while (!name)

function preload() {  //load images here
  img = loadImage('images/Dog.png');
  img2 = loadImage('images/happydog.png');
}

function setup() {
  createCanvas(1000, 400);

  database = firebase.database();
  dog = createSprite(800, 250, 150, 150);
  dog.scale = 0.15;
  dog.addImage(img);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  btnFeedDog = createButton("Feed the Dog");
  btnFeedDog.position(700, 95);
  btnFeedDog.mousePressed(feedDog);

  btnAddFood = createButton("Add Food");
  btnAddFood.position(800, 95);
  btnAddFood.mousePressed(addFoods);

}


function draw() {
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  //add styles here

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  drawSprites();
}

//function to read value from database
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(img2);

  
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
