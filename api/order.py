from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Read incoming JSON body
        content_length = int(self.headers.get("content-length", 0))
        body = self.rfile.read(content_length)
        data = json.loads(body)

        # Prepare response
        response = {
            "message": "Order received successfully",
            "data": data
        }

        # Send response
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())

    def do_GET(self):
        # Optional - endpoint health check
        response = {"status": "OK", "message": "Omar Restaurant API is running"}
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
