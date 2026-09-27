const sessionDb = db.getSiblingDB("session3_crud");

function prepareCollection(name) {
  if (!sessionDb.getCollectionNames().includes(name)) {
    sessionDb.createCollection(name);
  }
  sessionDb.getCollection(name).deleteMany({});
}

print("Using database: session3_crud");

print("1) Create restaurants and insert one restaurant with insertOne");
prepareCollection("restaurants");
const restaurantInsert = sessionDb.restaurants.insertOne({
  name: "Burger Hub",
  cuisine: "American",
  location: { area: "Indiranagar", city: "Bengaluru" },
  rating: 4.2
});
printjson(restaurantInsert);

print("2) Insert three current Netflix India Top 10 movie examples with insertMany");
prepareCollection("movies");
const movieInsert = sessionDb.movies.insertMany([
  { title: "Vishwanath & Sons", genre: "Drama/Romance", releaseYear: 2026, imdbRating: 7.3 },
  { title: "Irumudi", genre: "Action/Drama", releaseYear: 2026, imdbRating: 7.3 },
  { title: "Dhamaal 4", genre: "Comedy/Adventure", releaseYear: 2026, imdbRating: 7.4 }
]);
printjson(movieInsert);
print("Movies now in the collection:");
sessionDb.movies.find({}, { _id: 0 }).sort({ title: 1 }).forEach(printjson);

print("3) Find Flipkart products priced below 1000");
prepareCollection("flipkart_products");
sessionDb.flipkart_products.insertMany([
  { name: "Basic Cotton T-Shirt", category: "Clothing", price: 799 },
  { name: "Wireless Mouse", category: "Electronics", price: 899 },
  { name: "Ceramic Coffee Mug", category: "Home", price: 349 },
  { name: "Mechanical Keyboard", category: "Electronics", price: 2499 }
]);
sessionDb.flipkart_products.find({ price: { $lt: 1000 } }, { _id: 0 }).sort({ price: 1 }).forEach(printjson);

print("4) Update Burger Hub rating to 4.7 with updateOne");
const restaurantUpdate = sessionDb.restaurants.updateOne(
  { name: "Burger Hub" },
  { $set: { rating: 4.7 } }
);
printjson(restaurantUpdate);
printjson(sessionDb.restaurants.findOne({ name: "Burger Hub" }, { _id: 0 }));

print("5) Delete only orders whose status exactly equals 'cancelled'");
prepareCollection("orders");
sessionDb.orders.insertMany([
  { orderId: "ORD-901", status: "cancelled", total: 540 },
  { orderId: "ORD-902", status: "pending", total: 1250 },
  { orderId: "ORD-903", status: "Cancelled", total: 760 },
  { orderId: "ORD-904", status: "canceled", total: 430 }
]);
const orderDelete = sessionDb.orders.deleteMany({ status: "cancelled" });
printjson(orderDelete);
print("Orders left after the exact-match delete:");
sessionDb.orders.find({}, { _id: 0 }).sort({ orderId: 1 }).forEach(printjson);

const cancelledOrdersLeft = sessionDb.orders.countDocuments({ status: "cancelled" });
if (cancelledOrdersLeft !== 0 || orderDelete.deletedCount !== 1) {
  throw new Error("The exact cancelled-status delete did not produce the expected result.");
}
print("Verified: only the exact 'cancelled' order was deleted; other statuses remain.");
