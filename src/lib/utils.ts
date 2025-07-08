import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHP(current: number, max: number): string {
  return `${current}/${max}`;
}

export function getHPPercentage(current: number, max: number): number {
  return Math.max(0, Math.min(100, (current / max) * 100));
}

export function formatInitiative(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

