import unittest
from app import app, manager

class UserManagerTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        manager.users = {}
        manager.next_id = 1

    def test_create_user(self):
        response = self.app.post('/users', json={"name": "Alice", "age": 25})
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['name'], "Alice")
        self.assertEqual(data['age'], 25)

    def test_get_user(self):
        self.app.post('/users', json={"name": "Bob", "age": 30})
        response = self.app.get('/users/1')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['name'], "Bob")
        self.assertEqual(data['age'], 30)

    def test_update_user(self):
        self.app.post('/users', json={"name": "Charlie", "age": 35})
        response = self.app.put('/users/1', json={"name": "Charles", "age": 36})
        self.assertEqual(response.status_code, 200)
        response = self.app.get('/users/1')
        data = response.get_json()
        self.assertEqual(data['name'], "Charles")
        self.assertEqual(data['age'], 36)

    def test_delete_user(self):
        self.app.post('/users', json={"name": "David", "age": 40})
        response = self.app.delete('/users/1')
        self.assertEqual(response.status_code, 200)
        response = self.app.get('/users/1')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()