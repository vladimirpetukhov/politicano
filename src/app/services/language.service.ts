
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'en' | 'bg' | 'ru' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
    // Try to get language from local storage or use browser language
    const savedLang = localStorage.getItem('preferredLanguage') as SupportedLanguage;
    if (savedLang && this.isSupported(savedLang)) {
      this.setLanguage(savedLang);
    } else {
      const browserLang = this.getBrowserLanguage();
      this.setLanguage(browserLang);
    }
  }

  setLanguage(lang: SupportedLanguage): void {
    localStorage.setItem('preferredLanguage', lang);
    this.currentLanguageSubject.next(lang);
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  private getBrowserLanguage(): SupportedLanguage {
    const browserLang = navigator.language.split('-')[0];
    return this.isSupported(browserLang as SupportedLanguage) ? 
      browserLang as SupportedLanguage : 'en';
  }

  private isSupported(lang: string): boolean {
    return ['en', 'bg', 'ru', 'es'].includes(lang);
  }
}
