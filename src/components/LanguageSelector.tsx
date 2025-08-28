'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setIsOpen(false);
    
    // Since we're not using locale in URL, we need to handle language change differently
    // For now, we'll keep the current path and handle locale change via cookies or other means
    // This would require updating the middleware to detect locale from cookies/headers
    console.log(`Language changed to: ${locale}`);
    
    // In a full implementation, you would:
    // 1. Set locale in cookie/localStorage
    // 2. Reload the page to apply new locale
    // 3. Or use a locale context provider
    
    // Simple page reload with locale parameter for now
    const url = new URL(window.location.href);
    url.searchParams.set('locale', locale);
    window.location.href = url.toString();
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="language-flag">{localeFlags[currentLocale]}</span>
        <span className="language-name">{localeNames[currentLocale]}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {locales.map((locale) => (
            <button
              key={locale}
              className={`language-option ${currentLocale === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(locale)}
            >
              <span className="option-flag">{localeFlags[locale]}</span>
              <span className="option-name">{localeNames[locale]}</span>
              {currentLocale === locale && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}