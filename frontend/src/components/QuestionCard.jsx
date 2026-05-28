import React from "react";

export default function QuestionCard({ question }) {
  return (
    <div>
      <h3>{question.question}</h3>
      <button>Yes</button>
      <button>No</button>
    </div>
  );
}