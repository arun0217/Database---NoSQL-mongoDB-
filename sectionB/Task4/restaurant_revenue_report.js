const database = db.getSiblingDB("quickeats_db");

if (!database.getCollectionNames().includes("orders")) {
  throw new Error("quickeats_db.orders does not exist. Run the Task2 script first.");
}

const orders = database.getCollection("orders");
if (orders.countDocuments() < 8) {
  throw new Error("Expected at least 8 orders. Run the Task2 script first.");
}

const pipeline = [
  {
    $match: {
      status: "delivered"
    }
  },
  {
    $group: {
      _id: "$restaurantName",
      totalRevenue: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      restaurantName: "$_id",
      totalRevenue: 1,
      orderCount: 1
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  },
  {
    $limit: 3
  }
];

print("Top 3 restaurants by delivered-order revenue:");
orders.aggregate(pipeline).forEach(printjson);
