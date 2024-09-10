
export const isInteger = (value: string) => {
  // Check if the value is a number or a numeric string
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    // Convert the value to a number and check if it is an integer
    return Number.isInteger(Number(value));
  }
  return false;
}