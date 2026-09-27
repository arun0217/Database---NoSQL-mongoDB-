# Session 8 — MongoDB Users and Roles

This session creates the `insta_clone` database, adds `storyAdmin` with `dbAdmin` and `feedViewer` with `read`, lists the users, and verifies that `feedViewer` cannot insert a post. The final check authenticates with mongosh's `-u` and `-p` options and expects MongoDB authorization error code 13.

## Run it

The scripts use the MongoDB Community Server 8.0.30 and mongosh 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`. In PowerShell, start the access-controlled server:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session8.ps1
```

The output is saved in `results.txt`; database files are kept under `%LOCALAPPDATA%\MongoDB\data\session8\db`. The server uses port 27018 so it does not collide with the other sessions.

On its first run, the script creates a local exercise administrator in the `admin` database so it can create the requested users on an access-controlled server. The exercise credentials are `session8Admin` / `S8-Session8-Admin`, `storyAdmin` / `S8-Story-Admin`, and `feedViewer` / `S8-Feed-Viewer`. They are for this local practice database only.

## Results and role difference

`db.getUsers()` lists `storyAdmin` with the `dbAdmin` role and `feedViewer` with the `read` role, both scoped to `insta_clone`. The insert attempt as `feedViewer` is rejected with `Unauthorized` (code 13), because `read` grants read access but no insert privilege.

The `read` role is database-wide, not collection-specific. This exercise creates only the `posts` and `comments` application collections, so those are the collections available to browse here; if more collections are later added to `insta_clone`, `feedViewer` can read those too. A custom role with `find` privileges on just `posts` and `comments` would be required for a strict per-collection restriction.

`dbAdmin` can perform administrative operations such as managing collections and indexes, but it does not grant permission to read or modify application documents. `read` does the opposite for data: it allows reads, but not changes.