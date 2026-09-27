const performanceDb = db.getSiblingDB("session7_indexing");
const restaurants = performanceDb.getCollection("restaurants");

if (performanceDb.getCollectionNames().includes("restaurants")) {
  restaurants.drop();
}
performanceDb.createCollection("restaurants");

restaurants.insertMany([
  { name: "Italiano Verde", cuisine: "Italian", location: "Surat", rating: 4.6 },
  { name: "Trattoria Roma", cuisine: "Italian", location: "Surat", rating: 4.4 },
  { name: "Bella Pasta", cuisine: "Italian", location: "Ahmedabad", rating: 4.7 },
  { name: "Olive Oven", cuisine: "Italian", location: "Surat", rating: 4.8 },
  { name: "La Piazza", cuisine: "Italian", location: "Vadodara", rating: 4.3 },
  { name: "Golden Wok", cuisine: "Chinese", location: "Ahmedabad", rating: 4.5 },
  { name: "Dragon Pearl", cuisine: "Chinese", location: "Ahmedabad", rating: 4.2 },
  { name: "Red Lantern", cuisine: "Chinese", location: "Ahmedabad", rating: 4.7 },
  { name: "Lotus Bowl", cuisine: "Chinese", location: "Surat", rating: 4.1 },
  { name: "Wok Story", cuisine: "Chinese", location: "Mumbai", rating: 4.4 },
  { name: "Firestone Pizza", cuisine: "Pizza", location: "Surat", rating: 4.8 },
  { name: "Crust and Co", cuisine: "Pizza", location: "Surat", rating: 4.6 },
  { name: "Slice Garden", cuisine: "Pizza", location: "Surat", rating: 4.4 },
  { name: "Brick Oven", cuisine: "Pizza", location: "Surat", rating: 4.7 },
  { name: "Napoli Express", cuisine: "Pizza", location: "Surat", rating: 4.5 },
  { name: "Urban Slice", cuisine: "Pizza", location: "Surat", rating: 4.2 },
  { name: "Cheese Circle", cuisine: "Pizza", location: "Surat", rating: 4.9 },
  { name: "Basil Base", cuisine: "Pizza", location: "Surat", rating: 4.3 },
  { name: "Spice Route", cuisine: "Indian", location: "Ahmedabad", rating: 4.6 },
  { name: "Cafe Amber", cuisine: "Cafe", location: "Surat", rating: 4.1 }
]);

if (restaurants.countDocuments() !== 20) {
  throw new Error("Expected 20 sample restaurants.");
}

function summarizeExplain(label, explainResult) {
  const stats = explainResult.executionStats;
  const winningPlan = JSON.stringify(explainResult.queryPlanner.winningPlan);
  print(`${label}:`);
  print(`  executionTimeMillis: ${stats.executionTimeMillis}`);
  print(`  totalKeysExamined: ${stats.totalKeysExamined}`);
  print(`  totalDocsExamined: ${stats.totalDocsExamined}`);
  print(`  nReturned: ${stats.nReturned}`);
  print(`  winningPlan: ${winningPlan}`);
}

print("Database: session7_indexing");
print("1) All Italian restaurants:");
restaurants.find({ cuisine: "Italian" }).forEach(restaurant => printjson(restaurant));

print("2) Italian query before adding an index:");
const italianFilter = { cuisine: "Italian" };
const beforeIndex = restaurants.find(italianFilter).explain("executionStats");
summarizeExplain("Before cuisine index", beforeIndex);

const cuisineIndexName = restaurants.createIndex({ cuisine: 1 });
const afterCuisineIndex = restaurants.find(italianFilter)
  .hint(cuisineIndexName)
  .explain("executionStats");
summarizeExplain("After cuisine index", afterCuisineIndex);
print(`Observation: the cuisine index reduced documents examined from ${beforeIndex.executionStats.totalDocsExamined} to ${afterCuisineIndex.executionStats.totalDocsExamined}; this run measured ${beforeIndex.executionStats.executionTimeMillis} ms before and ${afterCuisineIndex.executionStats.executionTimeMillis} ms after indexing.`);

if (!JSON.stringify(afterCuisineIndex.queryPlanner.winningPlan).includes(cuisineIndexName)) {
  throw new Error("The cuisine index was not used for the indexed Italian query.");
}

print("3) Chinese restaurants in Ahmedabad using the cuisine/location index:");
const compoundIndexName = restaurants.createIndex({ cuisine: 1, location: 1 });
const chineseAhmedabadFilter = { cuisine: "Chinese", location: "Ahmedabad" };
restaurants.find(chineseAhmedabadFilter).forEach(restaurant => printjson(restaurant));
const compoundExplain = restaurants.find(chineseAhmedabadFilter).explain("executionStats");
summarizeExplain("Chinese in Ahmedabad", compoundExplain);
if (!JSON.stringify(compoundExplain.queryPlanner.winningPlan).includes(compoundIndexName)) {
  throw new Error("The compound cuisine/location index was not used.");
}

print("4) Drop the single-field cuisine index and recheck the Italian query:");
restaurants.dropIndex(cuisineIndexName);
const afterDrop = restaurants.find(italianFilter).explain("executionStats");
summarizeExplain("After dropping cuisine_1", afterDrop);
if (!restaurants.getIndexes().some(index => index.name === compoundIndexName)) {
  throw new Error("The compound cuisine/location index should remain for the prefix-index comparison.");
}
print(`Observation: after dropping cuisine_1, MongoDB examined ${afterDrop.executionStats.totalDocsExamined} documents in ${afterDrop.executionStats.executionTimeMillis} ms using ${compoundIndexName}'s cuisine prefix.`);
print("The timings are noisy on this 20-document fixture; the winning plan and documents examined are more useful for comparing the index paths.");

print("5) ChatGPT-generated top-five Pizza restaurants in Surat query:");
const pizzaIndexName = restaurants.createIndex({ cuisine: 1, location: 1, rating: -1 });
print("db.restaurants.createIndex({ cuisine: 1, location: 1, rating: -1 });");
print("db.restaurants.find({ cuisine: 'Pizza', location: 'Surat' }).sort({ rating: -1 }).limit(5).hint('cuisine_1_location_1_rating_-1');");
print("The index narrows by cuisine and location, then supplies results in descending rating order, avoiding a blocking sort.");

const topPizzaRestaurants = restaurants.find({ cuisine: "Pizza", location: "Surat" })
  .sort({ rating: -1 })
  .limit(5)
  .hint(pizzaIndexName)
  .toArray();
topPizzaRestaurants.forEach(restaurant => printjson(restaurant));
const topPizzaExplain = restaurants.find({ cuisine: "Pizza", location: "Surat" })
  .sort({ rating: -1 })
  .limit(5)
  .hint(pizzaIndexName)
  .explain("executionStats");
summarizeExplain("Top-five Pizza query", topPizzaExplain);

if (topPizzaRestaurants.length !== 5 || topPizzaRestaurants[0].rating !== 4.9) {
  throw new Error("The top-five Pizza query returned unexpected results.");
}