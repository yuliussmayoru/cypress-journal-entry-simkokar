import moment from 'moment';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('create journal POS-SESS', () => {
    before(() => {
        // Load and transform data from Excel file
        cy.task('parseExcel', { filePath: 'cypress/fixtures/data-pembanding-paylater-journal.xlsx' }).then((jsonData) => {
            const transformedData = [];
            let currentEntry = null;

            jsonData.forEach((row) => {
                if (row.reference) {
                    if (currentEntry) {
                        transformedData.push(currentEntry);
                    }

                    currentEntry = {
                        reference: row.reference,
                        date: moment('1900-01-01').add(row.date - 2, 'days').format('YYYY-MM-DD'),
                        description: row.description,
                        account: [row.account],
                        debit: [row.debit],
                        credit: [row.credit],
                        source: [row.source],
                        memo: [row.memo]
                    };
                } else if (currentEntry) {
                    currentEntry.account.push(row.account);
                    currentEntry.debit.push(row.debit);
                    currentEntry.credit.push(row.credit);
                    currentEntry.source.push(row.source);
                    currentEntry.memo.push(row.memo);
                }
            });

            if (currentEntry) {
                transformedData.push(currentEntry);
            }

            console.log(transformedData);
            cy.wrap(transformedData).as('transformedData');
        });

        // Log in
        cy.visit('https://qa-inventory-accounting.simkokar.com/login');
        cy.get('#input_email_login').type('holding@kokarmina.com');
        cy.get('#input_password_login').type('HoldingSimko@2024');
        cy.get('#btn_submit').click();
        cy.wait(1000);
    });

    it('Add New Journal Pembanding', () => {
        cy.intercept('GET', '**/accounting/coa').as('coaListCall');
        cy.intercept('GET', '**/accounting/gl').as('jurnalCreateCall');

        // Access the transformed data and iterate over each journal entry
        cy.get('@transformedData').then((entries) => {
            entries.forEach((entry) => {
                const {
                    reference,
                    date,
                    description,
                    account = [],
                    debit = [],
                    credit = [],
                    source = [],
                    memo = []
                } = entry;

                const formattedDate = date || '';

                // Start test sequence for each entry
                cy.visit('https://qa-inventory-accounting.simkokar.com/jurnal-entry/add');
                cy.get('#input_reference').type(reference);
                cy.get('#input_date').type(formattedDate, { force: true });
                cy.get('#input_desc').type(description);

                // Open additional input fields if account array is greater than 2
                if (account.length > 2) {
                    cy.get('#head_wrapper_button > .btn').click();
                }

                cy.wait('@coaListCall').then(() => {
                    account.forEach((acc, index) => {
                        if (acc) { // Ensure the account value is defined
                            cy.get(`#input_coa_${index}`).type(acc, { force: true });
                            cy.get(`#input_coa_${index}`).type('{enter}', { force: true });
                        }
                    });
                });

                debit.forEach((deb, index) => {
                    if (deb !== undefined && deb !== null) { // Ensure the debit value is defined and non-null
                        cy.get(`#input_debit_${index}`).type(deb.toString(), { force: true });
                    }
                });

                credit.forEach((cred, index) => {
                    if (cred !== undefined && cred !== null) { // Ensure the credit value is defined and non-null
                        cy.get(`#input_credit_${index}`).type(cred.toString(), { force: true });
                    }
                });

                source.forEach((src, index) => {
                    if (src) { // Ensure the source value is defined
                        cy.get(`#input_source_${index}`).type(src, { force: true });
                    }
                });

                memo.forEach((mm, index) => {
                    if (mm) { // Ensure the memo value is defined
                        cy.get(`#input_memo_${index}`).type(mm, { force: true });
                    }
                });

                cy.get('#btn_submit').click();

                // Add a wait to ensure each entry is processed before the next one
                cy.wait(2000);
            });
        });
    });
});
