# QuickEats restaurant revenue report

This script runs an aggregation on `quickeats_db.orders`. It filters delivered orders, totals revenue and order count by restaurant, removes `_id` from the output, sorts by revenue descending, and returns the top three restaurants.

Run the Task2 seed script first. Run Task3 as well if the report should reflect its status updates. Then execute from this directory:

```powershell
mongosh --file .\restaurant_revenue_report.js
```

The script prints the aggregation results in Mongosh.
