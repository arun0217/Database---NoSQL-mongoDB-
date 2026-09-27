const foodDb = db.getSiblingDB("foodDeliveryApp");
const restaurants = foodDb.getCollection("restaurants");
const orders = foodDb.getCollection("orders");

const restaurantIds = {
  saffron: ObjectId("64b000000000000000000001"),
  olive: ObjectId("64b000000000000000000002"),
  dosa: ObjectId("64b000000000000000000003"),
  wok: ObjectId("64b000000000000000000004"),
  forno: ObjectId("64b000000000000000000005")
};

restaurants.deleteMany({});
orders.deleteMany({});

restaurants.insertMany([
  {
    _id: restaurantIds.saffron,
    name: "Saffron Courtyard",
    cuisine: "North Indian",
    location: "Ahmedabad",
    average_rating: 4.7
  },
  {
    _id: restaurantIds.olive,
    name: "Olive Street Kitchen",
    cuisine: "Mediterranean",
    location: "Mumbai",
    average_rating: 4.5
  },
  {
    _id: restaurantIds.dosa,
    name: "Dosa Corner",
    cuisine: "South Indian",
    location: "Bengaluru",
    average_rating: 4.3
  },
  {
    _id: restaurantIds.wok,
    name: "Red Lantern Wok",
    cuisine: "Chinese",
    location: "Pune",
    average_rating: 4.4
  },
  {
    _id: restaurantIds.forno,
    name: "Forno & Basil",
    cuisine: "Italian",
    location: "Hyderabad",
    average_rating: 4.6
  }
]);

const dayInMs = 24 * 60 * 60 * 1000;
const now = new Date();
orders.insertMany([
  {
    user_id: "user_1001",
    restaurant_id: restaurantIds.saffron,
    items: [
      { item_name: "Paneer tikka", price: 160 },
      { item_name: "Jeera rice", price: 60 }
    ],
    total_amount: 220,
    order_date: new Date(now.getTime() - dayInMs)
  },
  {
    user_id: "user_1002",
    restaurant_id: restaurantIds.saffron,
    items: [
      { item_name: "Veg thali", price: 180 },
      { item_name: "Mango lassi", price: 70 }
    ],
    total_amount: 250,
    order_date: new Date(now.getTime() - 2 * dayInMs)
  },
  {
    user_id: "user_1003",
    restaurant_id: restaurantIds.olive,
    items: [
      { item_name: "Falafel bowl", price: 280 },
      { item_name: "Hummus pita", price: 170 }
    ],
    total_amount: 450,
    order_date: now
  }
]);

if (restaurants.countDocuments() !== 5 || orders.countDocuments() !== 3) {
  throw new Error("Expected exactly five restaurants and three orders.");
}

print("Database: foodDeliveryApp");
print("1) Restaurants inserted:");
restaurants.find({}, { _id: 1, name: 1, cuisine: 1, location: 1, average_rating: 1 })
  .sort({ name: 1 })
  .forEach(restaurant => printjson(restaurant));

print("2) Sample orders inserted:");
orders.find({}, { _id: 1, user_id: 1, restaurant_id: 1, items: 1, total_amount: 1, order_date: 1 })
  .sort({ order_date: 1 })
  .forEach(order => printjson(order));

print("3) Order count per restaurant:");
const orderCounts = orders.aggregate([
  { $group: { _id: "$restaurant_id", order_count: { $sum: 1 } } },
  { $project: { _id: 0, restaurant_id: "$_id", order_count: 1 } },
  { $sort: { order_count: -1, restaurant_id: 1 } }
]).toArray();
orderCounts.forEach(result => printjson(result));
if (orderCounts.length !== 2 || orderCounts[0].order_count !== 2 || orderCounts[1].order_count !== 1) {
  throw new Error("The order-count aggregation returned unexpected results.");
}

print("4) Top two restaurants by average order amount:");
const topRestaurants = orders.aggregate([
  {
    $group: {
      _id: "$restaurant_id",
      average_order_amount: { $avg: "$total_amount" }
    }
  },
  { $sort: { average_order_amount: -1, _id: 1 } },
  { $limit: 2 },
  { $project: { _id: 0, restaurant_id: "$_id", average_order_amount: 1 } }
]).toArray();
topRestaurants.forEach(result => printjson(result));
if (topRestaurants.length !== 2 || topRestaurants[0].average_order_amount !== 450 || topRestaurants[1].average_order_amount !== 235) {
  throw new Error("The top-two average-order aggregation returned unexpected results.");
}

print("5) Randomly assigning delivery statuses:");
const deliveryStatuses = ["pending", "out for delivery", "delivered"];
orders.find({}, { _id: 1 }).forEach(order => {
  const status = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
  orders.updateOne({ _id: order._id }, { $set: { delivery_status: status } });
});

const invalidStatusCount = orders.countDocuments({ delivery_status: { $nin: deliveryStatuses } });
if (invalidStatusCount !== 0) {
  throw new Error("An order has an invalid delivery_status value.");
}

orders.find({}, { _id: 0, user_id: 1, delivery_status: 1 })
  .sort({ user_id: 1 })
  .forEach(order => printjson(order));

const pendingCount = orders.countDocuments({ delivery_status: "pending" });
print(`Pending orders: ${pendingCount}`);