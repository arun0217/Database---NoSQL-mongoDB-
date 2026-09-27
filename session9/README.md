# Session 9 — MongoDB Tools

This session prepares a local `spotifyDB` database with a `playlists` collection, imports 12 sample restaurant documents into `zomatoRestaurants`, exports that collection, and provides scripts to import and count the documents in Atlas. The Atlas steps require an account and cluster created by you; connection credentials stay in a PowerShell environment variable and are not stored in these files.

## Install tools

Compass and MongoDB Database Tools are installed/downloaded separately from MongoDB Server. The official downloads used for this session are:

- [MongoDB Compass for Windows](https://downloads.mongodb.com/compass/mongodb-compass-1.51.0-win32-x64.exe)
- [MongoDB Database Tools for Windows](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.19.0.zip)

Extract the Database Tools ZIP under `%LOCALAPPDATA%\MongoDB\tools\database-tools`. The scripts search that directory recursively for `mongoimport.exe` and `mongoexport.exe`.

## Local database and Compass

In PowerShell, start the session's local server:

```powershell
.\start-mongodb.ps1
```

In a second PowerShell window, initialize the database, import the JSON, export the collection, and verify the local count:

```powershell
.\run-session9.ps1
```

The server listens only on `127.0.0.1:27019`; its data is stored under `%LOCALAPPDATA%\MongoDB\data\session9\db`. The restaurant source file is `restaurants.json`, and the generated export is `export\zomatoRestaurants.json`. The run output is saved in `results.txt`.

To view the local data in Compass, connect to `mongodb://127.0.0.1:27019`. The setup script creates `spotifyDB.playlists`. To perform the JSON import in Compass itself, open `spotifyDB`, create/open `zomatoRestaurants`, select **Add Data > Import JSON**, choose `restaurants.json`, select JSON/Array as the file format, and import. The session runner also performs the same import with `mongoimport --jsonArray --drop` so the documented export/import workflow is repeatable.

## Atlas account, import, and verification

1. Sign in or [create a free MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register), create a free shared cluster, and add a database user.
2. In Atlas Network Access, allow your current IP address. In the cluster's Connect dialog, select the MongoDB Shell connection string and ensure it targets the `instaClone` database.
3. In the PowerShell window used for this session, set the URI without saving it in a file:

```powershell
$env:MONGODB_ATLAS_URI = "mongodb+srv://<database-user>:<password>@<cluster-host>/instaClone?retryWrites=true&w=majority"
```

4. Import the exported local collection, then verify the count:

```powershell
.\import-to-atlas.ps1
.\verify-atlas.ps1
```

The expected count is 12. In Compass, create a new connection using the same Atlas URI, open `instaClone.zomatoRestaurants`, and verify the Documents view shows 12 documents. Clear the URI from the PowerShell session when finished with `Remove-Item Env:MONGODB_ATLAS_URI`.

Do not commit a real Atlas URI or share it in chat. The `<...>` values above are placeholders; replace them only in your local PowerShell session.