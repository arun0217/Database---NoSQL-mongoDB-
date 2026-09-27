# QuickEats MongoDB mini project

This project creates the `quickeats_db` database with `restaurants`, `orders`, and `customers` collections. The seed includes 5 restaurants, 15 orders, and 5 customers. Restaurants have nested menus, orders have item and delivery-log arrays, and customers have address arrays.

## Run it

Start a MongoDB server, then run this from the project directory:

```powershell
mongosh "mongodb://localhost:27017" --file .\quickeats.mongodb.js
```

For MongoDB Atlas, replace the URI with your connection string. The script selects `quickeats_db` itself. It upserts the sample documents, so rerunning it refreshes the seeded IDs without deleting other records. The three demonstration updates are guarded so their effects do not repeat on each run.

The script runs three projected read queries, demonstrates `$set`, `$push`, and `$inc`, prints a delivered-order revenue aggregation grouped by restaurant, and creates the compound index `{ customerId: 1, status: 1 }` on `orders`.

## Explain comparison and screenshot

The script explains this filtered query with `executionStats` before and after creating the compound index:

```javascript
{ customerId: "CUST-001", status: "delivered" }
```

On a clean database, the seeded collection has 15 orders. The order update in the script makes four orders match that query, so the expected `totalDocsExamined` is 15 before the index and 4 after it. The script prints both measured values and each winning plan. If this database already contains additional order documents, the measured baseline will reflect them.

To make the requested screenshot, run the command above in a terminal and capture the printed `=== INDEX EXPLAIN COMPARISON ===` section, including both `totalDocsExamined` values. No screenshot is included yet: this workspace has no MongoDB server or `mongosh`, so those measurements cannot be captured here.
