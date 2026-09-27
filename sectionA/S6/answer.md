# Compound Indexes for Order Search

MongoDB indexes keep indexed field values in an ordered structure, along with references to the documents that contain those values. For a normal ascending or descending index, MongoDB can navigate this structure to find matching records instead of scanning every document in the collection. A compound index stores more than one field in sequence, so it can support queries that use both fields and queries that use a leading prefix of the index.

Create the suggested index on the orders collection with:

```javascript
db.orders.createIndex({ customerId: 1, status: 1 })
```

Here, `1` means ascending order. This index is suited to searches that filter by both `customerId` and `status`; because `customerId` is first, it can also support searches by `customerId` alone. It is not as useful for a query filtering only by `status`, since status is not the leading field.

An index has a cost. MongoDB must add index entries when documents are inserted, remove them on deletes, and update the relevant entries when indexed values change. Each index also takes disk space and uses memory when active. Too many indexes, indexes that the application rarely uses, or a write-heavy workload that frequently changes indexed fields can slow writes and consume resources. An index may also provide little read benefit when its filter matches a large portion of the collection.

For QuickEats, the index is likely worth considering because the customer-and-status search is frequent and currently takes over two seconds on 500,000 documents. The case is strongest when those filters narrow the results substantially and the faster reads matter more than the added write work. Check the query plan and execution statistics before and after creating it:

```javascript
db.orders.find({
  customerId: "CUST-001",
  status: "confirmed"
}).explain("executionStats")
```

If the index is used and the number of documents or index keys examined falls substantially, it is helping this query. Keep it only if that read improvement justifies its storage and write cost for the application's overall workload.

References: MongoDB documentation on [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/), [write performance](https://www.mongodb.com/docs/manual/core/write-performance/), and [query plan analysis](https://www.mongodb.com/docs/manual/tutorial/analyze-query-plan/).
