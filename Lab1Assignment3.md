# Assignment 3: Integration Testing

## Work distribution

This assignment was completed during a video chat session between the group members where they discussed and worked together on completing it.

## 1. Test Levels

### 1.1

Unit tests are isolated cases that test a unit (e.g. a helper class, a library, a module, etc) with dependencies mocked. If it has a dependency on another unit that dependency will be mocked in a way that allows you to still test both happy and unhappy paths in isolation.

Integration tests on the other hand do not isolate the parts from each other, they instead test that different implemented units communicate with each other as expected and the communication between them work.

### 1.2

In unit test mocking is used to make sure that the unit under test is completely isolated from other parts of the system so that the implementation can be independently verified. This way a test failure clearly indicates in the unit and not in a dependency.

For integration tests, as you are testing that two modules are communicating with each other, you mock out transitive dependencies they may have. Say that we are testing the integration between Foo and Bar, but Bar also dependends on Baz, then we mock out Baz to ensure that we are only testing the two modules we are supposed to.

## 2. Integration Testing

### 2.1

#### TC1: Valid input

```json
{
  "prop1": "Foo",
  "prop2": ["foo", "bar"],
  "prop3": true
}
```

#### TC2: Missing required field

```json
{
  "prop1": "Foo"
}
```

#### TC3: Wrong BSON type for array field

```json
{
  "prop1": "Foo",
  "prop2": "Bar"
}
```

#### TC4: Non-unique array items

```json
{
  "prop1": "Foo",
  "prop2": ["foo", "foo"]
}
```

#### TC5: Wrong BSON type in array

```json
{
  "prop1": "Foo",
  "prop2": ["foo", 42]
}
```

#### TC6: Wrong BSON type for string

```json
{
  "prop1": 42,
  "prop2": ["foo", "bar"]
}
```

#### TC7: Wrong BSON type for boolean

```json
{
  "prop1": "Foo",
  "prop2": ["foo", "bar"],
  "prop3": 42
}
```

### 2.2

```python
    @pytest.fixture
    def validator():
        validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["prop1", "prop2"],
                "properties": {
                    "prop1": {
                        "bsonType": "string",
                        "description": "Required string field"
                    },
                    "prop2": {
                        "bsonType": "array",
                        "description": "Array with unique string items",
                        "items": {
                            "bsonType": "string"
                        },
                        "uniqueItems": True
                    },
                    "prop3": {
                        "bsonType": "bool",
                        "description": "Optional boolean field"
                    }
                }
            }
        }

        return validator

    @pytest.fixture
    def dao(validator):
        with patch("src.util.dao.getValidator", return_value=validator):
            dao = DAO("integration_testing")
            yield dao
            dao.drop()
```

### 2.3

[https://github.com/21mmslak/bsv-edutask/blob/master/backend/test/integration/test_dao.py](https://github.com/21mmslak/bsv-edutask/blob/master/backend/test/integration/test_dao.py)

### 2.4

All integration tests passed successfully covering the identified test cases indicating that the implementation behaves according to the specification. Valid input is inserted properly and `_id` is returned, invalid inputs correctly raise a `WriteError`, demonstrating that schema validation is properly enforced by MongoDB.

The `create()` method is tested by the integration tests, covering both valid and invalid input scenarios defined in the schema.

Although the overall file coverage is 52%, the integration tests specifically target the `create()` method and cover all relevant input scenarios, including required field validation, type enforcement, and array uniqueness constraints.

```
❯ pytest -m integration
====================================================================================================== test session starts ======================================================================================================
platform darwin -- Python 3.10.6, pytest-8.3.5, pluggy-1.6.0
rootdir: /Users/johangu/Developer/github.com/johangu/dbwebb/sysver/bsv-edutask/backend
configfile: pytest.ini
testpaths: test
plugins: cov-6.1.0
collected 40 items / 33 deselected / 7 selected

test/integration/test_dao.py .......                                                                                                                                                                                      [100%]

======================================================================================================== tests coverage =========================================================================================================
_______________________________________________________________________________________ coverage: platform darwin, python 3.10.6-final-0 ________________________________________________________________________________________

Name                                Stmts   Miss  Cover   Missing
-----------------------------------------------------------------
src/controllers/__init__.py             0      0   100%
src/controllers/controller.py          31     23    26%   12, 24-27, 44-47, 59-62, 80-84, 99-103
src/controllers/taskcontroller.py      68     68     0%   1-139
src/controllers/todocontroller.py      21     21     0%   1-40
src/controllers/usercontroller.py      24     16    33%   9, 28-39, 42-46
src/util/dao.py                        67     32    52%   79-83, 101-118, 134-141, 156-162, 172-173
src/util/daos.py                        6      3    50%   14-16
src/util/helpers.py                    30     19    37%   16, 20, 33-39, 45, 58-64, 73-77
src/util/validators.py                  7      4    43%   13-16
-----------------------------------------------------------------
TOTAL                                 254    186    27%
=============================================================================================== 7 passed, 33 deselected in 0.28s ================================================================================================
```
