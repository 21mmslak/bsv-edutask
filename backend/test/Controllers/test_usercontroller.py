import pytest
from unittest.mock import MagicMock
from src.controllers.usercontroller import UserController


def test_get_user_valid_email_user_exists():
    dao = MagicMock()
    dao.find.return_value = [
        {"email": "test@example.com", "name": "Test User"}
    ]

    controller = UserController(dao=dao)

    result = controller.get_user_by_email("test@example.com")

    assert result == {"email": "test@example.com", "name": "Test User"}
    dao.find.assert_called_once_with({"email": "test@example.com"})


def test_get_user_valid_email_no_user_found():
    dao = MagicMock()
    dao.find.return_value = []

    controller = UserController(dao=dao)

    result = controller.get_user_by_email("noone@example.com")

    assert result is None
    dao.find.assert_called_once_with({"email": "noone@example.com"})


def test_get_user_multiple_users_found():
    dao = MagicMock()
    dao.find.return_value = [
        {"email": "dup@example.com", "name": "User 1"},
        {"email": "dup@example.com", "name": "User 2"}
    ]

    controller = UserController(dao=dao)

    result = controller.get_user_by_email("dup@example.com")

    assert result == {"email": "dup@example.com", "name": "User 1"}
    dao.find.assert_called_once_with({"email": "dup@example.com"})


def test_get_user_invalid_email_missing_at():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("testexample.com")


def test_get_user_invalid_email_missing_local_part():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("@example.com")


def test_get_user_invalid_email_missing_domain():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("test@")


def test_get_user_invalid_email_empty_string():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("")


def test_get_user_none_as_input():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(TypeError):
        controller.get_user_by_email(None)


def test_get_user_database_failure():
    dao = MagicMock()
    dao.find.side_effect = Exception("Database error")

    controller = UserController(dao=dao)

    with pytest.raises(Exception):
        controller.get_user_by_email("test@example.com")