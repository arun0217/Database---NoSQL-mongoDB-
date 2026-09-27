# QuickEats order queries

This Mongosh script creates `quickeats_db.orders` if needed, inserts eight sample orders with ISODate values, and runs two queries:

1. Delivered orders with `totalAmount` greater than 400, using `$gt` and `$eq`.
2. Orders with `status` in `pending` or `confirmed`, using `$in`.

Both queries return only `customerId`, `totalAmount`, and `status`, sort by `totalAmount` descending, and limit results to five documents.

Run once from this directory:

```powershell
mongosh --file .\quickeats_orders.js
```

The script does not clear an existing collection; running it again inserts eight more orders. It targets the MongoDB server selected by your `mongosh` connection.
