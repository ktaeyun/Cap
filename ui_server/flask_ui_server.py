from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

ANALYSIS_SERVER_URL = "http://<서버B_IP>:5000/analyze"  # 🔁 서버 B 주소로 설정

@app.route('/analyze', methods=['POST'])
def proxy_to_analysis():
    if 'images' not in request.files:
        return jsonify({"error": "이미지가 없습니다"}), 400

    files = [('images', (f.filename, f.stream, f.mimetype)) for f in request.files.getlist('images')]

    try:
        res = requests.post(ANALYSIS_SERVER_URL, files=files)
        res.raise_for_status()
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
