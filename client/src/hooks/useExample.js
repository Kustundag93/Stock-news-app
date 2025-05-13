import { useState } from 'react';

export function useExample() {
  const [value, setValue] = useState(null);
  // Example hook logic
  return [value, setValue];
} 