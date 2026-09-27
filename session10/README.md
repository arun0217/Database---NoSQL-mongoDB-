# Session 10 — Food Delivery Mini Project

This exercise creates five restaurants and three sample orders in `foodDeliveryApp`, runs order-count and average-order aggregations, assigns each order a random delivery status, and counts pending orders. Rerunning the script resets these two collections to the sample data before processing.

## Run it

The scripts use the MongoDB Community Server and mongosh stored under `%LOCALAPPDATA%\MongoDB\tools`. Start the isolated local server in PowerShell:

```powershell
.\start-mongodb.ps1
```

Leave that window open. In a second PowerShell window, run:

```powershell
.\run-session10.ps1
```

The server listens on `127.0.0.1:27020` and stores its database files under `%LOCALAPPDATA%\MongoDB\data\session10\db`. The run output is saved in `results.txt`.

## Results

The restaurant collection contains five distinct records. The orders reference restaurants using ObjectId values in `restaurant_id`; two orders are for Saffron Courtyard and one is for Olive Street Kitchen. The count aggregation returns 2 and 1 orders respectively. The average-order aggregation returns the Olive Street Kitchen restaurant ID with an average of 450, followed by the Saffron Courtyard restaurant ID with an average of 235.

On every run, each order receives a randomly selected `delivery_status` from `pending`, `out for delivery`, or `delivered`. The script prints the assigned status for every order and the current pending count, which can vary from run to run.