const database = db.getSiblingDB("quickeats_db");
const orders = database.getCollection("orders");

const pendingOrder = orders.findOne({
  customerId: "CUST-1003",
  status: "pending"
});
const dispatchOrder = orders.findOne({ customerId: "CUST-1004" });

if (!pendingOrder) {
  throw new Error("No pending order for CUST-1003 was found. Run the Task2 script first.");
}
if (!dispatchOrder) {
  throw new Error("No order for CUST-1004 was found. Run the Task2 script first.");
}

print("Update one pending order to confirmed and set confirmedAt:");
const confirmResult = orders.updateOne(
  { _id: pendingOrder._id, status: "pending" },
  { $set: { status: "confirmed", confirmedAt: new Date() } }
);
if (confirmResult.matchedCount !== 1) {
  throw new Error("The pending order was not updated.");
}
orders.find({ _id: pendingOrder._id }).forEach(printjson);

print("Update every confirmed order to delivered:");
const dispatchResult = orders.updateMany(
  { status: "confirmed" },
  { $set: { status: "delivered" } }
);
if (dispatchResult.modifiedCount < 1) {
  throw new Error("No confirmed orders were changed to delivered.");
}
orders.find({ status: "confirmed" }).forEach(printjson);
orders.find({ status: "delivered" }).forEach(printjson);
orders.find({
  _id: { $in: [pendingOrder._id] },
  status: "delivered"
}).forEach(printjson);

print("Add a dispatched entry to one order's deliveryLog:");
const logResult = orders.updateOne(
  { _id: dispatchOrder._id },
  { $push: { deliveryLog: { event: "dispatched", time: new Date() } } }
);
if (logResult.matchedCount !== 1) {
  throw new Error("The order for CUST-1004 was not found for the delivery log update.");
}
orders.find({ _id: dispatchOrder._id }).forEach(printjson);

print("Remove confirmedAt from the order updated above:");
const unsetResult = orders.updateOne(
  { _id: pendingOrder._id, confirmedAt: { $exists: true } },
  { $unset: { confirmedAt: "" } }
);
if (unsetResult.modifiedCount !== 1) {
  throw new Error("The confirmedAt field was not removed.");
}
orders.find({ _id: pendingOrder._id }).forEach(printjson);

if (orders.countDocuments({ _id: pendingOrder._id, confirmedAt: { $exists: false } }) !== 1) {
  throw new Error("Verification failed: confirmedAt is still present.");
}
if (orders.countDocuments({
  _id: dispatchOrder._id,
  deliveryLog: { $elemMatch: { event: "dispatched" } }
}) !== 1) {
  throw new Error("Verification failed: dispatched event is missing from deliveryLog.");
}
print("Verified: status updates, deliveryLog entry, and confirmedAt removal.");

