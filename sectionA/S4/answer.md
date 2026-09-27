# Updating an Order's Status History

MongoDB update operators handle different kinds of changes:

- `$set` assigns a value to a field. It can change an existing field or create the field if it is missing.
- `$push` appends a value to an array. It adds the value even if an identical value is already there.
- `$addToSet` adds a value to an array only when that exact value is not already present. It is useful when duplicate entries should be avoided.

For an accepted order, use `$set` for the current status and restaurant note, and `$push` for the new history event. A history is a record of events, so the new confirmation event should be appended even if a similar event already exists. Replace the sample ObjectId with the `_id` of the order being updated.

```javascript
db.orders.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      status: "confirmed",
      restaurantNote: "Order accepted"
    },
    $push: {
      statusHistory: {
        event: "confirmed",
        time: new Date()
      }
    }
  }
)
```

`$addToSet` would be appropriate if duplicate array values were unwanted, but here it could prevent a new event from being recorded if an identical event is already present. MongoDB's `$push` appends to an existing array; if the field is missing, it creates the array with the new value.

References: MongoDB documentation for [`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/), [`$push`](https://www.mongodb.com/docs/manual/reference/operator/update/push/), and [`$addToSet`](https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/).
