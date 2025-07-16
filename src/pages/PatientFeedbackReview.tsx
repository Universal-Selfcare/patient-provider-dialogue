import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/flip3d.css';

interface Remedy {
  symptom: string;
  remedy_name: string;
  diagnosis: string;
  recommended_treatment: string;
  rules_treatment: string;
  patient_expectation: string;
  reference: string;
  reason: string;
  link: string;
}

const PatientFeedbackReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedTreatments: Remedy[] = location.state?.selectedTreatments || [];
  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'radio' ? value : undefined;

    setResponses((prev) => ({
      ...prev,
      [name]: type === 'radio' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending to patient:', {
      treatments: selectedTreatments,
      feedback: responses
    });
    navigate('/thank-you');
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -500 : 500,
        behavior: 'smooth'
      });
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const patientName: string = location.state?.patientName || "Patient";
  const treatmentCount: number = selectedTreatments.length;

  return (
    <div className="container" style={{ padding: '24px', position: 'relative' }}>
      <h2>{treatmentCount} Provider Suggestions</h2>
      <h3>{patientName}, please wait a week, flip over the suggestion, and write to respond on the back.</h3>
      <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>{formattedDate}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', width: '100%', margin: '20px 0' }}>
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            style={{
              position: 'absolute',
              top: '50%',
              left: '-200px',
              transform: 'translateY(-50%)',
              fontSize: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              color: '#b36b00'
            }}
            aria-label="Scroll left"
          >
            &#8249;
          </button>

          {/* Scrollable treatment row */}
<div
  ref={scrollRef}
  className="flip-container"
  style={{
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    gap: '20px',
    padding: '16px 40px',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  }}
>


            {selectedTreatments.map((treatment, index) => {
              const isCustom = treatment.symptom === 'Custom';

              return (
                <div
                  key={`flip-card-${index}`}
                  className="flip-card"
                  style={{
                    zIndex: selectedTreatments.length - index,
                    flex: '0 0 500px',
                    height: '600px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <h4>{treatment.remedy_name}</h4>
                      <>
  <p><strong>Symptom:</strong> {treatment.symptom}</p>
  <p><strong>Remedy Name:</strong> {treatment.remedy_name}</p>
  <p><strong>Diagnosis:</strong> {treatment.diagnosis}</p>
  <p><strong>Treatment:</strong> {treatment.recommended_treatment}</p>
  <p><strong>Rules:</strong> {treatment.rules_treatment}</p>
  <p><strong>Expectation:</strong> {treatment.patient_expectation}</p>
  <p><strong>Reference:</strong> {treatment.reference}</p>
  <p><strong>Reason:</strong> {treatment.reason}</p>
  <p><strong>Link:</strong> <a href={treatment.link} target="_blank" rel="noreferrer">{treatment.link}</a></p>
</>

                      
                    </div>

                    <div className="flip-card-back">
                      <h3>Patient Feedback Form</h3>
                      <p>Please wait 1 week and report back.</p>

                      <p><strong>When you tried this, did you feel:</strong></p>
                      <label><input type="radio" name={`result_${index}`} value="worse" onChange={handleChange} /> Worse</label>
                      <label><input type="radio" name={`result_${index}`} value="same" onChange={handleChange} /> Same</label>
                      <label><input type="radio" name={`result_${index}`} value="better" onChange={handleChange} /> Better</label>
                      <label><input type="radio" name={`result_${index}`} value="not_tried" onChange={handleChange} /> Did not try it</label>

                      <label style={{ display: 'block', marginTop: '8px' }}>Explain if worse or not tried:</label>
                      <textarea
                        name={`comment_patient_${index}`}
                        onChange={handleChange}
                        style={{
                          width: '90%',
                          minHeight: '60px',
                          borderRadius: '6px',
                          padding: '6px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-200px',
              transform: 'translateY(-50%)',
              fontSize: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              color: '#b36b00'
            }}
            aria-label="Scroll right"
          >
            &#8250;
          </button>
        </div>

        <button type="submit" style={{ marginTop: '24px' }}>Send</button>
      </form>
    </div>
  );
};

export default PatientFeedbackReview;
