import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizRenderer = ({ data }) => {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const question = data.questions[currentQuestionIndex];

  const handleOptionClick = (index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Logic for end of quiz could go here
      alert('Quiz Completed!');
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">{data.title[language]}</h1>
        <p className="text-gray-500 text-sm mt-1">Question {currentQuestionIndex + 1} of {data.questions.length}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-6">{question.question[language]}</h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let itemClass = "w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ";

            if (showResult) {
              if (idx === question.correctIndex) {
                itemClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                 itemClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                itemClass += "border-gray-100 opacity-50";
              }
            } else {
              itemClass += "border-gray-100 hover:border-blue-200 hover:bg-blue-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={itemClass}
                disabled={showResult}
              >
                <span>{option[language]}</span>
                {showResult && idx === question.correctIndex && <CheckCircle size={20} className="text-green-600" />}
                {showResult && idx === selectedOption && idx !== question.correctIndex && <XCircle size={20} className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-900">
            <p className="font-semibold mb-1">Explanation:</p>
            <p>{question.explanation[language]}</p>

            <button
              onClick={nextQuestion}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizRenderer;
