const { defineConfig } = require("cypress");
const xlsx = require('xlsx');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        parseExcel({ filePath }) {
          const workbook = xlsx.readFile(path.resolve(filePath));
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) throw new Error(`Sheet ${sheetName} not found`)
          
          try {
            return xlsx.utils.sheet_to_json(sheet, { defval: null })
          } catch (error) {
            console.error("Error parsing Excel file: ", error);
            throw error;
          }
          
        }
      })
    },
    baseUrl: 'https://preprod-inventory-accounting.simkokar.com',
    viewportWidth: 1980,
    viewportHeight: 1080,
  },
});
