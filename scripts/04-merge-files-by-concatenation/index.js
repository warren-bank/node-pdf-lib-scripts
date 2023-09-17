const pdfLib = require('pdf-lib')
const config = require('./config')
const fs     = require('fs')
const path   = require('path')

const pdf_inputs = config.pdf_input.map(pdf_input => path.resolve(__dirname, pdf_input))
const pdf_output = path.resolve(__dirname, config.pdf_output)

async function main() {
  fs.writeFileSync(
    pdf_output,
    await createPdf()
  )
}

async function createPdf() {
  const pdf_doc_output = await pdfLib.PDFDocument.create()

  for (let pdf_input of pdf_inputs) {
    const pdf_doc_input = await pdfLib.PDFDocument.load(
      fs.readFileSync(pdf_input)
    )

    const pdf_pages = await pdf_doc_output.copyPages(pdf_doc_input, pdf_doc_input.getPageIndices())

    for (let page_index = 0; page_index < pdf_pages.length; page_index++) {
      addPage(pdf_doc_output, pdf_pages, page_index, pdf_input)
    }
  }

  const pdf_buffer = Buffer.from(
    await pdf_doc_output.save()
  )

  return pdf_buffer
}

function addPage(pdf_doc, pdf_pages, page_index, pdf_input) {
  try {
    pdf_doc.addPage(pdf_pages[page_index])
  }
  catch(e) {
    console.log('WARNING: failed to merge page', (page_index + 1), 'from file', pdf_input)
    console.log(e.message)
  }
}

main()
