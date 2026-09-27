# Weekly Revenue by Restaurant

This example assumes each order has a `restaurantId`, `status`, numeric `totalAmount`, and `createdAt` stored as a BSON Date. The date bounds below show one UTC week, from Monday, September 21 through (but not including) Monday, September 28, 2026. Change them to the week being reported if needed.

```javascript
db.orders.aggregate([
  {
    $match: {
      status: "completed",
      createdAt: {
        $gte: ISODate("2026-09-21T00:00:00Z"),
        $lt: ISODate("2026-09-28T00:00:00Z")
      }
    }
  },
  {
    $group: {
      _id: "$restaurantId",
      totalRevenue: { $sum: "$totalAmount" },
      completedOrderCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      restaurantId: "$_id",
      totalRevenue: 1,
      completedOrderCount: 1
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])
```

- `$match` keeps only completed orders placed within the selected week. Putting this filter first reduces how many documents later stages need to process.
- `$group` creates one result per `restaurantId`. It adds each matching order's `totalAmount` to `totalRevenue` and adds 1 to `completedOrderCount` for each order.
- `$project` formats the output fields and renames the group key from `_id` to `restaurantId`.
- `$sort` ranks the restaurant results by revenue, highest first (`-1` means descending).

The database can filter and aggregate the orders where they are stored, then return only one summary document per restaurant. That avoids sending every matching order to Node.js and doing the grouping there, which reduces network transfer, application memory use, and work in the Node.js process. An index such as `{ status: 1, createdAt: 1 }` can help the initial filter; the best index should be checked against the real query plan and data. `$group` and `$sort` still use database resources, so aggregation is not cost-free.

References: MongoDB documentation for [`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/), [`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/), [`$project`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/), [`$sort`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/), and [aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/).
