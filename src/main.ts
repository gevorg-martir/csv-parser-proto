import './style.css'
import { parse } from 'papaparse'

const main = () => {
  const app = document.querySelector<HTMLDivElement>('#app')!

  app.innerHTML = `
    <label class="label" for="csv">Upload csv</label>
    <input id="csv" type="file" accept=".csv"/>
    <div class="content"></div>
  `

  const readFile = (file: File): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        resolve(reader.result?.toString())
      }

      reader.onerror = () => {
        reject(reader.error)
      }
    })
  }

  // const convertCSVToJSON = (str: string, delimiter = ','): any => str.slice(0).split('\n').map((row: string) => row.split(delimiter))

  const renderOnUi = (addressData: [][]) => {
    const content = document.querySelector('.content')
    if (content) {
      content.innerHTML = `
        <table>
          <tr>
            ${addressData[0].map((column: string) => `
              <th>${column}</th>
            `).toString().replace(/,/g, '')}
          </tr>
          ${addressData.slice(1).map((row: string[]) => `
            <tr>
              ${row.map((column: string) => `
                <td class="${!column ? 'error' : ''}">${column}</td>
              `).toString().replace(/,/g, '')}
            </tr>
          `).toString().replace(/,/g, '')}
        </table>
      `
    }
  }

  const processFile = async (file: File) => {
    const csv = await readFile(file)
    const addressData = parse(<string>csv)
    renderOnUi(<any>addressData.data)
  }

  document.querySelector('#csv')?.addEventListener('change', (e) => {
    const { files } = <HTMLInputElement>e.target
    if (files && files[0]) {
      processFile(files[0])
    }
  })
}

window.addEventListener('load', () => {
  main()
})
