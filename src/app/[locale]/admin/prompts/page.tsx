"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { promptManager } from '@/utils/promptManager';
import AuthProtection from '@/components/AuthProtection';

interface ExamType {
  id: number;
  exam_name: string;
  display_name: string;
}

interface SkillType {
  id: number;
  skill_name: string;
  display_name: string;
}

interface TestPart {
  id: number;
  part_name: string;
  display_name: string;
  description: string;
}

interface PromptTemplate {
  id: number;
  template_name: string;
  version: string;
  description: string;
  is_active: boolean;
  exam_type: ExamType;
  skill_type: SkillType;
  test_part: TestPart;
}

interface PromptSection {
  id: number;
  section_name: string;
  description: string;
  content: string;
  content_type: string;
  order_index: number;
}

export default function PromptAdminPage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [skillTypes, setSkillTypes] = useState<SkillType[]>([]);
  const [testParts, setTestParts] = useState<TestPart[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [promptSections, setPromptSections] = useState<PromptSection[]>([]);
  
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'preview' | 'examples'>('templates');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedExam && selectedSkill) {
      loadTestParts();
      loadTemplates();
    }
  }, [selectedExam, selectedSkill, selectedPart]);

  const loadInitialData = async () => {
    try {
      console.log('Loading initial data...');
      
      const [examRes, skillRes] = await Promise.all([
        supabase.from('exam_types').select('*').eq('is_active', true).order('display_name'),
        supabase.from('skill_types').select('*').order('display_name')
      ]);

      console.log('Exam types response:', examRes);
      console.log('Skill types response:', skillRes);

      if (examRes.error) {
        console.error('Exam types error:', examRes.error);
      } else {
        console.log('Loaded exam types:', examRes.data);
        setExamTypes(examRes.data || []);
      }

      if (skillRes.error) {
        console.error('Skill types error:', skillRes.error);
      } else {
        console.log('Loaded skill types:', skillRes.data);
        setSkillTypes(skillRes.data || []);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestParts = async () => {
    if (!selectedExam || !selectedSkill) return;

    try {
      const { data, error } = await supabase
        .from('test_parts')
        .select('*')
        .eq('exam_type_id', selectedExam)
        .eq('skill_type_id', selectedSkill)
        .eq('is_active', true)
        .order('part_name');

      if (error) throw error;
      setTestParts(data || []);
    } catch (error) {
      console.error('Error loading test parts:', error);
    }
  };

  const loadTemplates = async () => {
    if (!selectedExam || !selectedSkill) return;

    try {
      let query = supabase
        .from('prompt_templates')
        .select(`
          *,
          exam_types!inner (id, exam_name, display_name),
          skill_types!inner (id, skill_name, display_name),
          test_parts (id, part_name, display_name, description)
        `)
        .eq('exam_types.id', selectedExam)
        .eq('skill_types.id', selectedSkill);

      if (selectedPart) {
        query = query.eq('test_parts.id', selectedPart);
      }

      const { data, error } = await query.order('template_name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadPromptSections = async (templateId: number) => {
    try {
      const { data, error } = await supabase
        .from('prompt_template_sections')
        .select(`
          order_index,
          prompt_section_content (
            id,
            content,
            content_type,
            order_index,
            prompt_sections (
              id,
              section_name,
              description
            )
          )
        `)
        .eq('prompt_template_id', templateId)
        .order('order_index');

      if (error) throw error;

      const sections = data?.map((item) => {
        const content = item.prompt_section_content;
        const section = Array.isArray(content) ? content[0] : content;
        const promptSection = Array.isArray(section?.prompt_sections) ? section.prompt_sections[0] : section?.prompt_sections;
        
        return {
          id: section?.id || 0,
          section_name: promptSection?.section_name || '',
          description: promptSection?.description || '',
          content: section?.content || '',
          content_type: section?.content_type || '',
          order_index: item.order_index || 0
        };
      }) || [];

      setPromptSections(sections);
    } catch (error) {
      console.error('Error loading prompt sections:', error);
    }
  };

  const handleTemplateSelect = async (template: PromptTemplate) => {
    setSelectedTemplate(template);
    await loadPromptSections(template.id);
    setActiveTab('preview');
  };

  const testPrompt = async () => {
    if (!selectedTemplate) return;

    try {
      const promptData = await promptManager.buildPrompt(selectedTemplate.id, {
        examName: selectedTemplate.exam_type.display_name,
        skillName: selectedTemplate.skill_type.display_name,
        partName: selectedTemplate.test_part?.display_name || '',
        studentResponse: 'Sample student response for testing...',
        question: 'Sample question for testing',
        wordCount: 150
      });

      if (promptData) {
        alert('Prompt test successful! Check console for details.');
        console.log('Generated Prompt:', promptData);
      }
    } catch (error) {
      console.error('Error testing prompt:', error);
      alert('Prompt test failed. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ margin: '50px auto', textAlign: 'center' }}>
        <h1>Loading Prompt Management...</h1>
      </div>
    );
  }

  return (
    <AuthProtection feature="prompt administration">
      <div className="container" style={{ margin: '50px auto' }}>
        <h1>🤖 AI Prompt Management System</h1>
        
        <div className="prompt-admin-filters" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label>Exam Type:</label>
              <select 
                value={selectedExam} 
                onChange={(e) => setSelectedExam(e.target.value)}
                className="form-input"
              >
                <option value="">Select Exam</option>
                {examTypes.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.display_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Skill Type:</label>
              <select 
                value={selectedSkill} 
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="form-input"
              >
                <option value="">Select Skill</option>
                {skillTypes.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.display_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Test Part (Optional):</label>
              <select 
                value={selectedPart} 
                onChange={(e) => setSelectedPart(e.target.value)}
                className="form-input"
              >
                <option value="">All Parts</option>
                {testParts.map(part => (
                  <option key={part.id} value={part.id}>{part.display_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="prompt-admin-tabs" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)' }}>
            <button 
              className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
              style={{ 
                padding: '10px 20px', 
                border: 'none', 
                background: activeTab === 'templates' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'templates' ? 'white' : 'var(--text-primary)',
                borderRadius: '5px 5px 0 0'
              }}
            >
              📝 Templates ({templates.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
              style={{ 
                padding: '10px 20px', 
                border: 'none', 
                background: activeTab === 'preview' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'preview' ? 'white' : 'var(--text-primary)',
                borderRadius: '5px 5px 0 0'
              }}
              disabled={!selectedTemplate}
            >
              👁️ Preview
            </button>
            <button 
              className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
              onClick={() => setActiveTab('examples')}
              style={{ 
                padding: '10px 20px', 
                border: 'none', 
                background: activeTab === 'examples' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'examples' ? 'white' : 'var(--text-primary)',
                borderRadius: '5px 5px 0 0'
              }}
            >
              📊 Scoring Examples
            </button>
          </div>
        </div>

        <div className="prompt-admin-content">
          {activeTab === 'templates' && (
            <div className="templates-tab">
              {templates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                  {selectedExam && selectedSkill ? 
                    'No prompt templates found for this combination.' : 
                    'Please select exam and skill type to view templates.'}
                </div>
              ) : (
                <div className="templates-grid" style={{ display: 'grid', gap: '20px' }}>
                  {templates.map(template => (
                    <div 
                      key={template.id} 
                      className="template-card" 
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '8px', 
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: selectedTemplate?.id === template.id ? 'var(--background-elevated)' : 'white'
                      }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3>{template.template_name}</h3>
                          <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
                            {template.exam_type.display_name} • {template.skill_type.display_name}
                            {template.test_part && ` • ${template.test_part.display_name}`}
                          </p>
                          <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                            {template.description}
                          </p>
                          <div style={{ marginTop: '10px' }}>
                            <span style={{ 
                              fontSize: '0.8em', 
                              padding: '2px 8px', 
                              borderRadius: '12px',
                              backgroundColor: template.is_active ? 'var(--accent-green)' : 'var(--text-secondary)',
                              color: 'white'
                            }}>
                              v{template.version}
                            </span>
                            <span style={{ 
                              fontSize: '0.8em', 
                              padding: '2px 8px', 
                              borderRadius: '12px',
                              marginLeft: '8px',
                              backgroundColor: template.is_active ? 'var(--accent-green)' : 'var(--accent-red)',
                              color: 'white'
                            }}>
                              {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateSelect(template);
                          }}
                          className="btn btn-outline"
                          style={{ marginLeft: '10px' }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && selectedTemplate && (
            <div className="preview-tab">
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Prompt Preview: {selectedTemplate.template_name}</h2>
                <button onClick={testPrompt} className="btn btn-primary">
                  🧪 Test Prompt
                </button>
              </div>
              
              <div className="prompt-sections" style={{ display: 'grid', gap: '20px' }}>
                {promptSections.map(section => (
                  <div 
                    key={section.id} 
                    className="section-card" 
                    style={{ 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      overflow: 'hidden' 
                    }}
                  >
                    <div 
                      style={{ 
                        padding: '15px', 
                        backgroundColor: 'var(--background-elevated)', 
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0 }}>
                          {section.order_index}. {section.section_name}
                        </h4>
                        <p style={{ margin: '5px 0 0', fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                          {section.description}
                        </p>
                      </div>
                      <span style={{ 
                        fontSize: '0.8em', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        backgroundColor: getContentTypeColor(section.content_type),
                        color: 'white'
                      }}>
                        {section.content_type}
                      </span>
                    </div>
                    <div style={{ padding: '15px' }}>
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontFamily: 'inherit', 
                        margin: 0,
                        fontSize: '0.9em',
                        lineHeight: '1.5'
                      }}>
                        {section.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="examples-tab">
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                <h3>📊 Scoring Examples</h3>
                <p>Scoring examples management coming soon...</p>
                <p>This will allow you to manage scoring examples that help calibrate AI assessment accuracy.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthProtection>
  );
}

function getContentTypeColor(contentType: string): string {
  switch (contentType) {
    case 'system': return 'var(--accent-blue)';
    case 'user': return 'var(--accent-green)';
    case 'instruction': return 'var(--accent-orange)';
    default: return 'var(--text-secondary)';
  }
}