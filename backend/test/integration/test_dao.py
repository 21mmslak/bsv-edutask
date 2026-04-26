import pytest
from src.util.dao import DAO
from unittest.mock import patch
from pymongo.errors import WriteError


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


@pytest.mark.integration
def test_create_valid(dao):
    data = {
        "prop1": "Foo",
        "prop2": ["foo", "bar"],
        "prop3": True
    }

    result = dao.create(data)
    assert result["_id"] is not None


@pytest.mark.integration
@pytest.mark.parametrize("data,description", [
    (
        {"prop1": "Foo"},
        "Missing required field prop2"
    ),
    (
        {"prop1": "Foo", "prop2": "Bar"},
        "prop2 is not an array"
    ),
    (
        {"prop1": "Foo", "prop2": ["foo", "foo"]},
        "Non-unique items in prop2 array"
    ),
    (
        {"prop1": "Foo", "prop2": ["foo", 42]},
        "Invalid item type in prop2 array"
    ),
    (
        {"prop1": 42, "prop2": ["foo", "bar"]},
        "prop1 is not a string"
    ),
    (
        {"prop1": "Foo", "prop2": ["foo", "bar"], "prop3": 42},
        "prop3 is not a boolean"
    )
])
def test_create_raises_error(dao, data, description):
    with pytest.raises(WriteError):
        dao.create(data)
