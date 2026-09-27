// Session 1: NoSQL fundamentals
// Run with: mongosh --file foodieApp.mongodb.js

const foodieApp = db.getSiblingDB("foodieApp");

if (!foodieApp.getCollectionNames().includes("restaurants")) {
  foodieApp.createCollection("restaurants");
}

// Reset this exercise's collection so the script can be run again cleanly.
foodieApp.restaurants.deleteMany({});

foodieApp.restaurants.insertOne({
  name: "Spice Route",
  cuisine: "Indian",
  rating: 4.5,
  location: { area: "Koramangala", city: "Bengaluru" },
  menu: ["Paneer Tikka", "Butter Chicken", "Garlic Naan"]
});

foodieApp.restaurants.insertMany([
  {
    name: "Sushi Grove",
    cuisine: "Japanese",
    rating: 4.7,
    location: { area: "Indiranagar", city: "Bengaluru" },
    menu: ["Salmon Nigiri", "Miso Soup", "Vegetable Tempura"]
  },
  {
    name: "Taco Terrace",
    cuisine: "Mexican",
    rating: 4.3,
    location: { area: "Whitefield", city: "Bengaluru" },
    menu: ["Crispy Tacos", "Quesadillas", "Churros"]
  },
  {
    name: "Green Bowl Cafe",
    cuisine: "Healthy",
    rating: 4.2,
    location: { area: "HSR Layout", city: "Bengaluru" },
    menu: ["Avocado Bowl", "Quinoa Salad", "Mango Smoothie"]
  }
]);

print("Restaurants in foodieApp:");
foodieApp.restaurants.find().sort({ name: 1 }).forEach(printjson);

print("BSON types by field:");
foodieApp.restaurants.aggregate([
  { $sort: { name: 1 } },
  {
    $project: {
      _id: 0,
      name: { $type: "$name" },
      cuisine: { $type: "$cuisine" },
      rating: { $type: "$rating" },
      location: { $type: "$location" },
      menu: { $type: "$menu" },
      menuItems: { $map: { input: "$menu", as: "item", in: { $type: "$$item" } } }
    }
  }
]).forEach(printjson);

print(`Total restaurants: ${foodieApp.restaurants.countDocuments()}`);
