import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/expanded_info_styles.css';

interface DetailItem {
  symptom: string;
  diagnosis: string;
  treatment: string;
  rules: string;
  expectations: string;
  reference: string;
  product_reason: string;
  product_link: string;
}

const detailInfo: DetailItem[] = [
  {
    symptom: 'Bloating',
    diagnosis: 'Possible SIBO (Small Intestinal Bacterial Overgrowth)',
    treatment: 'Probiotic + FODMAP diet',
    rules: 'Take probiotic once daily before meals. Avoid FODMAP foods for 4 weeks.',
    expectations: 'Improved digestion, reduced bloating within 2 weeks.',
    reference: 'Gut Microbiome Journal, 2023.',
    product_reason: 'Targeted probiotic (Lactobacillus GG) to reduce bloating.',
    product_link: 'https://example.com/probiotic-bloating',
  },
  {
    symptom: 'Fatigue',
    diagnosis: 'Likely magnesium deficiency due to IBS-related malabsorption',
    treatment: 'Magnesium glycinate supplementation',
    rules: 'Take 200mg after breakfast daily.',
    expectations: 'More sustained energy levels and reduced post-meal crashes.',
    reference: 'Nutrition & Gut Health Review, 2022.',
    product_reason: 'Gentle magnesium form with high absorption rate.',
    product_link: 'https://example.com/magnesium-fatigue',
  },
];

const Details: React.FC = () => {
  return (
    <div className="container mt-4">
      <div className="details-header">
        <h2>AI Assistant Suggestion Details</h2>
        <Link to="/" className="back-button">← Back to Main Page</Link>
      </div>

      {detailInfo.map((item, index) => (
        <div className="card mb-4 shadow-sm" key={index}>
          <div className="card-body">
            <p><strong>Symptom:</strong> {item.symptom}</p>
            <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
            <p><strong>Recommended Treatment:</strong> {item.treatment}</p>
            <p><strong>Rules for Treatment:</strong> {item.rules}</p>
            <p><strong>Patient Expectations:</strong> {item.expectations}</p>
            <p><strong>Reference:</strong> {item.reference}</p>
            <p><strong>Reason for Product:</strong> {item.product_reason}</p>
            <p>
              <strong>Product Link:</strong>{' '}
              <a href={item.product_link} target="_blank" rel="noopener noreferrer">
                View Product
              </a>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Details;
