# MongoDB Aggregation Pipeline Assignment

## 1. Exact prompt given to the AI

> Write a MongoDB aggregation pipeline for a collection called `deliveries` with fields `driverId` (string), `orderId` (string), `restaurantName` (string), `deliveryTimeMinutes` (number), `tip` (number), and `status` (string). Use `$match` to include only completed deliveries, group by `driverId` to calculate average delivery time and total tips, sort by average delivery time ascending, then use `$project` to output `driverID`, `avgDeliveryTime`, and `totalTips` while suppressing `_id`.

## 2. AI's original pipeline

```javascript
db.deliveries.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$driverId",
      avgDeliveryTime: { $avg: "$deliveryTimeMinutes" },
      totalTips: { $sum: "$tip" }
    }
  },
  { $sort: { avgDeliveryTime: 1 } },
  {
    $project: {
      _id: 0,
      driverID: "$_id",
      avgDeliveryTime: 1,
      totalTips: 1
    }
  }
])
```

### My corrected version

Complete this after testing the original pipeline in mongosh without AI.

```javascript
```

## 3. Test and debugging note

Replace these prompts with a 3-4-line note based on your own mongosh test.

- Sample data inserted and tested:
- Bug, limitation, or improvement observed:
- Change made and why:
