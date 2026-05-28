from flask import Blueprint, request, jsonify
from services.scoring_engine import calculate_score

scoring_bp = Blueprint("scoring", __name__)


@scoring_bp.route("/calculate", methods=["POST"])
def scoring():
    data = request.json
    responses = data.get("responses", [])

    result = calculate_score(responses)

    return jsonify(result)