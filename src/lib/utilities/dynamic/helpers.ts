

export function isNumberLead(i: string) {
  return /^\d/.test(i) ? i : undefined;
}



export function notNumberLead(i: string) {
  return /^\d/.test(i) ? undefined : i;
}
