from flask import Flask, jsonify, request, abort

app = Flask(__name__)

class User:
    def __init__(self, user_id: int, name: str, age: int):
        self.user_id = user_id
        self.name = name
        self.age = age

class UserManager:
    def __init__(self):
        self.users = {}
        self.next_id = 1

    def create_user(self, name: str, age: int) -> User:
        user = User(self.next_id, name, age)
        self.users[self.next_id] = user
        self.next_id += 1
        return user

    def update_user(self, user_id: int, name: str = None, age: int = None) -> bool:
        if user_id not in self.users:
            return False
        if name:
            self.users[user_id].name = name
        if age:
            self.users[user_id].age = age
        return True

    def delete_user(self, user_id: int) -> bool:
        if user_id in self.users:
            del self.users[user_id]
            return True
        return False

    def get_user(self, user_id: int):
        return self.users.get(user_id)

manager = UserManager()

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if not data or 'name' not in data or 'age' not in data:
        abort(400)
    user = manager.create_user(data['name'], data['age'])
    return jsonify({"user_id": user.user_id, "name": user.name, "age": user.age}), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    if not data:
        abort(400)
    success = manager.update_user(user_id, name=data.get('name'), age=data.get('age'))
    if not success:
        # abort(404)
        return jsonify({"error": f"User with id {user_id} not found"}), 404
    return jsonify({"message": "User updated successfully"}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    success = manager.delete_user(user_id)
    if not success:
        # abort(404)
        return jsonify({"error": f"User with id {user_id} not found"}), 404
    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = manager.get_user(user_id)
    if not user:
        return jsonify({"error": f"User with id {user_id} not found"}), 404
    return jsonify({"user_id": user.user_id, "name": user.name, "age": user.age}), 200

if __name__ == '__main__':
    app.run(debug=True)