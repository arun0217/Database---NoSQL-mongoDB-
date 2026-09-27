const sessionDb = db.getSiblingDB("session6_aggregation");
const dayInMs = 24 * 60 * 60 * 1000;

function prepareCollection(name) {
  if (!sessionDb.getCollectionNames().includes(name)) {
    sessionDb.createCollection(name);
  }
  sessionDb.getCollection(name).deleteMany({});
}

const now = new Date();
const daysAgo = dayCount => new Date(now.getTime() - dayCount * dayInMs);

print("Using database: session6_aggregation");

print("1) Orders placed in the last 30 days with $match");
prepareCollection("orders");
sessionDb.orders.insertMany([
  {
    userId: "user101",
    items: [
      { product: "Coffee Beans", quantity: 2, price: 250 },
      { product: "Travel Mug", quantity: 1, price: 700 }
    ],
    orderDate: daysAgo(1)
  },
  {
    userId: "user101",
    items: [{ product: "Cinema Tickets", quantity: 2, price: 400 }],
    orderDate: daysAgo(15)
  },
  {
    userId: "user202",
    items: [{ product: "Bakery Box", quantity: 3, price: 150 }],
    orderDate: daysAgo(29)
  },
  {
    userId: "user303",
    items: [{ product: "Tea Set", quantity: 2, price: 200 }],
    orderDate: daysAgo(7)
  },
  {
    userId: "user202",
    items: [{ product: "Running Shoes", quantity: 1, price: 2000 }],
    orderDate: daysAgo(31)
  }
]);
const last30Days = new Date(now.getTime() - 30 * dayInMs);
const recentOrders = sessionDb.orders.aggregate([
  { $match: { orderDate: { $gte: last30Days, $lte: now } } },
  { $sort: { orderDate: -1 } }
]).toArray();
recentOrders.forEach(order => printjson(order));
if (recentOrders.length !== 4) {
  throw new Error(`Expected 4 recent orders, got ${recentOrders.length}.`);
}

print("2) Total amount spent by each user with $group and $sum");
const userSpendPipeline = [
  { $unwind: "$items" },
  {
    $group: {
      _id: "$userId",
      totalSpent: {
        $sum: { $multiply: ["$items.quantity", "$items.price"] }
      }
    }
  },
  { $project: { _id: 0, userId: "$_id", totalSpent: 1 } },
  { $sort: { userId: 1 } }
];
sessionDb.orders.aggregate(userSpendPipeline).forEach(printjson);

print("3) Top 3 highest-rated cafes in Ahmedabad");
prepareCollection("restaurants");
sessionDb.restaurants.insertMany([
  { name: "Cafe Sol", cuisine: "Cafe", city: "Ahmedabad", rating: 4.8 },
  { name: "Bean There", cuisine: "Cafe", city: "Ahmedabad", rating: 4.6 },
  { name: "The Daily Grind", cuisine: "Cafe", city: "Ahmedabad", rating: 4.7 },
  { name: "Cafe Avenue", cuisine: "Cafe", city: "Ahmedabad", rating: 4.3 },
  { name: "River Cafe", cuisine: "Cafe", city: "Vadodara", rating: 4.9 },
  { name: "Spice House", cuisine: "Indian", city: "Ahmedabad", rating: 4.9 }
]);
const topAhmedabadCafes = sessionDb.restaurants.aggregate([
  { $match: { cuisine: "Cafe", city: "Ahmedabad" } },
  { $sort: { rating: -1, name: 1 } },
  { $limit: 3 }
]).toArray();
topAhmedabadCafes.forEach(restaurant => printjson(restaurant));
if (topAhmedabadCafes.length !== 3) {
  throw new Error("The Ahmedabad cafe pipeline did not return three results.");
}

print("4) Total box office by genre with _id excluded from the projection");
prepareCollection("movies");
sessionDb.movies.insertMany([
  { title: "Skyward", genre: "Adventure", boxOffice: 12500000 },
  { title: "Deep Blue", genre: "Drama", boxOffice: 8400000 },
  { title: "Small Hours", genre: "Drama", boxOffice: 6100000 },
  { title: "Laugh Track", genre: "Comedy", boxOffice: 9300000 },
  { title: "Side Street", genre: "Comedy", boxOffice: 4700000 },
  { title: "Orbit Seven", genre: "Science Fiction", boxOffice: 15600000 }
]);
const boxOfficeByGenre = sessionDb.movies.aggregate([
  { $group: { _id: "$genre", totalCollection: { $sum: "$boxOffice" } } },
  { $project: { _id: 0, genre: "$_id", totalCollection: 1 } },
  { $sort: { genre: 1 } }
]).toArray();
boxOfficeByGenre.forEach(result => printjson(result));
if (boxOfficeByGenre.some(result => Object.prototype.hasOwnProperty.call(result, "_id"))) {
  throw new Error("The final box office projection unexpectedly contains _id.");
}

print("5) ChatGPT-generated daily sales report for payments in the last 7 days");
prepareCollection("payments");
sessionDb.payments.insertMany([
  { userId: "user101", amount: 500, paymentDate: now },
  { userId: "user202", amount: 250, paymentDate: now },
  { userId: "user101", amount: 350, paymentDate: daysAgo(1) },
  { userId: "user303", amount: 900, paymentDate: daysAgo(3) },
  { userId: "user202", amount: 125, paymentDate: daysAgo(6) },
  { userId: "user404", amount: 10000, paymentDate: daysAgo(8) }
]);

const reportNow = new Date();
const sevenDaysAgo = new Date(reportNow.getTime() - 7 * dayInMs);
const dailySalesPipeline = [
  { $match: { paymentDate: { $gte: sevenDaysAgo, $lte: reportNow } } },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$paymentDate",
          timezone: "Asia/Kolkata"
        }
      },
      totalSales: { $sum: "$amount" }
    }
  },
  { $project: { _id: 0, date: "$_id", totalSales: 1 } },
  { $sort: { date: 1 } }
];
print("Daily sales pipeline:");
printjson(dailySalesPipeline);
sessionDb.payments.aggregate(dailySalesPipeline).forEach(printjson);
