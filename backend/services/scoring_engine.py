def calculate_score(responses):
    total_score = 0
    max_score = 0

    for item in responses:
        weight = item["weight"]
        answer = item["answer"]

        max_score += weight

        if answer.lower() == "yes":
            total_score += weight

    percentage = (total_score / max_score) * 100 if max_score else 0

    if percentage >= 85:
        risk = "Low"
    elif percentage >= 60:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "score": total_score,
        "percentage": round(percentage, 2),
        "risk_level": risk
    }