# Filtering Orders in MongoDB

The examples below use `customerName: "Asha Patel"` as the specific customer. Replace that value with the customer you want to look up.

```javascript
db.orders.find({
  status: { $in: ["pending", "confirmed"] },
  customerName: { $eq: "Asha Patel" },
  totalAmount: { $gt: 500 }
})
```

To return only the requested fields, sort by the largest total first, and keep the first 10 matches:

```javascript
db.orders.find(
  {
    status: { $in: ["pending", "confirmed"] },
    customerName: { $eq: "Asha Patel" },
    totalAmount: { $gt: 500 }
  },
  {
    _id: 0,
    customerName: 1,
    totalAmount: 1,
    status: 1
  }
).sort({ totalAmount: -1 }).limit(10)
```

In this filter, `$in` matches either of the listed statuses, `$eq` matches the specified customer name exactly, and `$gt` matches totals strictly greater than Rs 500. In the projection, `1` includes a field and `_id: 0` excludes MongoDB's default `_id` field, so only the three requested fields are returned. `.sort({ totalAmount: -1 })` orders results by total amount descending, and `.limit(10)` returns at most 10 documents.

Since the collection is large, an appropriate index can help MongoDB find and sort matches more efficiently. One starting point for this query shape is:

```javascript
db.orders.createIndex({ customerName: 1, status: 1, totalAmount: -1 })
```

The best index depends on the data and other queries, so check the actual query plan with `explain("executionStats")`.

References: [comparison query operators](https://www.mongodb.com/docs/manual/reference/mql/query-predicates/comparison/), [find projections](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/), [cursor sort and limit](https://www.mongodb.com/docs/manual/reference/method/cursor.sort/), and [the Equality, Sort, Range guideline](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/).
