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
  const pdf_inputs_data = []

  for (let i=0; i < pdf_inputs.length; i++) {
    const data = {}
    data.pdf_input = pdf_inputs[i]
    data.pdf_doc = await pdfLib.PDFDocument.load(
      fs.readFileSync(data.pdf_input)
    )
    data.page_count = data.pdf_doc.getPageCount()

    pdf_inputs_data.push(data)
  }

  const pdf_doc_output = await pdfLib.PDFDocument.create()
  let page_index = 0

  while (pdf_inputs_data.length) {
    const data_indices_to_delete = []

    for (let i=0; i < pdf_inputs_data.length; i++) {
      const data = pdf_inputs_data[i]

      if (page_index >= data.page_count) {
        data_indices_to_delete.push(i)
        continue
      }

      const pdf_pages = await pdf_doc_output.copyPages(data.pdf_doc, [page_index])

      addPage(pdf_doc_output, pdf_pages[0], page_index, data.pdf_input)
    }

    if (data_indices_to_delete.length) {
      data_indices_to_delete.reverse()

      for (let i of data_indices_to_delete) {
        pdf_inputs_data.splice(i, 1)
      }
    }

    page_index++
  }

  const pdf_buffer = Buffer.from(
    await pdf_doc_output.save()
  )

  return pdf_buffer
}

function addPage(pdf_doc, pdf_page, page_index, pdf_input) {
  try {
    pdf_doc.addPage(pdf_page)
  }
  catch(e) {
    console.log('WARNING: failed to merge page', (page_index + 1), 'from file', pdf_input)
    console.log(e.message)
  }
}

main()
