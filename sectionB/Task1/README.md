# QuickEats restaurant database

This script creates the `quickeats_db` database and `restaurants` collection, inserts five restaurants, prints every document with an unfiltered `find()`, and checks the collection count.

Run it once in a MongoDB shell from this directory:

```powershell
mongosh --file .\quickeats.js
```

The database is created on the MongoDB server selected by your `mongosh` connection. The script does not clear an existing collection; running it again inserts five more documents.
