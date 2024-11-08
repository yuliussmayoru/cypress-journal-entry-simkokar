const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
    on('task', {
        parseExcel({ filePath}) {
            const workbook = xlsx.readFile(path.resolve(filePath));
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[seetName];
            return xlsx.utils.sheet_to_json(sheet)
        }
    })
}