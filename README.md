### [assorted `pdf-lib` scripts for Node.js](https://github.com/warren-bank/node-pdf-lib-scripts)

#### Credits:

* `pdf-lib` does absolutely _all_ of the heavy lifting required by this project:
  - [documentation](https://pdf-lib.js.org/docs/api/)
  - [npm](https://www.npmjs.com/package/pdf-lib)
  - [git repo](https://github.com/Hopding/pdf-lib)

#### Other tools that work well together:

1. [`qpdf`](https://github.com/qpdf/qpdf)
   - very useful to remove security encryption from a pdf before using it as input to a `pdf-lib` script
   - example of usage:
     ```bash
       qpdf --decrypt in.pdf out.pdf
     ```
   - tested with: [v6.0.0 for Win64](https://sourceforge.net/projects/qpdf/files/qpdf/6.0.0/qpdf-6.0.0-bin-mingw64.zip/download)
2. [`pdfsizeopt`](https://github.com/pts/pdfsizeopt)
   - very useful to reduce the size of a pdf that is produced as output by a `pdf-lib` script
   - example of usage:
     ```bash
       pdfsizeopt in.pdf out.pdf
     ```
   - tested with: [v9 for Win32](https://github.com/pts/pdfsizeopt/releases/download/2023-04-18/pdfsizeopt_win32exec-v9.zip)

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
