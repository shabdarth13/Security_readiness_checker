def detect_gaps(responses):
    findings = []

    for item in responses:
        question_id = item.get("question_id")
        question = item.get("question")
        answer = item.get("answer", "").lower()
        weight = item.get("weight", 0)

        if answer == "no":
            if weight >= 8:
                severity = "High"
            elif weight >= 5:
                severity = "Medium"
            else:
                severity = "Low"

            recommendation_map = {
                "multi-factor authentication": "Enable MFA for all admin and remote access accounts.",
                "password": "Implement strong password policy with expiry and complexity rules.",
                "backup": "Schedule regular backups and test restoration monthly.",
                "incident response": "Create and test a formal incident response plan.",
                "antivirus": "Install antivirus or EDR protection on all endpoints.",
                "edr": "Deploy EDR solution for endpoint monitoring and threat detection.",
                "patch": "Apply security patches regularly and track missing updates.",
                "firewall": "Review firewall rules regularly and remove unnecessary access.",
                "access rights": "Perform periodic user access reviews.",
                "awareness": "Conduct regular cybersecurity awareness training.",
                "vendor": "Assess third-party vendors for cybersecurity risks."
            }

            recommendation = "Implement appropriate security control and document evidence."

            for key in recommendation_map:
                if key in question.lower():
                    recommendation = recommendation_map[key]
                    break

            findings.append({
                "question_id": question_id,
                "question": question,
                "weakness": f"Missing control for: {question}",
                "severity": severity,
                "recommendation": recommendation
            })

    return findings