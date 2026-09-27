// QuickEats food delivery database setup and demonstration queries.
// Run with: mongosh "mongodb://localhost:27017" --file quickeats.mongodb.js

const quickeats = db.getSiblingDB("quickeats_db");
const restaurants = quickeats.getCollection("restaurants");
const orders = quickeats.getCollection("orders");
const customers = quickeats.getCollection("customers");

function seed(collection, documents) {
  documents.forEach((document) => {
    collection.replaceOne({ _id: document._id }, document, { upsert: true });
  });
}

seed(restaurants, [
  {
    _id: "REST-001",
    name: "Spice Route Kitchen",
    cuisine: ["North Indian", "Mughlai"],
    rating: 4.7,
    reviewCount: 1284,
    priceForTwo: 650,
    isOpen: true,
    address: { street: "12 Residency Road", city: "Bengaluru", postalCode: "560025" },
    menu: [
      { itemId: "SR-01", name: "Butter Chicken", category: "Main Course", price: 340, isAvailable: true },
      { itemId: "SR-02", name: "Paneer Tikka", category: "Starter", price: 260, isAvailable: true },
      { itemId: "SR-03", name: "Garlic Naan", category: "Bread", price: 65, isAvailable: true }
    ]
  },
  {
    _id: "REST-002",
    name: "Green Bowl Co.",
    cuisine: ["Healthy", "Salads"],
    rating: 4.4,
    reviewCount: 642,
    priceForTwo: 500,
    isOpen: true,
    address: { street: "48 Indiranagar 100 Feet Road", city: "Bengaluru", postalCode: "560038" },
    menu: [
      { itemId: "GB-01", name: "Avocado Grain Bowl", category: "Bowls", price: 320, isAvailable: true },
      { itemId: "GB-02", name: "Grilled Tofu Salad", category: "Salads", price: 285, isAvailable: true },
      { itemId: "GB-03", name: "Fresh Lime Cooler", category: "Drinks", price: 90, isAvailable: true }
    ]
  },
  {
    _id: "REST-003",
    name: "Wok This Way",
    cuisine: ["Chinese", "Asian"],
    rating: 4.2,
    reviewCount: 917,
    priceForTwo: 550,
    isOpen: true,
    address: { street: "8 Park Street", city: "Kolkata", postalCode: "700016" },
    menu: [
      { itemId: "WW-01", name: "Chilli Garlic Noodles", category: "Noodles", price: 290, isAvailable: true },
      { itemId: "WW-02", name: "Crispy Corn", category: "Starter", price: 220, isAvailable: true },
      { itemId: "WW-03", name: "Veg Manchurian", category: "Main Course", price: 270, isAvailable: true }
    ]
  },
  {
    _id: "REST-004",
    name: "Coastal Curry House",
    cuisine: ["South Indian", "Seafood"],
    rating: 4.8,
    reviewCount: 1531,
    priceForTwo: 800,
    isOpen: true,
    address: { street: "27 Panampilly Nagar", city: "Kochi", postalCode: "682036" },
    menu: [
      { itemId: "CC-01", name: "Malabar Fish Curry Meal", category: "Meals", price: 420, isAvailable: true },
      { itemId: "CC-02", name: "Appam (2 pcs)", category: "Bread", price: 90, isAvailable: true },
      { itemId: "CC-03", name: "Prawn Roast", category: "Main Course", price: 390, isAvailable: false }
    ]
  },
  {
    _id: "REST-005",
    name: "Little Oven Pizza",
    cuisine: ["Italian", "Pizza"],
    rating: 3.9,
    reviewCount: 488,
    priceForTwo: 700,
    isOpen: false,
    address: { street: "19 Koregaon Park", city: "Pune", postalCode: "411001" },
    menu: [
      { itemId: "LO-01", name: "Margherita Pizza", category: "Pizza", price: 375, isAvailable: true },
      { itemId: "LO-02", name: "Farmhouse Pizza", category: "Pizza", price: 465, isAvailable: true },
      { itemId: "LO-03", name: "Tiramisu Cup", category: "Dessert", price: 180, isAvailable: true }
    ]
  }
]);

seed(customers, [
  {
    _id: "CUST-001",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    phone: "+91-9876501001",
    loyaltyPoints: 420,
    createdAt: new Date("2025-11-14T09:30:00Z"),
    addresses: [
      { label: "Home", street: "24 5th Main, Indiranagar", city: "Bengaluru", postalCode: "560038", isDefault: true },
      { label: "Office", street: "3rd Floor, MG Road", city: "Bengaluru", postalCode: "560001", isDefault: false }
    ]
  },
  {
    _id: "CUST-002",
    name: "Diya Nair",
    email: "diya.nair@example.com",
    phone: "+91-9876501002",
    loyaltyPoints: 185,
    createdAt: new Date("2025-12-02T11:00:00Z"),
    addresses: [{ label: "Home", street: "16 Kakkanad Road", city: "Kochi", postalCode: "682030", isDefault: true }]
  },
  {
    _id: "CUST-003",
    name: "Ishaan Kapoor",
    email: "ishaan.kapoor@example.com",
    phone: "+91-9876501003",
    loyaltyPoints: 90,
    createdAt: new Date("2026-01-08T08:15:00Z"),
    addresses: [{ label: "Home", street: "51 Lake Market", city: "Kolkata", postalCode: "700029", isDefault: true }]
  },
  {
    _id: "CUST-004",
    name: "Mira Shah",
    email: "mira.shah@example.com",
    phone: "+91-9876501004",
    loyaltyPoints: 310,
    createdAt: new Date("2026-02-19T14:45:00Z"),
    addresses: [{ label: "Home", street: "9 Koregaon Park Lane", city: "Pune", postalCode: "411001", isDefault: true }]
  },
  {
    _id: "CUST-005",
    name: "Rohan Das",
    email: "rohan.das@example.com",
    phone: "+91-9876501005",
    loyaltyPoints: 155,
    createdAt: new Date("2026-03-11T10:20:00Z"),
    addresses: [{ label: "Home", street: "7 Salt Lake Sector V", city: "Kolkata", postalCode: "700091", isDefault: true }]
  }
]);

function makeOrder(id, customerId, restaurantId, restaurantName, status, totalAmount, placedAt, firstItem, secondItem) {
  return {
    _id: id,
    customerId,
    restaurantId,
    restaurantName,
    items: [
      { itemId: firstItem[0], name: firstItem[1], quantity: firstItem[2], unitPrice: firstItem[3] },
      { itemId: secondItem[0], name: secondItem[1], quantity: secondItem[2], unitPrice: secondItem[3] }
    ],
    subtotal: totalAmount - 40,
    deliveryFee: 40,
    totalAmount,
    status,
    payment: { method: "UPI", status: status === "cancelled" ? "refunded" : "paid" },
    placedAt: new Date(placedAt),
    deliveryLog: [
      { eventId: `${id}-PLACED`, status: "placed", at: new Date(placedAt) },
      ...(status === "delivered" ? [{ eventId: `${id}-DELIVERED`, status: "delivered", at: new Date(new Date(placedAt).getTime() + 45 * 60000) }] : [])
    ]
  };
}

seed(orders, [
  makeOrder("ORD-001", "CUST-001", "REST-001", "Spice Route Kitchen", "delivered", 510, "2026-09-01T12:15:00Z", ["SR-01", "Butter Chicken", 1, 340], ["SR-03", "Garlic Naan", 2, 65]),
  makeOrder("ORD-002", "CUST-001", "REST-002", "Green Bowl Co.", "delivered", 450, "2026-09-02T13:05:00Z", ["GB-01", "Avocado Grain Bowl", 1, 320], ["GB-03", "Fresh Lime Cooler", 1, 90]),
  makeOrder("ORD-003", "CUST-001", "REST-001", "Spice Route Kitchen", "preparing", 365, "2026-09-15T19:20:00Z", ["SR-02", "Paneer Tikka", 1, 260], ["SR-03", "Garlic Naan", 1, 65]),
  makeOrder("ORD-004", "CUST-001", "REST-005", "Little Oven Pizza", "delivered", 685, "2026-09-04T18:40:00Z", ["LO-02", "Farmhouse Pizza", 1, 465], ["LO-03", "Tiramisu Cup", 1, 180]),
  makeOrder("ORD-005", "CUST-002", "REST-003", "Wok This Way", "delivered", 840, "2026-09-05T11:50:00Z", ["WW-01", "Chilli Garlic Noodles", 2, 290], ["WW-02", "Crispy Corn", 1, 220]),
  makeOrder("ORD-006", "CUST-002", "REST-001", "Spice Route Kitchen", "out_for_delivery", 430, "2026-09-16T12:30:00Z", ["SR-02", "Paneer Tikka", 1, 260], ["SR-03", "Garlic Naan", 2, 65]),
  makeOrder("ORD-007", "CUST-002", "REST-004", "Coastal Curry House", "cancelled", 550, "2026-09-07T19:00:00Z", ["CC-01", "Malabar Fish Curry Meal", 1, 420], ["CC-02", "Appam (2 pcs)", 1, 90]),
  makeOrder("ORD-008", "CUST-003", "REST-004", "Coastal Curry House", "delivered", 610, "2026-09-08T12:10:00Z", ["CC-02", "Appam (2 pcs)", 2, 90], ["CC-03", "Prawn Roast", 1, 390]),
  makeOrder("ORD-009", "CUST-003", "REST-003", "Wok This Way", "pending", 550, "2026-09-17T10:05:00Z", ["WW-01", "Chilli Garlic Noodles", 1, 290], ["WW-02", "Crispy Corn", 1, 220]),
  makeOrder("ORD-010", "CUST-003", "REST-002", "Green Bowl Co.", "delivered", 645, "2026-09-10T13:25:00Z", ["GB-01", "Avocado Grain Bowl", 1, 320], ["GB-02", "Grilled Tofu Salad", 1, 285]),
  makeOrder("ORD-011", "CUST-004", "REST-005", "Little Oven Pizza", "delivered", 880, "2026-09-11T18:55:00Z", ["LO-01", "Margherita Pizza", 1, 375], ["LO-02", "Farmhouse Pizza", 1, 465]),
  makeOrder("ORD-012", "CUST-004", "REST-004", "Coastal Curry House", "preparing", 550, "2026-09-18T12:40:00Z", ["CC-01", "Malabar Fish Curry Meal", 1, 420], ["CC-02", "Appam (2 pcs)", 1, 90]),
  makeOrder("ORD-013", "CUST-005", "REST-003", "Wok This Way", "delivered", 550, "2026-09-12T19:15:00Z", ["WW-01", "Chilli Garlic Noodles", 1, 290], ["WW-02", "Crispy Corn", 1, 220]),
  makeOrder("ORD-014", "CUST-005", "REST-001", "Spice Route Kitchen", "pending", 445, "2026-09-19T11:35:00Z", ["SR-01", "Butter Chicken", 1, 340], ["SR-03", "Garlic Naan", 1, 65]),
  makeOrder("ORD-015", "CUST-005", "REST-002", "Green Bowl Co.", "delivered", 645, "2026-09-14T13:45:00Z", ["GB-01", "Avocado Grain Bowl", 1, 320], ["GB-02", "Grilled Tofu Salad", 1, 285])
]);

print("\n=== READ QUERIES ===");
print("Restaurants rated above 4:");
printjson(restaurants.find(
  { rating: { $gt: 4 } },
  { _id: 0, name: 1, rating: 1, "address.city": 1 }
).toArray());

print("Orders in delivery or delivered status, with total between 400 and 700:");
printjson(orders.find(
  { status: { $in: ["delivered", "out_for_delivery"] }, totalAmount: { $gt: 400, $lt: 700 } },
  { _id: 1, customerId: 1, restaurantName: 1, status: 1, totalAmount: 1 }
).toArray());

print("Customers with an address in Bengaluru:");
printjson(customers.find(
  { "addresses.city": { $eq: "Bengaluru" } },
  { _id: 0, name: 1, email: 1, loyaltyPoints: 1, "addresses.city": 1 }
).toArray());

print("\n=== UPDATE OPERATIONS ===");
const statusUpdate = orders.updateOne(
  { _id: "ORD-003", status: { $ne: "delivered" } },
  { $set: { status: "delivered", deliveredAt: new Date("2026-09-15T20:05:00Z") } }
);
print(`$set order status: ${statusUpdate.modifiedCount} document(s) updated`);

const logUpdate = orders.updateOne(
  { _id: "ORD-006", "deliveryLog.eventId": { $ne: "DEMO-EVT-006" } },
  { $push: { deliveryLog: { eventId: "DEMO-EVT-006", status: "out_for_delivery", note: "Courier accepted delivery.", at: new Date("2026-09-16T13:00:00Z") } } }
);
print(`$push delivery log: ${logUpdate.modifiedCount} document(s) updated`);

const pointsUpdate = customers.updateOne(
  { _id: "CUST-001", "demoMarkers.loyaltyBonus": { $ne: "QUICKEATS-DEMO-25" } },
  { $inc: { loyaltyPoints: 25 }, $set: { "demoMarkers.loyaltyBonus": "QUICKEATS-DEMO-25" } }
);
print(`$inc loyalty points: ${pointsUpdate.modifiedCount} document(s) updated`);

print("\n=== DELIVERED REVENUE BY RESTAURANT ===");
printjson(orders.aggregate([
  { $match: { status: "delivered" } },
  { $group: { _id: "$restaurantName", totalRevenue: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } },
  { $project: { _id: 0, restaurantName: "$_id", totalRevenue: 1, orderCount: 1 } },
  { $sort: { totalRevenue: -1 } }
]).toArray());

print("\n=== INDEX EXPLAIN COMPARISON ===");
const explainFilter = { customerId: "CUST-001", status: "delivered" };
const targetIndex = { customerId: 1, status: 1 };
const targetIndexName = "customerId_1_status_1";

// Remove this demonstration index if the script is rerun, so the baseline is unindexed.
orders.getIndexes().forEach((index) => {
  if (index.name !== "_id_" && EJSON.stringify(index.key) === EJSON.stringify(targetIndex)) {
    orders.dropIndex(index.name);
  }
});

const beforeExplain = orders.find(explainFilter).explain("executionStats");
print("Before compound index:");
printjson({
  nReturned: beforeExplain.executionStats.nReturned,
  totalDocsExamined: beforeExplain.executionStats.totalDocsExamined,
  totalKeysExamined: beforeExplain.executionStats.totalKeysExamined,
  winningPlan: beforeExplain.queryPlanner.winningPlan
});

orders.createIndex(targetIndex);
const afterExplain = orders.find(explainFilter).explain("executionStats");
print("After compound index { customerId: 1, status: 1 }:");
printjson({
  nReturned: afterExplain.executionStats.nReturned,
  totalDocsExamined: afterExplain.executionStats.totalDocsExamined,
  totalKeysExamined: afterExplain.executionStats.totalKeysExamined,
  winningPlan: afterExplain.queryPlanner.winningPlan
});

print("Comparison:");
printjson({
  beforeTotalDocsExamined: beforeExplain.executionStats.totalDocsExamined,
  afterTotalDocsExamined: afterExplain.executionStats.totalDocsExamined,
  documentsExaminedReduction: beforeExplain.executionStats.totalDocsExamined - afterExplain.executionStats.totalDocsExamined,
  index: orders.getIndexes().find((index) => index.name === targetIndexName)
});
