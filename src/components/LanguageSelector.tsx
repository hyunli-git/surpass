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
    
    // Get the current path without any locale prefix
    let pathWithoutLocale = pathname;
    
    // Remove any existing locale prefix from the path
    for (const loc of locales) {
      if (pathWithoutLocale.startsWith(`/${loc}`)) {
        pathWithoutLocale = pathWithoutLocale.slice(`/${loc}`.length) || '/';
        break;
      }
    }
    
    // Navigate to the new locale - all languages use prefix with 'always'
    const newPath = `/${locale}${pathWithoutLocale}`;
    router.push(newPath);
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