import { format, parseISO } from "date-fns";

export function yyyyMMDD(date: Date) {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

export function getDate(date: string) {
 const dateObj = parseISO(date);
  return format(dateObj, "yyyy-MM-dd");
}

export function getTime(date: string) {
   const dateObj = parseISO(date);
   return format(dateObj, "HH:mm:ss");
}