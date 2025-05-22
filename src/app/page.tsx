'use client';
import { useEffect, useState } from 'react';

interface Question {
  Topic: string;
  Question: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  Correct: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [clickedQuestions, setClickedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch('/linux_questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const groupedByTopic = questions.reduce((acc: Record<string, Question[]>, q) => {
    if (!acc[q.Topic]) acc[q.Topic] = [];
    acc[q.Topic].push(q);
    return acc;
  }, {});

  const handleQuestionClick = (topic: string, index: number) => {
    const key = `${topic}-${index}`;
    setClickedQuestions(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Linux Practice Questions</h1>
      {Object.entries(groupedByTopic).map(([topic, topicQuestions]) => (
        <div key={topic} className="space-y-4">
          <h2 className="text-2xl font-semibold">📘 {topic}</h2>
          {topicQuestions.map((q, idx) => {
            const key = `${topic}-${idx}`;
            const showAnswer = clickedQuestions[key];
            return (
              <div key={idx} className="border p-4 rounded shadow cursor-pointer" onClick={() => handleQuestionClick(topic, idx)}>
                <p className="font-medium">Q{idx + 1}: {q.Question}</p>
                <ul className="pl-4 mt-2 space-y-1">
                  {['A', 'B', 'C', 'D'].map((opt, i) => {
                    const val = q[`Option${opt}` as keyof Question];
                    const isCorrect = (parseInt(q.Correct) === i + 1);
                    return (
                      <li key={opt} className={
                        showAnswer && isCorrect ? 'text-green-600 font-semibold' : ''
                      }>
                        {opt}. {val}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}