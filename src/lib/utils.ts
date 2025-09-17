import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'pt' ? ptBR : locale === 'es' ? es : enUS;
  return format(dateObj, 'PPP', { locale: localeObj });
}

export function formatTime(date: string | Date, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'pt' ? ptBR : locale === 'es' ? es : enUS;
  return format(dateObj, 'p', { locale: localeObj });
}

export function formatDateTime(date: string | Date, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'pt' ? ptBR : locale === 'es' ? es : enUS;
  return format(dateObj, 'PPpp', { locale: localeObj });
}

export function formatRelativeTime(date: string | Date, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'pt' ? ptBR : locale === 'es' ? es : enUS;
  return formatRelative(dateObj, new Date(), { locale: localeObj });
}

export function formatDistanceTime(date: string | Date, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'pt' ? ptBR : locale === 'es' ? es : enUS;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: localeObj });
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Brazilian phone number format
  if (cleaned.startsWith('55') && cleaned.length === 13) {
    // +55 11 99999-9999
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  
  // US phone number format
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    // +1 (555) 123-4567
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Default format for other numbers
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  return phone;
}

// Extract phone number for API calls
export function extractPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if URL is valid
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Format number with separator
export function formatNumber(value: number, locale: string = 'pt'): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US').format(value);
}

// Format currency
export function formatCurrency(value: number, currency: string = 'BRL', locale: string = 'pt'): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// Sleep function for delays
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (error) {
      document.body.removeChild(textArea);
      return false;
    }
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}

// Download file
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Parse CSV
export function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
  return { headers, rows };
}

// Generate CSV
export function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.join(',');
  const dataLines = rows.map(row => row.join(','));
  return [headerLine, ...dataLines].join('\n');
}

// Get error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Validate Brazilian phone number
export function isValidBrazilianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^55\d{10,11}$/.test(cleaned);
}

// Format WhatsApp JID
export function formatJID(jid: string): string {
  if (jid.includes('@g.us')) {
    return jid; // Group JID
  }
  if (jid.includes('@newletter')) {
    return jid; // Newsletter JID
  }
  if (jid.includes('@broadcast')) {
    return jid; // Broadcast JID
  }
  if (jid.includes('@c.us')) {
    return jid; // Individual JID
  }
  if (jid.includes('@s.whatsapp.net')) {
    return jid; // Already formatted
  }
  if (jid.includes('@lid')) {
    return jid; // LID JID
  }
  // Format as individual JID
  const cleaned = jid.replace(/\D/g, '');
  return `${cleaned}@s.whatsapp.net`;
}

// Extract phone from JID
export function extractPhoneFromJID(jid: string): string {
  return jid.replace('@s.whatsapp.net', '').replace('@c.us', '').replace('@g.us', '').replace('@newletter', '').replace('@broadcast', '').replace('@lid', '');
}