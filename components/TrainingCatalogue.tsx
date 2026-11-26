'use client';

import React, { useState, useMemo } from 'react';
import { TRAINING_CATEGORIES, CourseCategory } from '@/lib/data';
import { EnquiryTrigger } from './EnquiryTrigger';

interface TrainingCatalogueProps {
  initialCategory?: string;
}

export function TrainingCatalogue({ initialCategory = 'all' }: TrainingCatalogueProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCourses = useMemo(() => {
    const list: Array<{ course: string; category: CourseCategory }> = [];
    TRAINING_CATEGORIES.forEach((cat) => {
      cat.courses.forEach((course) => {
        list.push({ course, category: cat });
      });
    });
    return list;
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category.id === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.course.toLowerCase().includes(query) ||
        item.category.name.toLowerCase().includes(query) ||
        item.category.shortName.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allCourses, selectedCategory, searchQuery]);

  return (
    <div className="catalogue-container" id="catalogue">
      {/* Search and Category Filter Toolbar */}
      <div className="catalogue-toolbar">
        <div className="catalogue-search-wrapper">
          <label htmlFor="catalogue-search" className="sr-only">
            Search courses or topics
          </label>
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="catalogue-search"
            type="search"
            className="catalogue-search-input"
            placeholder="Search courses or topics (e.g., ITIL, ServiceNow, ISO, Copilot, SRE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        <div className="catalogue-category-tabs" role="tablist" aria-label="Course Categories">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            className={`category-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories ({allCourses.length})
          </button>
          {TRAINING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.shortName} ({cat.courses.length})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="catalogue-results-header">
        <div className="results-count">
          Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'programme' : 'programmes'}
          {selectedCategory !== 'all' && (
            <span> in <em>{TRAINING_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</em></span>
          )}
          {searchQuery.trim() && (
            <span> matching &ldquo;{searchQuery.trim()}&rdquo;</span>
          )}
        </div>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            type="button"
            className="reset-filters-link"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Courses List / Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="catalogue-empty-state">
          <span className="empty-icon" aria-hidden="true">🔍</span>
          <h3>No matching courses found</h3>
          <p>We couldn’t find any courses matching your search term or category selection.</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            View all courses
          </button>
        </div>
      ) : (
        <div className="catalogue-grid" role="list">
          {filteredCourses.map((item, idx) => (
            <article key={`${item.category.id}-${idx}-${item.course}`} className="catalogue-card" role="listitem">
              <div className="catalogue-card-content">
                <span className="course-category-badge">{item.category.name}</span>
                <h4 className="course-title">{item.course}</h4>
                <div className="course-tier-hints">
                  <span>Awareness</span> · <span>Practitioner</span> · <span>Exam Prep</span>
                </div>
              </div>
              <div className="catalogue-card-action">
                <EnquiryTrigger
                  service="Professional training"
                  itemContext={item.course}
                  variant="button secondary"
                  className="course-enquiry-btn"
                  ariaLabel={`Enquire about ${item.course}`}
                >
                  Enquire <span>↗</span>
                </EnquiryTrigger>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
