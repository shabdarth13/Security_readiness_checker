from flask import Flask
from flask_cors import CORS
import os

from routes.auth_routes import auth_bp
from routes.question_routes import question_bp
from routes.scoring_routes import scoring_bp
from routes.report_routes import report_bp
from routes.compliance_routes import compliance_bp
from routes.pdf_routes import pdf_bp
from routes.admin_routes import admin_bp

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "your_secret_key"
)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(question_bp, url_prefix="/api/questions")
app.register_blueprint(scoring_bp, url_prefix="/api/scoring")
app.register_blueprint(report_bp, url_prefix="/api/report")
app.register_blueprint(compliance_bp, url_prefix="/api/compliance")
app.register_blueprint(pdf_bp, url_prefix="/api/pdf")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

@app.route("/")
def home():
    return {
        "message": "Security Audit Readiness API Running"
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)