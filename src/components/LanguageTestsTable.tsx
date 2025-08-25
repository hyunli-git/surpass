// src/components/LanguageTestsTable.tsx

"use client";

import { useState } from 'react';
import { LanguageTest } from '@/data/languageTests';

interface LanguageTestsTableProps {
  tests: LanguageTest[];
  selectedLanguage: string;
}

export default function LanguageTestsTable({ tests, selectedLanguage }: LanguageTestsTableProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'testTakers' | 'name'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: 'rank' | 'testTakers' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedTests = tests
    .filter(test => 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'testTakers':
          aValue = a.testTakersNumber;
          bValue = b.testTakersNumber;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'TOP_10': return 'category-gold';
      case 'TOP_11_20': return 'category-silver';
      case 'TOP_21_30': return 'category-bronze';
      default: return '';
    }
  };

  const getFormatBadgeClass = (format?: string) => {
    switch (format) {
      case 'Online': return 'format-online';
      case 'Computer': return 'format-computer';
      case 'Paper': return 'format-paper';
      default: return 'format-hybrid';
    }
  };

  return (
    <div className="language-tests-table">
      {/* Search and controls */}
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="results-info">
          Showing {filteredAndSortedTests.length} of {tests.length} tests
          {selectedLanguage !== 'all' && (
            <span className="language-indicator">
              for {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="table-container desktop-only">
        <table className="tests-table">
          <thead>
            <tr>
              <th 
                className={`sortable ${sortBy === 'rank' ? 'active' : ''}`}
                onClick={() => handleSort('rank')}
              >
                Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                Test {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Language</th>
              <th 
                className={`sortable ${sortBy === 'testTakers' ? 'active' : ''}`}
                onClick={() => handleSort('testTakers')}
              >
                Test Takers {sortBy === 'testTakers' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Format</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTests.map((test) => (
              <tr key={test.id} className="test-row">
                <td className="rank-cell">
                  <div className="rank-badge">#{test.rank}</div>
                </td>
                <td className="test-cell">
                  <div className="test-info">
                    <span className="test-flag">{test.flag}</span>
                    <div className="test-details">
                      <h4 className="test-name">{test.name}</h4>
                      <div className="test-features">
                        {test.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="language-cell">
                  <span className="language-name">
                    {test.language.charAt(0).toUpperCase() + test.language.slice(1)}
                  </span>
                </td>
                <td className="test-takers-cell">
                  <div className="test-takers">
                    <span className="number">{test.testTakers}</span>
                    <span className="label">annually</span>
                  </div>
                </td>
                <td className="format-cell">
                  <span className={`format-badge ${getFormatBadgeClass(test.format)}`}>
                    {test.format}
                  </span>
                </td>
                <td className="category-cell">
                  <span className={`category-badge ${getCategoryBadgeClass(test.category)}`}>
                    {test.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="description-cell">
                  <p className="test-description">{test.description}</p>
                  <div className="target-audience">
                    <strong>Target:</strong> {test.targetAudience}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only">
        {filteredAndSortedTests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="card-header">
              <div className="test-title">
                <span className="test-flag">{test.flag}</span>
                <h4>{test.name}</h4>
                <div className="rank-badge">#{test.rank}</div>
              </div>
              <div className="badges">
                <span className={`category-badge ${getCategoryBadgeClass(test.category)}`}>
                  {test.category.replace('_', ' ')}
                </span>
                <span className={`format-badge ${getFormatBadgeClass(test.format)}`}>
                  {test.format}
                </span>
              </div>
            </div>
            
            <div className="card-content">
              <div className="test-stats">
                <div className="stat">
                  <span className="stat-label">Test Takers</span>
                  <span className="stat-value">{test.testTakers}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Language</span>
                  <span className="stat-value">
                    {test.language.charAt(0).toUpperCase() + test.language.slice(1)}
                  </span>
                </div>
              </div>
              
              <p className="test-description">{test.description}</p>
              
              <div className="test-features">
                {test.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              
              <div className="target-audience">
                <strong>Target Audience:</strong> {test.targetAudience}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedTests.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No tests found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}