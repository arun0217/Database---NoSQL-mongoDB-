# Session 4 — Query Operators

The script creates and fills `session4_queries.playlists` with seven Spotify-style playlist documents, then runs each requested query with its projection, sort, and limit.

## Run it

The server and shell use the portable MongoDB Community Server 8.0.30 and mongosh 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`. In PowerShell, start the local server from this folder:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session4.ps1
```

The output is saved in `results.txt`, and the server data is stored under `%LOCALAPPDATA%\MongoDB\data\session4\db`. The script clears only the `playlists` collection before inserting its sample documents, so it can be run again without creating duplicates.

## Query 5 filter

```javascript
{ followers: { $gt: 5000 }, likes: { $gte: 1000 } }
```

The filter combines two field conditions: followers must be greater than 5000 and likes must be at least 1000. Both must match.
