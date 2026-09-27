# QuickEats order updates

Run the Task2 script first so `quickeats_db.orders` contains the sample orders. Then run this script once to:

- Change one pending order to confirmed and set `confirmedAt` to the current date.
- Change all confirmed orders to delivered.
- Push a `dispatched` event with the current date into one order's `deliveryLog` array.
- Remove `confirmedAt` from the order that was just updated.

A `find()` query follows each update. The script also checks that the requested changes are present.

Run from this directory:

```powershell
mongosh --file .\quickeats_order_updates.js
```
