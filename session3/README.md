# Session 3 — CRUD Operations

This exercise runs against the `session3_crud` database. It inserts a restaurant, inserts three movie records, queries products priced below 1000, updates Burger Hub's rating, and deletes only orders whose status is exactly `cancelled`.

## Run it

The server and shell use the portable MongoDB Community Server 8.0.30 and mongosh 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`. In PowerShell, start the local server from this folder:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session3.ps1
```

The output is saved in `results.txt`, and server data is kept under `%LOCALAPPDATA%\MongoDB\data\session3\db`. The script resets only the four collections used by this exercise before seeding them, so it can be run again with the same results.

## Movie sample data

The three titles are from Netflix's India Top 10 for September 14–20, 2026: [Vishwanath & Sons](https://www.netflix.com/tudum/top10/es/india), [Irumudi](https://www.netflix.com/tudum/top10/es/india), and [Dhamaal 4](https://www.netflix.com/tudum/top10/es/india). The IMDb ratings are sample snapshots and can change over time: [Vishwanath & Sons](https://www.imdb.com/title/tt35836025), [Irumudi](https://www.imdb.com/title/tt39108319), and [Dhamaal 4](https://www.imdb.com/title/tt27548557).
