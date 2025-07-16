import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

interface SuggestionFeedback {
  name: string;
  expectation: string;
  reason: string;
  link: string;
  tried: string;
  why_not?: string;
  result?: string;
  comment_patient?: string;
}

const suggestions: SuggestionFeedback[] = [
  {
  name: 'Broccoli',
  expectation: 'Support digestion and provide fiber.',
  reason: 'Broccoli is high in fiber and antioxidants which aid digestion.',
  link: 'https://example.com/broccoli-benefits',
  tried: 'yes',
  result: 'worse',
  comment_patient: 'Caused stomach cramps after lunch.'
},

  {
    name: 'Dairy-Free Trial',
    expectation: 'Less bloating if lactose is the trigger.',
    reason: 'Patient reports dairy-containing meals correlate with symptoms.',
    link: 'https://example.com/dairy-free-products',
    tried: 'no',
    why_not: 'I didn’t have access to dairy-free meals.'
  },
  {
    name: 'Magnesium Supplement',
    expectation: 'Improved energy and reduced muscle fatigue in 3–5 days.',
    reason: 'Magnesium helps with cellular energy and is commonly deficient.',
    link: 'https://example.com/magnesium',
    tried: 'yes',
    result: 'same',
    comment_patient: 'Not sure if it made a difference yet.'
  },
  {
    name: 'Post-Meal Walks',
    expectation: 'May improve digestion and reduce drowsiness post-meal.',
    reason: 'Walking supports blood flow and glucose control after eating.',
    link: 'https://example.com/walking-benefits',
    tried: 'yes',
    result: 'better',
    comment_patient: 'Loved it! I feel more energized after walking.'
  }
];

const PatientAnswer: React.FC = () => {
  return (
    <div className="container mt-4 right-column">
      <h2>Patient Response</h2>

      {suggestions.map((suggestion, index) => (
        <div className="suggestion-box" key={index}>
          <h3>{suggestion.name}</h3>
          <p><strong>Expectation:</strong> {suggestion.expectation}</p>
      
          <hr />
          <p><strong>Did you try it?</strong> {suggestion.tried}</p>

          {suggestion.tried === 'no' ? (
            <p><strong>If not, why not?</strong> {suggestion.why_not || 'No reason given.'}</p>
          ) : (
            <p><strong>What happened?</strong> {suggestion.result}</p>
          )}

          <p><strong>Your comment to the provider:</strong></p>
          <p>{suggestion.comment_patient || 'No comment provided.'}</p>
        </div>
      ))}

      <Link to="/">
        <button type="button" style={{ marginTop: '20px' }}>← Back to Chart</button>
      </Link>
    </div>
  );
};

export default PatientAnswer;
