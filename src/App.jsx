import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2, Eye, FileText } from 'lucide-react';

const ProResume = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef();

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const generatePDF = () => {
    window.print();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={32} color="#4F46E5" />
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              ProResume
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#4338CA'}
              onMouseOut={e => e.target.style.backgroundColor = '#4F46E5'}
            >
              <Eye size={20} />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            {showPreview && (
              <button
                onClick={generatePDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <Download size={20} />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1400px',
        margin: '2rem auto',
        padding: '0 2rem'
      }}>
        {!showPreview ? (
          // Edit Form
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Personal Info Section */}
            <Section title="Personal Information">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Input label="Full Name" value={formData.personalInfo.fullName} 
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} />
                <Input label="Email" type="email" value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} />
                <Input label="Phone" value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
                <Input label="Location" value={formData.personalInfo.location}
                  onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)} />
                <Input label="LinkedIn" value={formData.personalInfo.linkedin}
                  onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} />
                <Input label="Portfolio" value={formData.personalInfo.portfolio}
                  onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)} />
              </div>
            </Section>

            {/* Summary Section */}
            <Section title="Professional Summary">
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Write a brief professional summary..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </Section>

            {/* Experience Section */}
            <Section title="Work Experience">
              {formData.experience.map((exp, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removeArrayItem('experience', index)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Input label="Job Title" value={exp.title}
                      onChange={(e) => updateArrayItem('experience', index, 'title', e.target.value)} />
                    <Input label="Company" value={exp.company}
                      onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Input label="Start Date" value={exp.startDate}
                        onChange={(e) => updateArrayItem('experience', index, 'startDate', e.target.value)} />
                      <Input label="End Date" value={exp.endDate}
                        onChange={(e) => updateArrayItem('experience', index, 'endDate', e.target.value)} />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('experience', {
                  title: '', company: '', startDate: '', endDate: '', description: ''
                })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                <Plus size={20} />
                Add Experience
              </button>
            </Section>

            {/* Education Section */}
            <Section title="Education">
              {formData.education.map((edu, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removeArrayItem('education', index)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Input label="Degree" value={edu.degree}
                      onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} />
                    <Input label="School" value={edu.school}
                      onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Input label="Start Date" value={edu.startDate}
                        onChange={(e) => updateArrayItem('education', index, 'startDate', e.target.value)} />
                      <Input label="End Date" value={edu.endDate}
                        onChange={(e) => updateArrayItem('education', index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('education', {
                  degree: '', school: '', startDate: '', endDate: ''
                })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                <Plus size={20} />
                Add Education
              </button>
            </Section>

            {/* Skills Section */}
            <Section title="Skills">
              {formData.skills.map((skill, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  alignItems: 'center'
                }}>
                  <Input 
                    label="Skill" 
                    value={skill}
                    onChange={(e) => updateArrayItem('skills', index, null, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => removeArrayItem('skills', index)}
                    style={{
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      marginTop: '1.5rem'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('skills', '')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                <Plus size={20} />
                Add Skill
              </button>
            </Section>

            {/* Projects Section */}
            <Section title="Projects">
              {formData.projects.map((project, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removeArrayItem('projects', index)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Input label="Project Name" value={project.name}
                      onChange={(e) => updateArrayItem('projects', index, 'name', e.target.value)} />
                    <Input label="Technologies" value={project.technologies}
                      onChange={(e) => updateArrayItem('projects', index, 'technologies', e.target.value)} />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                      placeholder="Describe the project..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('projects', {
                  name: '', technologies: '', description: ''
                })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                <Plus size={20} />
                Add Project
              </button>
            </Section>
          </div>
        ) : (
          // Resume Preview
          <div ref={resumeRef} style={{
            backgroundColor: 'white',
            maxWidth: '850px',
            margin: '0 auto',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #4F46E5', paddingBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                {formData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                {formData.personalInfo.phone && <span>• {formData.personalInfo.phone}</span>}
                {formData.personalInfo.location && <span>• {formData.personalInfo.location}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: '#4F46E5', marginTop: '0.5rem' }}>
                {formData.personalInfo.linkedin && <span>{formData.personalInfo.linkedin}</span>}
                {formData.personalInfo.portfolio && <span>• {formData.personalInfo.portfolio}</span>}
              </div>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4F46E5', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Summary
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{formData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {formData.experience.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4F46E5', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Work Experience
                </h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>{exp.title}</h3>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: '1rem', color: '#4b5563', fontWeight: '500', marginBottom: '0.5rem' }}>{exp.company}</p>
                    <p style={{ color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {formData.education.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4F46E5', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Education
                </h2>
                {formData.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>{edu.degree}</h3>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: '1rem', color: '#4b5563' }}>{edu.school}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {formData.skills.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4F46E5', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.skills.filter(s => s).map((skill, index) => (
                    <span key={index} style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#EEF2FF',
                      color: '#4F46E5',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {formData.projects.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4F46E5', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projects
                </h2>
                {formData.projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {project.name}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                      {project.technologies}
                    </p>
                    <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${showPreview ? `
            ${resumeRef.current ? '[ref]' : 'div'}, ${resumeRef.current ? '[ref]' : 'div'} * {
              visibility: visible;
            }
          ` : ''}
          header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper Components
const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #e5e7eb'
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '1rem',
        transition: 'border-color 0.2s'
      }}
      onFocus={e => e.target.style.borderColor = '#4F46E5'}
      onBlur={e => e.target.style.borderColor = '#d1d5db'}
    />
  </div>
);

export default ProResume;

