import React from "react";

export default function ScoreCard({ score, risk }) {
  return (
    <div>
      <h2>Total Score: {score}</h2>
      <h3>Risk Level: {risk}</h3>
    </div>
  );
}