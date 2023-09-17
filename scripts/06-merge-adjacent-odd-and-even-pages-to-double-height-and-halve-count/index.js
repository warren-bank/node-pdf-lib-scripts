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

  const pdf_pages = pdf_doc.getPages()
  const {width, height} = pdf_pages[0].getSize()

  fs.writeFileSync(
    pdf_output,
    await createPdf(pdf_pages, width, height)
  )
}

async function createPdf(pdf_pages, width, height) {
  const pdf_doc = await pdfLib.PDFDocument.create()

  let is_last_page, old_page, new_page
  for (let i=0; i < pdf_pages.length; i+=2) {
    is_last_page = (i === (pdf_pages.length - 1))

    old_page = pdf_pages[i]
    new_page = pdf_doc.addPage([width, (height * 2)])
    new_page.drawPage(
      await pdf_doc.embedPage(old_page),
      {x: 0, y: 0}
    )

    if (is_last_page) break

    old_page = pdf_pages[i+1]
    new_page.drawPage(
      await pdf_doc.embedPage(old_page),
      {x: 0, y: height}
    )
  }

  const pdf_buffer = Buffer.from(
    await pdf_doc.save()
  )

  return pdf_buffer
}

main()
