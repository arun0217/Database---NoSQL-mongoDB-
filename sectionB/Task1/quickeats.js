const database = db.getSiblingDB("quickeats_db");

if (!database.getCollectionNames().includes("restaurants")) {
  database.createCollection("restaurants");
}

const restaurants = database.getCollection("restaurants");

const result = restaurants.insertMany([
  {
    name: "The Tandoor Table",
    cuisine: "North Indian",
    city: "Pune",
    rating: 4.7,
    isOpen: true,
    menu: [
      { itemName: "Paneer Tikka", price: 280 },
      { itemName: "Dal Makhani", price: 240 }
    ]
  },
  {
    name: "Coastal Curry House",
    cuisine: "South Indian",
    city: "Mumbai",
    rating: 4.5,
    isOpen: true,
    menu: [
      { itemName: "Masala Dosa", price: 190 },
      { itemName: "Coastal Fish Curry", price: 360 }
    ]
  },
  {
    name: "Little Napoli",
    cuisine: "Italian",
    city: "Bengaluru",
    rating: 4.3,
    isOpen: false,
    menu: [
      { itemName: "Margherita Pizza", price: 320 },
      { itemName: "Penne Arrabbiata", price: 290 }
    ]
  },
  {
    name: "Green Fork Kitchen",
    cuisine: "Healthy",
    city: "Hyderabad",
    rating: 4.6,
    isOpen: true,
    menu: [
      { itemName: "Quinoa Power Bowl", price: 310 },
      { itemName: "Avocado Toast", price: 260 }
    ]
  },
  {
    name: "Wok & Roll",
    cuisine: "Chinese",
    city: "Chennai",
    rating: 4.2,
    isOpen: true,
    menu: [
      { itemName: "Veg Hakka Noodles", price: 220 },
      { itemName: "Chilli Paneer", price: 270 }
    ]
  }
]);

const insertedCount = Object.keys(result.insertedIds).length;
print(`Inserted ${insertedCount} restaurant documents into quickeats_db.restaurants.`);
print("All restaurant documents:");
restaurants.find().forEach(printjson);

const total = restaurants.countDocuments();
if (total < 5) {
  throw new Error(`Expected at least 5 restaurant documents, found ${total}.`);
}
print(`Verified: ${total} restaurant documents are present.`);


