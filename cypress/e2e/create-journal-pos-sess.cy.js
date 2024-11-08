describe('create journal POS-SESS', ()=> {
  let inputData;

  before(()=> {
    // load data from excel file
    cy.task('parseExcel', { filePath: 'cypress/fixtures/pos-sess-data.xlsx'}).then((jsonData) => {
      inputData = jsonData;
      console.log(inputData)
    })

    cy.visit('https://preprod-inventory-accounting.simkokar.com/login');
    cy.get('#input_email_login').type('holding@kokarmina.com')
    cy.get('#input_password_login').type('Kokarmina123')
    cy.get('#btn_submit').click()
    cy.wait(1000)
  })

  it('Add New POS-SESS Journal Entry', () => {
    cy.intercept('GET', '**/accounting/coa').as('coaListCall')
    cy.intercept('GET', '**/accounting/gl').as('jurnalCreateCall')
    const { 
      REFERENCE,
      DESCRIPTION,
      NOTES1,
      NOTES2,
      ACCOUNT1,
      ACCOUNT2,
      ACCOUNT3,
      ACCOUNT4,
      ACCOUNT5,
      DEBIT1,
      DEBIT2,
      DEBIT3,
      DEBIT4,
      DEBIT5,
      CREDIT1,
      CREDIT2,
      CREDIT3,
      CREDIT4,
      CREDIT5,
      SOURCE1,
      SOURCE2,
      SOURCE3,
      SOURCE4,
      MEMO1,
      MEMO2,
      MEMO3,
      MEMO4,
      MEMO5
    } = inputData[0];

    function getDate() {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      return `${year}-${month}-${day}`
    }

    const date = getDate()

    cy.visit('https://preprod-inventory-accounting.simkokar.com/jurnal-entry/add')
    cy.get('#input_reference').type(REFERENCE);
    //cy.get('#input_date').type('2024-11-01');
    cy.log(date)
    cy.get('#input_date').type(date)
    cy.get('#input_desc')
    

  })

})