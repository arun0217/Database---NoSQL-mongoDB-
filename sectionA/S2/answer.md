# Inserting Orders in MongoDB

`insertOne()` adds a single document to a collection. `insertMany()` adds an array of documents in one operation, so it is useful when several records need to be loaded together.

In `mongosh`, select the database and create the collection first. MongoDB creates the database when data is first written to it; `createCollection()` creates `orders` explicitly.

```javascript
use quickeats_db

db.createCollection("orders")

db.orders.insertOne({
  customerName: "Asha Patel",
  items: [
    { name: "Paneer Wrap", quantity: 2, price: 180 },
    { name: "Lemonade", quantity: 1, price: 60 }
  ],
  totalAmount: 420,
  deliveryAddress: "24 Lake Road, Pune",
  status: "Placed"
})

db.orders.insertMany([
  {
    customerName: "Rohan Mehta",
    items: [
      { name: "Veg Burger", quantity: 1, price: 150 },
      { name: "Fries", quantity: 1, price: 90 }
    ],
    totalAmount: 240,
    deliveryAddress: "8 Park Street, Pune",
    status: "Preparing"
  },
  {
    customerName: "Neha Shah",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 140 }
    ],
    totalAmount: 280,
    deliveryAddress: "16 Hill View, Pune",
    status: "Placed"
  },
  {
    customerName: "Arjun Rao",
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 260 },
      { name: "Raita", quantity: 1, price: 40 }
    ],
    totalAmount: 300,
    deliveryAddress: "42 Garden Lane, Pune",
    status: "Out for delivery"
  }
])
```

For a batch of orders, `insertMany()` is preferred to calling `insertOne()` repeatedly because the client sends the documents together in one operation. This reduces repeated communication between the app and MongoDB and makes bulk loading more efficient. By default, MongoDB processes the batch in order and stops at an error; the other documents may already have been inserted, so the application should handle the result if a batch contains invalid data.
