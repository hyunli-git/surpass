// src/components/LanguageFilter.tsx

"use client";

import { useState } from 'react';
import { LANGUAGES } from '@/data/languageTests';

interface LanguageFilterProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  testCounts: Record<string, number>;
}

export default function LanguageFilter({ selectedLanguage, onLanguageChange, testCounts }: LanguageFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="language-filter">
      <h3>Filter by Language</h3>
      
      {/* Mobile dropdown */}
      <div className="language-dropdown mobile-only">
        <button 
          className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="selected-language">
            {LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag} {LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className={`dropdown-item ${selectedLanguage === language.code ? 'active' : ''}`}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
              >
                <span className="language-info">
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                </span>
                <span className="test-count">
                  {testCounts[language.code] || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop grid */}
      <div className="language-grid desktop-only">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            className={`language-button ${selectedLanguage === language.code ? 'active' : ''}`}
            onClick={() => onLanguageChange(language.code)}
          >
            <span className="language-flag">{language.flag}</span>
            <span className="language-name">{language.name}</span>
            <span className="test-count">
              {testCounts[language.code] || 0} tests
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}