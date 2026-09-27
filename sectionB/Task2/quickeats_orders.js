const database = db.getSiblingDB("quickeats_db");

if (!database.getCollectionNames().includes("orders")) {
  database.createCollection("orders");
}

const orders = database.getCollection("orders");

const insertResult = orders.insertMany([
  {
    customerId: "CUST-1001",
    restaurantName: "The Tandoor Table",
    items: [
      { itemName: "Paneer Tikka", quantity: 2, price: 280 },
      { itemName: "Dal Makhani", quantity: 1, price: 240 }
    ],
    totalAmount: 800,
    status: "delivered",
    orderDate: ISODate("2026-09-20T12:30:00Z")
  },
  {
    customerId: "CUST-1002",
    restaurantName: "Little Napoli",
    items: [
      { itemName: "Margherita Pizza", quantity: 1, price: 320 },
      { itemName: "Penne Arrabbiata", quantity: 1, price: 290 }
    ],
    totalAmount: 610,
    status: "confirmed",
    orderDate: ISODate("2026-09-21T13:15:00Z")
  },
  {
    customerId: "CUST-1003",
    restaurantName: "Green Fork Kitchen",
    items: [
      { itemName: "Avocado Toast", quantity: 1, price: 260 }
    ],
    totalAmount: 260,
    status: "pending",
    orderDate: ISODate("2026-09-21T18:45:00Z")
  },
  {
    customerId: "CUST-1004",
    restaurantName: "Coastal Curry House",
    items: [
      { itemName: "Coastal Fish Curry", quantity: 1, price: 360 },
      { itemName: "Masala Dosa", quantity: 1, price: 190 }
    ],
    totalAmount: 550,
    status: "delivered",
    orderDate: ISODate("2026-09-22T11:05:00Z")
  },
  {
    customerId: "CUST-1005",
    restaurantName: "Wok & Roll",
    items: [
      { itemName: "Chilli Paneer", quantity: 2, price: 270 },
      { itemName: "Veg Hakka Noodles", quantity: 1, price: 220 }
    ],
    totalAmount: 760,
    status: "confirmed",
    orderDate: ISODate("2026-09-23T19:20:00Z")
  },
  {
    customerId: "CUST-1006",
    restaurantName: "The Tandoor Table",
    items: [
      { itemName: "Paneer Tikka", quantity: 1, price: 280 },
      { itemName: "Dal Makhani", quantity: 1, price: 240 }
    ],
    totalAmount: 520,
    status: "delivered",
    orderDate: ISODate("2026-09-24T12:10:00Z")
  },
  {
    customerId: "CUST-1007",
    restaurantName: "Green Fork Kitchen",
    items: [
      { itemName: "Quinoa Power Bowl", quantity: 1, price: 310 },
      { itemName: "Avocado Toast", quantity: 1, price: 260 }
    ],
    totalAmount: 570,
    status: "pending",
    orderDate: ISODate("2026-09-25T14:00:00Z")
  },
  {
    customerId: "CUST-1008",
    restaurantName: "Little Napoli",
    items: [
      { itemName: "Margherita Pizza", quantity: 1, price: 320 }
    ],
    totalAmount: 320,
    status: "confirmed",
    orderDate: ISODate("2026-09-26T20:10:00Z")
  }
]);

print(`Inserted ${Object.keys(insertResult.insertedIds).length} orders into quickeats_db.orders.`);

const projection = {
  _id: 0,
  customerId: 1,
  totalAmount: 1,
  status: 1
};

print("Delivered orders with totalAmount greater than Rs 400:");
orders.find(
  {
    totalAmount: { $gt: 400 },
    status: { $eq: "delivered" }
  },
  projection
).sort({ totalAmount: -1 }).limit(5).forEach(printjson);

print("Pending or confirmed orders:");
orders.find(
  {
    status: { $in: ["pending", "confirmed"] }
  },
  projection
).sort({ totalAmount: -1 }).limit(5).forEach(printjson);

const totalOrders = orders.countDocuments();
if (totalOrders < 8) {
  throw new Error(`Expected at least 8 orders, found ${totalOrders}.`);
}
print(`Verified: ${totalOrders} orders are present.`);
