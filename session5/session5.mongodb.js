const sessionDb = db.getSiblingDB("session5_updates");

function prepareCollection(name) {
  if (!sessionDb.getCollectionNames().includes(name)) {
    sessionDb.createCollection(name);
  }
  sessionDb.getCollection(name).deleteMany({});
}

print("Using database: session5_updates");

print("1) Set Evening Vibes genre to Chill");
prepareCollection("playlists");
sessionDb.playlists.insertOne({
  name: "Evening Vibes",
  genre: "Electronic",
  songs: ["Soft Lights", "After Hours"]
});
const genreUpdate = sessionDb.playlists.updateOne(
  { name: "Evening Vibes" },
  { $set: { genre: "Chill" } }
);
printjson(genreUpdate);
printjson(sessionDb.playlists.findOne({ name: "Evening Vibes" }, { _id: 0 }));

print("2) Unset temporaryOffer on every restaurant with an expired offer");
prepareCollection("restaurants");
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
sessionDb.restaurants.insertMany([
  { name: "Curry House", temporaryOffer: "20% off", offerExpiresAt: yesterday },
  { name: "Pizza Point", temporaryOffer: "Free delivery", offerExpiresAt: yesterday },
  { name: "Garden Table", temporaryOffer: "10% off", offerExpiresAt: tomorrow }
]);
const expiredOfferUpdate = sessionDb.restaurants.updateMany(
  { offerExpiresAt: { $lt: now } },
  { $unset: { temporaryOffer: "" } }
);
printjson(expiredOfferUpdate);
sessionDb.restaurants.find({}, { _id: 0 }).sort({ name: 1 }).forEach(printjson);
const expiredOffersRemaining = sessionDb.restaurants.countDocuments({
  offerExpiresAt: { $lt: now },
  temporaryOffer: { $exists: true }
});
if (expiredOffersRemaining !== 0 || sessionDb.restaurants.findOne({ name: "Garden Table" }).temporaryOffer !== "10% off") {
  throw new Error("Expired offers were not cleared correctly, or the active offer was changed.");
}
print("Verified: expired offer fields are gone and the active offer remains.");

print("3) Push Calm Waters onto playlist _id 101");
sessionDb.playlists.insertOne({
  _id: 101,
  name: "Quiet Shores",
  genre: "Ambient",
  songs: ["Blue Horizon", "Still Water"]
});
const songPush = sessionDb.playlists.updateOne(
  { _id: 101 },
  { $push: { songs: "Calm Waters" } }
);
printjson(songPush);
printjson(sessionDb.playlists.findOne({ _id: 101 }));
if (!sessionDb.playlists.findOne({ _id: 101 }).songs.includes("Calm Waters")) {
  throw new Error("Calm Waters was not added to playlist _id 101.");
}

print("4) Add the trending tag to SKU F12345 with addToSet, twice to check for duplicates");
prepareCollection("products");
sessionDb.products.insertOne({
  sku: "F12345",
  name: "Wireless Earbuds",
  tags: ["audio", "sale"],
  stock: 1
});
const firstTagUpdate = sessionDb.products.updateOne(
  { sku: "F12345" },
  { $addToSet: { tags: "trending" } }
);
const repeatedTagUpdate = sessionDb.products.updateOne(
  { sku: "F12345" },
  { $addToSet: { tags: "trending" } }
);
printjson(firstTagUpdate);
printjson(repeatedTagUpdate);
printjson(sessionDb.products.findOne({ sku: "F12345" }, { _id: 0 }));
const trendingTagCount = sessionDb.products.findOne({ sku: "F12345" }).tags.filter(tag => tag === "trending").length;
if (trendingTagCount !== 1) {
  throw new Error("The trending tag is not present exactly once.");
}

print("5) Decrease Wireless Earbuds stock with inc, while stock is above zero");
const firstPurchase = sessionDb.products.updateOne(
  { name: "Wireless Earbuds", stock: { $gt: 0 } },
  { $inc: { stock: -1 } }
);
const outOfStockPurchase = sessionDb.products.updateOne(
  { name: "Wireless Earbuds", stock: { $gt: 0 } },
  { $inc: { stock: -1 } }
);
printjson(firstPurchase);
printjson(outOfStockPurchase);
const finalProduct = sessionDb.products.findOne({ name: "Wireless Earbuds" }, { _id: 0 });
printjson(finalProduct);
if (finalProduct.stock < 0 || firstPurchase.modifiedCount !== 1 || outOfStockPurchase.matchedCount !== 0) {
  throw new Error("Stock update failed or stock went below zero.");
}
print("Verified: stock is never negative; a purchase at zero stock is not applied.");
