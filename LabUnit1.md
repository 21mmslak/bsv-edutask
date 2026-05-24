## Work distribution

This assignment was completed during a video chat session between the group members where they discussed and worked together on completing it.

## 1
#### 1.1
Step 1: Identify actions and expected outcomes.
Find all interactions between an external actor (end user, external systems) and the system that is being tested (SUT). This is about mapping what the system should do and what functions and responses are expected for different types of input or events.

Step 2: Identify conditions.
Find all conditions (parameters, system state, environment) that have an impact on the outcome of an action. For continuous input variables the following are used:
 - Boundary Value Analysis (BVA) - test values at the boundaries, min, max and the values just inside/outside.
 - Equivalence Partitioning (EP) - split the possible values into groups where all values in one group are expected to behave the same, and test one representative value per group.

Step 3: Determine combinations.
Construct either all possible combinations of the conditions or filter out the relevant combinations based on domain knowledge.

Step 4: Derive expected outcomes.
For each constructed combination, derive the expected outcome based on ground truth:
 - Requirements documentation or specifications
 - Knowledge of the system

#### 1.2
The test design technique helps to create test cases in a structured way by splitting the process into clear, sequential steps. Instead of randomly making up test cases, the method forces the tester to systematically proceed from the system's actual behavior and conditions. By first identifying actions and then conditions, it is ensured that no important interactions or parameters are overlooked. The combination step guarantees that different conditions and inputs are covered in a controlled way, while the last step connects each test case to a concrete and verifiable expected outcome.

## 2
#### 2.1
Boundary Value Analysis is a software testing technique where tests are designed to include representatives of boundary values in a range. A boundary value is a threshold in the input that changes how the system behaves. Boundaries can be identified in:
 - Branching conditions
 - Loops
 - Limits of data types
The idea is to test the boundary value x together with x+1 and x-1, in order to cover the values just inside and just outside the boundary. This is effective because errors tend to occur at or near boundaries rather than in the middle of a range.

Equivalence Partitioning is a software testing technique that divides the input data of a software unit into partitions of equivalent data, from which test cases can be derived. The idea is to look for ranges of values that produce the same output and pick one representative value from each range. This reduces the number of test cases needed while still maintaining good test coverage, since all values within a partition are assumed to behave the same way.

#### 2.2 
Both BVA and EP are black-box test design techniques used to reduce the number of test cases while maintaining good coverage. EP divides input data into partitions where all values are expected to behave the same, and one representative value is chosen from each partition. BVA extends this idea by specifically focusing on the values at the edges of these partitions, since errors are more likely to occur at boundaries than in the middle of a range. In other words, EP identifies where to test and BVA refines how to test at the borders of those partitions.

#### 2.3 
BVA
| Boundary | Values to test |
|----------|----------------|
| Limit 0  | -1, 0, 1       |
| Limit 18 | 17, 18, 19     |
| Limit 120| 119, 120, 121  |

EP
| Partition         | Range        | Example Value | Expected Outcome |
| ----------------- | ------------ | ------------- | ---------------- |
| Impossible (low)  | x < 0        | -5            | Invalid          |
| Impossible (high) | x > 120      | 130           | Invalid          |
| Underage          | 0 ≤ x < 18   | 10            | Underage         |
| Valid             | 18 ≤ x ≤ 120 | 45            | Valid            |

## 3

#### 3.1
Conditions:
- Opening from inside            [yes / no]
- Porter unlocks door            [yes / no]
- Company card is valid          [yes / no]
- Card held for ≥ 2 seconds      [yes / no]

Action:
- Open door                      [successful / unsuccessful]

#### 3.2
| # | From inside | Porter unlocks | Valid card | Held ≥ 2 sec | Open door |
|---|-------------|----------------|------------|--------------|-----------|
| 1 | yes         | yes            | yes        | yes          | ✓         |
| 2 | yes         | yes            | yes        | no           | ✓         |
| 3 | yes         | yes            | no         | yes          | ✓         |
| 4 | yes         | yes            | no         | no           | ✓         |
| 5 | yes         | no             | yes        | yes          | ✓         |
| 6 | yes         | no             | yes        | no           | ✓         |
| 7 | yes         | no             | no         | yes          | ✓         |
| 8 | yes         | no             | no         | no           | ✓         |
| 9 | no          | yes            | yes        | yes          | ✓         |
| 10 | no         | yes            | yes        | no           | ✓         |
| 11 | no         | yes            | no         | yes          | ✓         |
| 12 | no         | yes            | no         | no           | ✓         |
| 13 | no         | no             | yes        | yes          | ✓         |
| 14 | no         | no             | yes        | no           | x         |
| 15 | no         | no             | no         | yes          | x         |
| 16 | no         | no             | no         | no           | x         |

#### 3.3
Rows 1–8 collapse: when opening from inside, all other conditions are irrelevant.
Rows 9–12 collapse: when porter unlocks, card conditions are irrelevant.
Rows 15–16 collapse: invalid card makes held time irrelevant.

| # | From inside | Porter unlocks | Valid card | Held ≥ 2 sec | Expected outcome |
|---|-------------|----------------|------------|--------------|------------------|
| 1 | yes         | –              | –          | –            | Successful       |
| 2 | no          | yes            | –          | –            | Successful       |
| 3 | no          | no             | yes        | yes          | Successful       |
| 4 | no          | no             | yes        | no           | Unsuccessful     |
| 5 | no          | no             | no         | –            | Unsuccessful     |