const restaurantCount = db.getSiblingDB("spotifyDB").zomatoRestaurants.countDocuments();
print(`Local spotifyDB.zomatoRestaurants document count: ${restaurantCount}`);

if (restaurantCount !== 12) {
  throw new Error(`Expected 12 restaurant documents, found ${restaurantCount}.`);
}