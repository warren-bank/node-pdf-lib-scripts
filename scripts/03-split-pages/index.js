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

  await createPdfs(pdf_doc)
}

async function createPdfs(pdf_doc_input) {
  const page_count   = String(pdf_doc_input.getPageCount())
  const page_indices = collectListOfPageIndicesToExtractSortedInAscendingOrder()

  for (let page_index of page_indices) {
    fs.writeFileSync(
      getPdfOutputFilepath(page_index, page_count),
      await createPdf(pdf_doc_input, page_index)
    )
  }
}

function getPdfOutputFilepath(page_index, page_count) {
  let page_number = String(page_index + 1)

  if (config.options && config.options.zero_pad_page_number) {
    let pad_width = page_count.length - page_number.length

    while (pad_width > 0) {
      page_number = '0' + page_number
      pad_width--
    }
  }

  return pdf_output.replace('{{page_number}}', page_number)
}

async function createPdf(pdf_doc_input, page_index) {
  const pdf_doc_output = await pdfLib.PDFDocument.create()
  const pdf_pages      = await pdf_doc_output.copyPages(pdf_doc_input, [page_index])

  addPage(pdf_doc_output, pdf_pages[0], page_index)

  const pdf_buffer = Buffer.from(
    await pdf_doc_output.save()
  )

  return pdf_buffer
}

function collectListOfPageIndicesToExtractSortedInAscendingOrder() {
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

  return page_indices.sort((a, b) => a-b)
}

function addPage(pdf_doc, pdf_page, page_index) {
  try {
    pdf_doc.addPage(pdf_page)
  }
  catch(e) {
    console.log('WARNING: failed to split page', (page_index + 1))
    console.log(e.message)
  }
}

main()
