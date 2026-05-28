import React, { useEffect, useState } from "react";
import {
  fetchQuestions,
  calculateScore,
  generateReport
} from "../services/api";

export default function Questionnaire() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [report, setReport] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchQuestions();
      setQuestions(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Unable to load questionnaire. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const isComplete =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!user || !user.id) {
      setError("Please login first.");
      return;
    }

    if (!isComplete) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    const formattedResponses = questions.map((q) => ({
      question_id: q.id,
      question: q.question,
      weight: q.weight,
      answer: answers[q.id]
    }));

    try {
      const scoreRes = await calculateScore({
        responses: formattedResponses
      });

      setResult(scoreRes.data);

      const reportRes = await generateReport({
        responses: formattedResponses,
        user_id: user.id
      });

      setReport(reportRes.data?.findings || []);

    } catch (err) {
      console.log(err);
      setError("Submission failed. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cyber-bg">
      <div className="page-wrapper">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Security Audit & Compliance Assessment
            </h1>

            <p className="cyber-subtitle">
              Evaluate security posture and identify compliance gaps
            </p>
          </div>
        </div>

        {error && (
          <div className="cyber-alert mb-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="cyber-card center-text">
            Loading assessment framework...
          </div>
        )}

        <div className="mt-lg">
          {questions.map((q) => (
            <div
              key={q.id}
              className="cyber-card question-card fade-up"
            >
              <h2 className="cyber-section-title">
                {q.question}
              </h2>

              <p className="cyber-subtitle">
                Domain:{" "}
                <span className="cyber-badge">
                  {q.domain}
                </span>
                {" | "}
                Weight: {q.weight}
              </p>

              <div className="question-actions">
                <label className="cyber-link">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === "yes"}
                    onChange={() => handleAnswer(q.id, "yes")}
                  />
                  {" "}Yes
                </label>

                <label className="cyber-link">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === "no"}
                    onChange={() => handleAnswer(q.id, "no")}
                  />
                  {" "}No
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-lg">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || submitting}
            className={`cyber-btn glow-pulse ${
              !isComplete || submitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {submitting
              ? "Analyzing Security Posture..."
              : "Submit Assessment"}
          </button>
        </div>

        {result && (
          <div className="cyber-card mt-lg float-card">
            <h2 className="cyber-section-title">
              Risk Assessment Summary
            </h2>

            <div className="cyber-grid">
              <div className="cyber-stat-box">
                <div className="cyber-stat-number">
                  {result.score}
                </div>
                <div className="cyber-stat-label">
                  Total Score
                </div>
              </div>

              <div className="cyber-stat-box">
                <div className="cyber-stat-number">
                  {result.percentage}%
                </div>
                <div className="cyber-stat-label">
                  Readiness
                </div>
              </div>

              <div className="cyber-stat-box">
                <div className="cyber-stat-number">
                  {result.risk_level}
                </div>
                <div className="cyber-stat-label">
                  Risk Level
                </div>
              </div>
            </div>
          </div>
        )}

        {report.length > 0 && (
          <div className="cyber-card mt-lg fade-up">
            <h2 className="cyber-section-title">
              Compliance Gap Analysis
            </h2>

            {report.map((item, index) => (
              <div
                key={index}
                className="report-item"
              >
                <p className="text-red-400 font-semibold">
                  {item.weakness}
                </p>

                <p className="text-gray-300">
                  Severity:{" "}
                  <span className="cyber-badge">
                    {item.severity}
                  </span>
                </p>

                <p className="text-gray-400">
                  Recommendation: {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}