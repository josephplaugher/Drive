import { useState, useEffect, MouseEvent, ReactNode, SetStateAction } from 'react'
import Ajax from './util/Ajax'
import './App.css'

function App() {
  const base_dir: string = "/home/joseph/"
  const [files, setFiles] = useState<string[]>([])
  const [cwd, setCwd] = useState<string>('')
  const [breadCrumbs, setBreadCrumbs] = useState<string[]>(['Home'])

  useEffect(()=> {
    console.log('cwd ', cwd)
  },[cwd])

  useEffect(()=> {
    let files = Ajax.get("http://localhost:3000/files")
    files.then(data => {
      setFiles(data.data.files)
    })

    
  },[])

function openDir(event: React.MouseEvent<HTMLParagraphElement>) {
  let dirName = event.currentTarget.textContent
  if (dirName == null) return
  console.log('click', dirName)
  let prevBC: string[] = breadCrumbs
  prevBC.push(dirName)
  setBreadCrumbs(prevBC)
  getFiles(dirName)
}

function getFiles(dirName: string) {
  console.log('cwd in getFiles', cwd)
  let dir = cwd ? cwd + "/" + dirName : dirName
  console.log('dir in getFiles', dir)
  let files = Ajax.get("http://localhost:3000/files?subdir=" + dir)
    files.then(data => {
      setFiles(data.data.files)
      setCwd((prevCwd: string) => prevCwd ? prevCwd + "/" + dirName : dirName)
    })
}

const BreadCrumbs: ReactNode = breadCrumbs.map((b,i) => {
  return <span key={`breadcrumb-item-${b[i]}`} className="w-auto">{` ${b} -> `}</span>
})

  const fileList = files.map((file,i) =>
    <div key={`file-${i}`}><p onClick={openDir}>{file}</p></div>
    )
    
  return (
    <div className="container-fluid">
      <div className="row">
          <div className="d-flex justify-content-start w-100">{BreadCrumbs}</div>
        </div>
        <div className="row ps-4">
          <div className="col-5 d-flex flex-column justify-content-start">
            {files && fileList}
          </div>
      </div>
    </div>
  )
}

export default App
