from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

ANALYSIS_SERVER_URL = "http://10.80.87.124:5000/analyze"  # 모델 서버 IP

@app.route('/analyze', methods=['POST'])
def proxy_to_analysis():
    if 'images' not in request.files:
        return jsonify({"error": "이미지가 없습니다"}), 400

    files = [('images', (f.filename, f.stream, f.mimetype)) for f in request.files.getlist('images')]

    try:
        res = requests.post(ANALYSIS_SERVER_URL, files=files)
        res.raise_for_status()
        return res.json()  # jsonify() 없이 그대로 반환
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
