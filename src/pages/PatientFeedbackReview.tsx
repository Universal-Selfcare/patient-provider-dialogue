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
  product_reason: string;
}

const PatientFeedbackReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedTreatments: Remedy[] = location.state?.selectedTreatments || [];
  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value, type } = e.target;
    const checkedValue = type === 'radio' ? value : undefined;

    setResponses((prev) => ({
      ...prev,
      [name]: type === 'radio' ? checkedValue : value,
    }));

    if (type === 'radio') {
      if (value === 'better' || value === 'same') {
        const feedback = {
          treatment: selectedTreatments[index],
          result: value,
          comment: ''
        };
        console.log('Auto-submitting feedback:', feedback);
        navigate('/thank-you');
      }
    }
  };

  const handleIndividualSubmit = (index: number) => {
    const result = responses[`result_${index}`];
    const comment = responses[`comment_patient_${index}`];

    const feedback = {
      treatment: selectedTreatments[index],
      result,
      comment
    };

    console.log('Submitting manual feedback:', feedback);
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

  const patientName: string = location.state?.patientName || "Patient Name";
  const treatmentCount: number = selectedTreatments.length;

  return (
    <div className="container" style={{ padding: '24px', position: 'relative' }}>
      <h2>
        {patientName}, please try {treatmentCount === 1 ? 'this suggestion' : `these ${treatmentCount} suggestions`}, and after a week, flip the card and report back to us.
      </h2>
      <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>{formattedDate}</p>

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
            const result = responses[`result_${index}`];

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
                    {treatment.symptom && (
                      <p><strong>Purpose:</strong> to relieve {treatment.symptom}</p>
                    )}
                    {treatment.rules_treatment && (
                      <p><strong>Rules:</strong> {treatment.rules_treatment}</p>
                    )}
                    {treatment.patient_expectation && (
                      <p><strong>Expectation:</strong> {treatment.patient_expectation}</p>
                    )}
                    {treatment.reference && (
                      <p><strong>Reference:</strong> {treatment.reference}</p>
                    )}
                    {treatment.reason && (
                      <p><strong>Reason for the treatment selected:</strong> {treatment.reason}</p>
                    )}
                    {treatment.product_reason && (
                      <p><strong>Reason for the specific product:</strong> {treatment.product_reason}</p>
                    )}
                    {treatment.link && (
                      <p><strong>Link:</strong> <a href={treatment.link} target="_blank" rel="noreferrer">{treatment.link}</a></p>
                    )}
                  </div>


                  <div className="flip-card-back">
                    <h3>Patient Feedback Form</h3>

                    <p><strong>When you tried this, did you feel:</strong></p>
                    <label>
                      <input
                        type="radio"
                        name={`result_${index}`}
                        value="better"
                        onChange={(e) => handleChange(e, index)}
                      /> Better
                    </label><br />
                    <label>
                      <input
                        type="radio"
                        name={`result_${index}`}
                        value="same"
                        onChange={(e) => handleChange(e, index)}
                      /> Same
                    </label><br />
                    <label>
                      <input
                        type="radio"
                        name={`result_${index}`}
                        value="worse"
                        onChange={(e) => handleChange(e, index)}
                      /> Worse
                    </label><br />
                    <label>
                      <input
                        type="radio"
                        name={`result_${index}`}
                        value="not_tried"
                        onChange={(e) => handleChange(e, index)}
                      /> Did not try it
                    </label>

                    {(result === 'worse' || result === 'not_tried') && (
                      <>
                        <label style={{ display: 'block', marginTop: '8px' }}>
                          {result === 'worse'
                            ? 'How did you feel worse?'
                            : 'Please let us know why you didn’t try it:'}
                        </label>
                        <textarea
                          name={`comment_patient_${index}`}
                          onChange={(e) => handleChange(e, index)}
                          style={{
                            width: '90%',
                            minHeight: '60px',
                            borderRadius: '6px',
                            padding: '6px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleIndividualSubmit(index)}
                          style={{ marginTop: '12px' }}
                        >
                          Send
                        </button>
                      </>
                    )}
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
    </div>
  );
};

export default PatientFeedbackReview;
