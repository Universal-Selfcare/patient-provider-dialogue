import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

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
    product_reason?: string;
}

interface AISuggestions {
    [symptom: string]: Remedy[];
}

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
        name: '5-HTP Supplement',
        expectation: 'easier to fall asleep',
        reason: 'Regulates serotonin levels; gluten may not be digesting well',
        link: 'https://www.amazon.com/dp/B0016BXOWI?ref_=ppx_yo2ov_dt_b_product_details',
        tried: 'yes',
        result: 'better',
        comment_patient: 'I was able to fall asleep faster after 3 nights.',
    },
    {
        name: 'Reusable Enema Kit',
        expectation: 'bowel movement within 30 min to 1 hr after the enema',
        reason: 'Used for constipation relief',
        link: '',
        tried: 'no',
        why_not: 'I felt uncomfortable trying it on my own.',
    },
    {
        name: 'Vitamin D Supplement',
        expectation: 'no change might be noticeable',
        reason: 'Supports immune and digestive function',
        link: '',
        tried: 'yes',
        result: 'same',
        comment_patient: '',
    },
    {
        name: 'Ester C Supplement',
        expectation: 'no change might be noticeable',
        reason: 'Ester C is more digestible than pure ascorbic acid',
        link: 'https://www.amazon.com/Pure-Encapsulations-Metabolism-Hypoallergenic-Supplement/dp/B0017W3UJ0',
        tried: 'yes',
        result: 'worse',
        comment_patient: 'I felt more acid reflux when I took this.',
    },
];

const initialAISuggestions: AISuggestions = {
    Insomnia: [
        {
            symptom: 'Insomnia',
            remedy_name: '5-HTP Supplement',
            diagnosis: 'Gluten not digesting',
            recommended_treatment: '5-HTP to regulate serotonin levels; remove grains temporarily',
            rules_treatment: 'Take smallest amount of 5-HTP possible at dinner time, not morning. Avoid grains for now.',
            patient_expectation: 'easier to fall asleep',
            reference: 'Davis, SuperGut or Wheat Belly',
            reason: '',
            link: 'https://www.amazon.com/dp/B0016BXOWI?ref_=ppx_yo2ov_dt_b_product_details',
        },
        {
            symptom: 'Constipation',
            remedy_name: 'Reusable Enema Kit',
            diagnosis: 'For constipation',
            recommended_treatment: 'Enema kit',
            rules_treatment: 'Patient lie on stomach or side on bathroom floor, insert enema slowly, use towel underneath.',
            patient_expectation: 'bowel movement within 30 min to 1 hr after the enema',
            reference: 'Campbell-McBride, Gut and Psychology, 2010, p 326',
            reason: '',
            link: '',
        },
    ],
    Fatigue: [
        {
            symptom: 'Gets sick often',
            remedy_name: 'Vitamin D Supplement',
            diagnosis: 'Immune and digestive dysfunction',
            recommended_treatment: 'Vitamin D (hormone, actually)',
            rules_treatment: '',
            patient_expectation: 'No change might be noticeable',
            reference: '',
            reason: '',
            link: '',
        },
        {
            symptom: 'Gets sick often',
            remedy_name: 'Ester C Supplement',
            diagnosis: 'Immune repair needed',
            recommended_treatment: 'Vitamin C (Ester C preferred)',
            rules_treatment: '',
            patient_expectation: 'No change might be noticeable',
            reference: '',
            reason: 'Ester C is more digestible than pure ascorbic acid',
            link: 'https://www.amazon.com/Pure-Encapsulations-Metabolism-Hypoallergenic-Supplement/dp/B0017W3UJ0',
        },
    ],
};

const PatientChart: React.FC = () => {
    const [formState, setFormState] = useState<{ [key: string]: any }>({});
    const [noteCollapsed, setNoteCollapsed] = useState(false);
    const [customTreatmentInputs, setCustomTreatmentInputs] = useState<Remedy[]>([
        {
            symptom: 'Custom',
            remedy_name: '',
            diagnosis: '',
            recommended_treatment: '',
            rules_treatment: '',
            patient_expectation: '',
            reference: '',
            reason: '',
            link: '',
        },
    ]);
    const [isRightExpanded, setIsRightExpanded] = useState(false);
    const navigate = useNavigate();

    const patientConcerns = suggestions.filter((s) => s.comment_patient?.trim());
    const toggleNoteSection = () => setNoteCollapsed((prev) => !prev);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked =
            e.target instanceof HTMLInputElement && type === 'checkbox' ? e.target.checked : undefined;

        setFormState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCustomChange = (index: number, field: keyof Remedy, value: string) => {
        const updated = [...customTreatmentInputs];
        updated[index][field] = value;
        setCustomTreatmentInputs(updated);
    };

    const handleSaveNote = () => {
        const { noteAuthor, noteDate, providerNote } = formState;
        if (!noteAuthor || !noteDate || !providerNote) {
            alert('Please fill in all provider note fields before saving.');
            return;
        }
        console.log('Saved provider note:', {
            role: noteAuthor,
            date: noteDate,
            note: providerNote,
        });
        alert('Provider note saved!');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedTreatments: Remedy[] = [];

        let index = 0;
        Object.entries(initialAISuggestions).forEach(([_, remedies]) => {
            remedies.forEach((remedy) => {
                index++;
                if (formState[`include_${index}`]) {
                    selectedTreatments.push(remedy);
                }
            });
        });

        customTreatmentInputs.forEach((remedy, idx) => {
            if (formState[`include_custom_${idx}`]) {
                selectedTreatments.push(remedy);
            }
        });

        navigate('/patient-feedback-review', { state: { selectedTreatments } });
    };

    const handleDeleteLastCustom = () => {
        if (customTreatmentInputs.length === 0) return; // Nothing to delete

        const lastIndex = customTreatmentInputs.length - 1;

        const updated = [...customTreatmentInputs];
        updated.splice(lastIndex, 1);
        setCustomTreatmentInputs(updated);

        // Remove checkbox state for the last custom treatment
        const updatedFormState = { ...formState };
        delete updatedFormState[`include_custom_${lastIndex}`];
        setFormState(updatedFormState);
    };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let index = 0;

    return (
        <div className={`page-container ${isRightExpanded ? 'dimmed' : ''}`}>
            <div className="left-wrapper">
                <div className="left-box"><h2>Patient Alias</h2></div>

                <div className="left-box">
                    <h2>Cyber Office Visit <h2 style={{ fontSize: '20px', fontWeight: '1000', marginBottom: '8px' }}>{formattedDate}</h2></h2>
                    <p><strong>Symptoms:</strong></p>
                    <p><strong>Pain Map:</strong> (this shows pain map)</p>
                    <p><strong>Stool Notes:</strong> (this tells type of stool)</p>
                    <p><strong>Foods:</strong> (click to - current macro nutrients)</p>
                    <p><strong>Mealtimes:</strong> (click to - current micro nutrients)</p>
                </div>

                {patientConcerns.length > 0 && (
                    <div className="left-box">
                        <h2>Patient Comments <h2 style={{ fontSize: '20px', fontWeight: '1000', marginBottom: '8px' }}>{formattedDate}</h2></h2>
                        <ul style={{ paddingLeft: '16px' }}>
                            {patientConcerns.map((s, i) => (
                                <li key={i} style={{ marginBottom: '10px' }}>
                                    <p><strong>{s.name}:</strong> {s.comment_patient}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="left-box">
                    <h2>Patient Overview</h2>
                    <p><strong>MySelfcare:</strong> (alert)</p>
                    <p><strong>Chemical Exposure:</strong> (past months/years)</p>
                </div>

                <div className="left-box">
                    <div
                        onClick={toggleNoteSection}
                        style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                        <h2>Add notes of what was recommended</h2>
                        <button
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '1px solid #ccc',
                                backgroundColor: '#f0f0f0',
                                fontSize: '18px',
                                lineHeight: '1',
                                textAlign: 'center',
                                padding: '0',
                                cursor: 'pointer',
                            }}
                        >
                            {noteCollapsed ? '+' : '–'}
                        </button>
                    </div>

                    {!noteCollapsed && (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '30px',
                                    marginBottom: '20px',
                                    flexWrap: 'nowrap',
                                }}
                            >
                                <label
                                    htmlFor="noteDate"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <strong>Date of Note:</strong>
                                    <input
                                        type="date"
                                        id="noteDate"
                                        name="noteDate"
                                        value={formState.noteDate || ''}
                                        onChange={handleInputChange}
                                        style={{ minWidth: '150px' }}
                                    />
                                </label>

                                <label
                                    htmlFor="noteAuthor"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <strong>Select Role:</strong>
                                    <select
                                        id="noteAuthor"
                                        name="noteAuthor"
                                        value={formState.noteAuthor || ''}
                                        onChange={handleInputChange}
                                        style={{ minWidth: '180px' }}
                                    >
                                        <option value="">-- Choose --</option>
                                        <option value="Health Coach 1">Health Coach 1</option>
                                        <option value="Health Coach 2">Health Coach 2</option>
                                        <option value="Health Coach 3">Health Coach 3</option>
                                        <option value="Food Therapist">Food Therapist</option>
                                    </select>
                                </label>
                            </div>

                            <textarea
                                name="providerNote"
                                rows={3}
                                placeholder="Type provider notes here..."
                                value={formState.providerNote || ''}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    resize: 'vertical',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    fontSize: '1rem',
                                }}
                            />
                            <button type="button" onClick={handleSaveNote} style={{ marginTop: '10px' }}>
                                Save Note
                            </button>
                        </>
                    )}


                </div>
            </div>

            <div style={{ position: 'absolute', top: '50px', right: '20px', zIndex: 2000 }}>
                <button
                    onClick={() => setIsRightExpanded(prev => !prev)}
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: '2px solid #d2b48c',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        backgroundColor: '#fff5ee',
                        color: '#8b4513',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                    }}
                >
                    {isRightExpanded ? '–' : '+'}
                </button>
            </div>

            <div className={`right-column ${isRightExpanded ? 'expanded-overlay' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button type="button" onClick={() => alert('Sent to another provider!')}>Send to Another Provider</button>
                        <button type="button" onClick={() => alert('Added to knowledge base!')}>Submit to Knowledge Base</button>
                    </div>

                    <h2>Potential Treatments</h2>

                    {Object.entries(initialAISuggestions).map(([symptom, remedies]) =>
                        remedies.map((remedy) => {
                            index++;
                            return (
                                <div className="suggestion-box" key={`${symptom}-${remedy.remedy_name}`}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={`include_${index}`}
                                            checked={formState[`include_${index}`] || false}
                                            onChange={handleInputChange}
                                        />
                                        Include this in message to patient
                                    </label>
                                    <p><strong>Symptom:</strong> {remedy.symptom}</p>
                                    <p><strong>Remedy:</strong> {remedy.remedy_name}</p>
                                    <p><strong>Diagnosis:</strong> {remedy.diagnosis}</p>
                                    <p><strong>Treatment:</strong> {remedy.recommended_treatment}</p>
                                    <p><strong>Rules:</strong> {remedy.rules_treatment}</p>
                                    <p><strong>Expectation:</strong> {remedy.patient_expectation}</p>
                                    <p><strong>Reference:</strong> {remedy.reference}</p>
                                    <p><strong>Reason for the treatment selected:</strong> {remedy.reason}</p>
                                    <p><strong>Reason for the specific product:</strong> {remedy.reason}</p>
                                    <p><strong>Link:</strong> <a href={remedy.link} target="_blank" rel="noreferrer">{remedy.link}</a></p>
                                    <textarea
                                        name={`comment_provider_${index}`}
                                        placeholder="Provider comment..."
                                        onChange={handleInputChange}
                                    />
                                </div>
                            );
                        })
                    )}

                    <h3>Add Provider Treatments</h3>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() =>
                                setCustomTreatmentInputs((prev) => [
                                    ...prev,
                                    {
                                        symptom: 'Custom',
                                        remedy_name: '',
                                        diagnosis: '',
                                        recommended_treatment: '',
                                        rules_treatment: '',
                                        patient_expectation: '',
                                        reference: '',
                                        reason: '',
                                        link: '',
                                    },
                                ])
                            }
                        >
                            Add Another
                        </button>


                        <button
                            type="button"
                            onClick={handleDeleteLastCustom}

                            disabled={customTreatmentInputs.length === 0}
                        >
                            Delete
                        </button>
                    </div>

                    {customTreatmentInputs.map((remedy, idx) => (
                        <div className="suggestion-box" key={`custom-${idx}`}>
                            <label>
                                <input
                                    type="checkbox"
                                    name={`include_custom_${idx}`}
                                    checked={formState[`include_custom_${idx}`] || false}
                                    onChange={handleInputChange}
                                />
                                Include this in message to patient
                            </label>
                            <input
                                type="text"
                                placeholder="Symptom"
                                value={remedy.symptom}
                                onChange={(e) => handleCustomChange(idx, 'symptom', e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Treatment name"
                                value={remedy.remedy_name}
                                onChange={(e) => handleCustomChange(idx, 'remedy_name', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Reason / Diagnosis"
                                value={remedy.diagnosis}
                                onChange={(e) => handleCustomChange(idx, 'diagnosis', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Rules"
                                value={remedy.rules_treatment}
                                onChange={(e) => handleCustomChange(idx, 'rules_treatment', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Expectation"
                                value={remedy.patient_expectation}
                                onChange={(e) => handleCustomChange(idx, 'patient_expectation', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Reference"
                                value={remedy.reference}
                                onChange={(e) => handleCustomChange(idx, 'reference', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Product name"
                                value={remedy.recommended_treatment}
                                onChange={(e) => handleCustomChange(idx, 'recommended_treatment', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Product link"
                                value={remedy.link}
                                onChange={(e) => handleCustomChange(idx, 'link', e.target.value)}
                            />
                            <textarea
                                name={`comment_provider_custom_${idx}`}
                                placeholder="Provider comment..."
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}


                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button type="submit">Send to Patient</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientChart;
