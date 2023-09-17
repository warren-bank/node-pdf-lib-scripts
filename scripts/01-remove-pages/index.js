const pdfLib = require('pdf-lib')
const config = require('./config')
const fs     = require('fs')
const path   = require('path')

const pdf_input  = path.resolve(__dirname, config.pdf_input)
const pdf_output = path.resolve(__dirname, config.pdf_output)

async function main() {
  const pdf_doc = await pdfLib.PDFDocument.load(
    fs.readFileSync(pdf_input)
  )

  fs.writeFileSync(
    pdf_output,
    await createPdf(pdf_doc)
  )
}

async function createPdf(pdf_doc) {
  const page_indices = collectListOfPageIndicesToRemoveSortedInDescendingOrder()

  for (let page_index of page_indices) {
    removePage(pdf_doc, page_index)
  }

  const pdf_buffer = Buffer.from(
    await pdf_doc.save()
  )

  return pdf_buffer
}

function collectListOfPageIndicesToRemoveSortedInDescendingOrder() {
  const page_indices = []

  if (config.pages) {
    if (Array.isArray(config.pages.range) && config.pages.range.length) {
      for (let range of config.pages.range) {
        if ((typeof range.from === 'number') && (typeof range.to === 'number')) {
          for (let page_index = range.from - 1; page_index < range.to; page_index++) {
            page_indices.push(page_index)
          }
        }
      }
    }
    if (Array.isArray(config.pages.list) && config.pages.list.length) {
      for (let page_number of config.pages.list) {
        page_indices.push((page_number - 1))
      }
    }
  }

  return page_indices.sort((a, b) => b-a)
}

function removePage(pdf_doc, page_index) {
  try {
    pdf_doc.removePage(page_index)
  }
  catch(e) {
    console.log('WARNING: failed to remove page', (page_index + 1))
    console.log(e.message)
  }
}

main()
