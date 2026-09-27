# Session 2 — MongoDB Create/Drop Operations

The command list creates `insta_clone_db`, switches to it, creates `posts` and `stories`, inserts and displays one sample story, drops `stories`, lists the remaining collections, drops the database, and lists databases to confirm it is gone.

## Run it

The server and shell binaries are shared from `%LOCALAPPDATA%\MongoDB\tools` (MongoDB Community Server 8.0.30 and mongosh 2.12.0). In PowerShell, start the server in this folder:

```powershell
.\start-mongodb.ps1
```

Leave it running. In a second PowerShell window, run:

```powershell
.\run-session2.ps1
```

The command output is saved in `results.txt`. The server stores its files under `%LOCALAPPDATA%\MongoDB\data\session2\db`. The command list is also available in `mongo-shell-commands.txt` for review or use in an interactive `mongosh` session.
