I used Cloud to make the tables look good

## Deliverable 1 - actions and outcomes

| Action                                      | Possible Outcomes                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Place an order from a restaurant            | Order placed successfully / Upgrade prompt shown (Basic user > 5 km)                                                     |
| Schedule an order in advance                | Scheduled (up to 24h Basic / 7 days FoodNow+) / Scheduling disabled (restaurant doesn't support it)                     |
| Create a group order                        | Group order created (any user)                                                                                            |
| Add custom driver message to group order    | Message sent / Field greyed out (Basic user)                                                                              |
| Contact driver via in-app chat              | Free-text message sent (FoodNow+) / Pre-written message sent (Basic) / No message sent (driver disabled messaging)       |

## Deliverable 2 - select action - contact driver via in-app chat

|    | Condition                            | Values        |
| -- | ------------------------------------ | ------------- |
| C1 | Driver has in-app messaging enabled  | Yes / No      |
| C2 | User subscription type               | Basic / FoodNow+ |

## Deliverable 3 - condition combinations & expected outcomes

| Combination | C1: Driver Messaging Enabled | C2: Subscription | Expected Outcome          |
| ----------- | ---------------------------- | ---------------- | ------------------------- |
| T1          | Yes                          | Basic            | Pre-written message sent  |
| T2          | Yes                          | FoodNow+         | Free-text message sent    |
| T3          | No                           | Basic            | No message can be sent    |
| T4          | No                           | FoodNow+         | No message can be sent    |
