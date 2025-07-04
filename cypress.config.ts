import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 5000,
    responseTimeout: 10000,
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
