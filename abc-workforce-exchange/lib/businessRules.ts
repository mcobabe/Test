export const AVAILABILITY_DAYS = 30;
export const CONTACT_ACCESS_HOURS = 72;

export type CandidateLevel =
  | 'apprentice'
  | 'journeyman'
  | 'foreman'
  | 'superintendent'
  | 'project_manager'
  | 'estimator'
  | 'executive';

export function contactUnlockPriceCents(level: CandidateLevel): number {
  if (level === 'foreman' || level === 'superintendent') return 25_000;
  if (level === 'project_manager' || level === 'estimator' || level === 'executive') return 50_000;
  return 10_000;
}

export function availabilityExpiration(from = new Date()): Date {
  const expires = new Date(from);
  expires.setDate(expires.getDate() + AVAILABILITY_DAYS);
  return expires;
}

export function contactExpiration(from = new Date()): Date {
  return new Date(from.getTime() + CONTACT_ACCESS_HOURS * 60 * 60 * 1000);
}

export function daysAvailable(startedAt: Date, now = new Date()): number {
  const milliseconds = Math.max(0, now.getTime() - startedAt.getTime());
  return Math.floor(milliseconds / 86_400_000) + 1;
}

export function isContactAccessActive(expiresAt: Date, now = new Date()): boolean {
  return now < expiresAt;
}
