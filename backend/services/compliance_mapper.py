def map_compliance(responses):
    compliance_issues = []

    for item in responses:
        question = item.get("question")
        answer = item.get("answer", "").lower()

        if answer == "no":
            if "password" in question.lower():
                standard = "PCI DSS"
            elif "access" in question.lower() or "mfa" in question.lower():
                standard = "ISO 27001"
            else:
                standard = "SOC 2"

            compliance_issues.append({
                "question": question,
                "standard": standard,
                "status": "Non-Compliant"
            })

    return compliance_issues