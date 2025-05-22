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
  const [clickedQuestions, setClickedQuestions] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

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

  const topics = Object.keys(groupedByTopic);

  const handleQuestionClick = (topic: string, index: number) => {
    const key = `${topic}-${index}`;
    setClickedQuestions(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="flex flex-col md:flex-row relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden p-3 absolute top-4 right-4 z-20 bg-black text-white rounded"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-10 h-full bg-white w-64 p-4 border-r transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Topics</h2>
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li
              key={String(topic)}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-200 ${
                selectedTopic === topic ? 'bg-blue-100 font-bold' : ''
              }`}
              onClick={() => {
                setSelectedTopic(topic);
                setShowSidebar(false); // auto close on mobile
              }}
            >
              {topic}
            </li>
          ))}
          <li
            className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-200 ${
              selectedTopic === null ? 'bg-blue-100 font-bold' : ''
            }`}
            onClick={() => {
              setSelectedTopic(null);
              setShowSidebar(false);
            }}
          >
            Show All
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8 overflow-auto md:ml-16">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Linux Practice Questions</h1>
        </div>

        {(selectedTopic ? [[selectedTopic, groupedByTopic[selectedTopic]]] : Object.entries(groupedByTopic)).map(
          ([topic, topicQuestions = []]) => (
            <div key={String(topic)} className="space-y-4">
              <h2 className="text-2xl font-semibold">📘 {topic}</h2>
              {(topicQuestions as Question[]).map((q, idx) => {
                const key = `${topic}-${idx}`;
                const showAnswer = clickedQuestions[key];
                return (
                  <div
                    key={idx}
                    className="border p-4 rounded shadow cursor-pointer"
                    onClick={() => handleQuestionClick(topic, idx)}
                  >
                    <p className="font-medium">Q{idx + 1}: {q.Question}</p>
                    <ul className="pl-4 mt-2 space-y-1">
                      {['A', 'B', 'C', 'D'].map((opt, i) => {
                        const val = q[`Option${opt}` as keyof Question];
                        const isCorrect = parseInt(q.Correct) === i + 1;
                        return (
                          <li
                            key={opt}
                            className={
                              showAnswer && isCorrect ? 'text-green-600 font-semibold' : ''
                            }
                          >
                            {opt}. {val}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
