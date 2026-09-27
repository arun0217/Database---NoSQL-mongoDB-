# Session 1 — NoSQL Fundamentals

The shell script in this folder creates the `foodieApp` database and its `restaurants` collection, adds four sample restaurants, prints all documents, and reports each field's BSON type. Each restaurant has a `menu` array and a `location` object. The scripts use shared MongoDB Community Server 8.0.30 and MongoDB Shell 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`.

## Run it

1. In PowerShell, open this folder and start the local MongoDB server:

   ```powershell
   .\start-mongodb.ps1
   ```

   Leave that window open while using the shell. Database files are stored outside this folder under `%LOCALAPPDATA%\MongoDB\data\session1\db`.
2. Open another PowerShell window in this folder and run:

   ```powershell
   .\run-session1.ps1
   ```

The script clears only the `restaurants` collection before inserting its sample data, so it can be run again without adding duplicates. For a standard system-wide installation instead, see [MongoDB Community Edition for Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/) and [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/).

## BSON types shown

| Field | BSON type | Example |
| --- | --- | --- |
| `name` | String | `"Spice Route"` |
| `cuisine` | String | `"Indian"` |
| `rating` | Double | `4.5` |
| `location` | Object | `{ area: "Koramangala", city: "Bengaluru" }` |
| `menu` | Array | `["Paneer Tikka", "Butter Chicken", "Garlic Naan"]` |
| each `menu` item | String | `"Paneer Tikka"` |

`_id` is added automatically by MongoDB and is an ObjectId.
