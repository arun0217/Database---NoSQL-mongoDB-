# Session 5 — Update Operators

The script demonstrates `$set`, `$unset`, `$push`, `$addToSet`, and `$inc` in the `session5_updates` database. It also checks that an active restaurant offer is preserved, repeated `$addToSet` does not duplicate a tag, and a purchase at zero stock does not decrement stock below zero.

## Run it

The server and shell use the portable MongoDB Community Server 8.0.30 and mongosh 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`. In PowerShell, start the local server from this folder:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session5.ps1
```

The output is saved in `results.txt`, and the server data is kept under `%LOCALAPPDATA%\MongoDB\data\session5\db`. The script resets only the collections used by this exercise before inserting its sample data, so it can be run again with the same results.
