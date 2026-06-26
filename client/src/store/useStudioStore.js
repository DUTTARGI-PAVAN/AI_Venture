// client/src/store/useStudioStore.js

// Simple local store placeholder

import { useState } from 'react';

export function useStudioStore() {
  const [state, setState] = useState({});
  return [state, setState];
}
