/**
 * Date helper utilities for scheduling and ISO formatting.
 */

export const addDays = (days: number, fromDate?: Date): Date => {
  const d = fromDate ? new Date(fromDate) : new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const toISODate = (date?: Date): string => {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
