import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const packageRoots = ['packages-engine', 'packages-pressets', 'packages-integrations']

function findDistFolders() {
  const distFolders: string[] = []

  for (const folder of packageRoots) {
    const absoluteFolder = path.join(root, folder)
    if (!existsSync(absoluteFolder))
      continue

    for (const entry of readdirSync(absoluteFolder, { withFileTypes: true })) {
      if (!entry.isDirectory())
        continue

      const distDir = path.join(absoluteFolder, entry.name, 'dist')
      if (existsSync(distDir) && statSync(distDir).isDirectory())
        distFolders.push(distDir)
    }
  }

  return distFolders
}

const distFolders = findDistFolders()

if (!distFolders.length) {
  console.log('No dist folders found to remove.')
  process.exit(0)
}

for (const dir of distFolders) {
  rmSync(dir, { recursive: true, force: true })
  console.log(`Removed ${dir}`)
}

console.log(`\nRemoved ${distFolders.length} dist folder(s).`)
