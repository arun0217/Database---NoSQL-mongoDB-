const sessionDb = db.getSiblingDB("session4_queries");
const playlists = sessionDb.playlists;

if (!sessionDb.getCollectionNames().includes("playlists")) {
  sessionDb.createCollection("playlists");
}
playlists.deleteMany({});

print("1) Insert Spotify-style playlists with insertMany");
const inserted = playlists.insertMany([
  { name: "Pop Central", likes: 1750, genre: "Pop", followers: 12000 },
  { name: "Hip-Hop Heat", likes: 2400, genre: "Hip-Hop", followers: 18000 },
  { name: "Indie Roadtrip", likes: 750, genre: "Indie", followers: 3200 },
  { name: "Dancefloor Pop", likes: 500, genre: "Pop", followers: 6400 },
  { name: "Golden Classics", likes: 2000, genre: "Oldies", followers: 5300 },
  { name: "Rap Radar", likes: 950, genre: "Hip-Hop", followers: 1500 },
  { name: "Bedroom Acoustic", likes: 480, genre: "Acoustic", followers: 850 }
]);
printjson(inserted);
print(`Inserted playlist count: ${playlists.countDocuments()}`);

print("2) Playlists with more than 1000 followers (name and followers only)");
playlists.find(
  { followers: { $gt: 1000 } },
  { _id: 0, name: 1, followers: 1 }
).sort({ followers: -1 }).forEach(printjson);

print("3) Pop or Hip-Hop playlists, sorted by likes descending");
playlists.find({ genre: { $in: ["Pop", "Hip-Hop"] } })
  .sort({ likes: -1 })
  .forEach(printjson);

print("4) Likes from 500 through 2000 inclusive, top 3 by followers");
playlists.find({ likes: { $gte: 500, $lte: 2000 } })
  .sort({ followers: -1 })
  .limit(3)
  .forEach(printjson);

print("5) Trending filter: followers > 5000 and likes >= 1000 (name and genre only)");
playlists.find(
  { followers: { $gt: 5000 }, likes: { $gte: 1000 } },
  { _id: 0, name: 1, genre: 1 }
).sort({ followers: -1 }).forEach(printjson);
print("Explanation: $gt filters followers and $gte filters likes; both field conditions must match.");
