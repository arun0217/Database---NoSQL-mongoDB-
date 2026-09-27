# Session 6 — Aggregation Framework

The script creates sample `orders`, `restaurants`, `movies`, and `payments` collections in `session6_aggregation`, then runs each requested aggregation. All date filters are relative to the time the script runs.

## Run it

The server and shell use the portable MongoDB Community Server 8.0.30 and mongosh 2.12.0 builds under `%LOCALAPPDATA%\MongoDB\tools`. In PowerShell, start the local server from this folder:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session6.ps1
```

The output is saved in `results.txt`, and the server data is kept under `%LOCALAPPDATA%\MongoDB\data\session6\db`.

## Daily sales pipeline (generated with ChatGPT)

```javascript
const reportNow = new Date();
const sevenDaysAgo = new Date(reportNow.getTime() - 7 * 24 * 60 * 60 * 1000);

const dailySalesPipeline = [
  { $match: { paymentDate: { $gte: sevenDaysAgo, $lte: reportNow } } },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$paymentDate",
          timezone: "Asia/Kolkata"
        }
      },
      totalSales: { $sum: "$amount" }
    }
  },
  { $project: { _id: 0, date: "$_id", totalSales: 1 } },
  { $sort: { date: 1 } }
];

db.payments.aggregate(dailySalesPipeline);
```

I used `paymentDate` for the time filter and `amount` for the daily total, grouped the dates in India time, and removed `_id` from the report output.
