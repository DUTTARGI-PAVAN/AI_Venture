// client/src/services/api.js

// Placeholder API helper

export const api = {
  get: async (path) => fetch(path).then(r => r.json()),
};
