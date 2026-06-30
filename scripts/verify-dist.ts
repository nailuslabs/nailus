import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const packageRoots = ['packages-engine', 'packages-pressets', 'packages-integrations']

function findPackages() {
  const packages: Array<{ name: string, distDir: string }> = []

  for (const folder of packageRoots) {
    const absoluteFolder = path.join(root, folder)
    if (!existsSync(absoluteFolder))
      continue

    for (const entry of readdirSync(absoluteFolder, { withFileTypes: true })) {
      if (!entry.isDirectory())
        continue

      const dir = path.join(absoluteFolder, entry.name)
      const pkgJsonPath = path.join(dir, 'package.json')
      if (!existsSync(pkgJsonPath))
        continue

      const distDir = path.join(dir, 'dist')
      if (existsSync(distDir) && statSync(distDir).isDirectory())
        packages.push({ name: entry.name, distDir })
    }
  }

  return packages
}

const packages = findPackages()

if (!packages.length) {
  console.log('No dist folders found.')
  process.exit(0)
}

for (const pkg of packages) {
  console.log(`✔ ${pkg.name}: ${pkg.distDir}`)
}
