from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # staat CORS toe voor alle origins; veilig voor oefening

orders = []

@app.post('/api/order')
def order():
    data = request.get_json()
    if not data or 'items' not in data:
        return jsonify({'error': 'invalid payload'}), 400
    # eenvoudige validatie
    order_id = len(orders) + 1
    orders.append({'id': order_id, 'data': data})
    return jsonify({'status': 'ok', 'order_id': order_id}), 201

@app.get('/api/orders')
def list_orders():
    # alleen voor test/doel; niet openen in productie
    return jsonify(orders), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
