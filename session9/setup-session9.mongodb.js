const spotifyDb = db.getSiblingDB("spotifyDB");

if (!spotifyDb.getCollectionNames().includes("playlists")) {
  spotifyDb.createCollection("playlists");
}

print("Created or verified spotifyDB.playlists.");