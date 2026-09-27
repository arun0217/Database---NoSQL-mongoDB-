# Session 7 — Indexing and Performance

The exercise creates 20 sample restaurant documents in `session7_indexing.restaurants`, compares Italian-query execution stats before and after a cuisine index, checks a cuisine/location compound index, drops the single-field index, and runs an indexed top-five Pizza query for Surat.

## Run it

The scripts use the MongoDB Community Server and mongosh builds under `%LOCALAPPDATA%\MongoDB\tools`. Start the isolated local server:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In another PowerShell window, run:

```powershell
.\run-session7.ps1
```

The server listens on `127.0.0.1:27021`, stores files under `%LOCALAPPDATA%\MongoDB\data\session7\db`, and the captured output is saved to `results.txt`.

## Indexing notes

The script records `executionTimeMillis`, keys examined, documents examined, and the winning plan for each `explain("executionStats")` call. Small local queries can complete in 0 ms at millisecond resolution, so the examined-key/document counts and plan stages also show the difference between a collection scan and an index scan.

The compound `{ cuisine: 1, location: 1 }` index can serve queries on `cuisine` alone because `cuisine` is its leftmost prefix. Therefore dropping the separate `{ cuisine: 1 }` index does not necessarily return the Italian query to a collection scan; the captured winning plan shows what MongoDB actually selected.

For the final top-five query, the script creates `{ cuisine: 1, location: 1, rating: -1 }`. Its equality fields come first and its descending rating field supports the requested sort. The generated query explicitly hints this index.