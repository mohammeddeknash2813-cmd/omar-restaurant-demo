from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/order", methods=["POST"])
def order():
    data = request.get_json()
    print("New order received:", data)
    return jsonify({"message": "Order received successfully", "data": data}), 200

@app.route("/")
def home():
    return "Omar Restaurant API is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
