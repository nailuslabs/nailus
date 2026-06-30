import { spawnSync } from 'child_process'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import process from 'process'

const root = process.cwd()
const packageRoots = ['packages-engine', 'packages-pressets', 'packages-integrations']
const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function findPackages() {
  const packages: Array<{ name: string, dir: string }> = []

  for (const folder of packageRoots) {
    const absoluteFolder = path.join(root, folder)
    if (!existsSync(absoluteFolder))
      continue

    for (const entry of readdirSync(absoluteFolder, { withFileTypes: true })) {
      if (!entry.isDirectory())
        continue

      const packageDir = path.join(absoluteFolder, entry.name)
      const pkgJsonPath = path.join(packageDir, 'package.json')
      if (!existsSync(pkgJsonPath))
        continue

      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as { name?: string, private?: boolean }
      if (pkgJson.private)
        continue

      packages.push({
        name: pkgJson.name || entry.name,
        dir: packageDir,
      })
    }
  }

  return packages
}

const packages = findPackages()

if (!packages.length) {
  console.log('No workspace packages found to build.')
  process.exit(0)
}

for (const pkg of packages) {
  console.log(`\n▶ Building ${pkg.name}`)
  const cmd = process.platform === 'win32' ? 'cmd.exe' : pnpmBin
  const args = process.platform === 'win32'
    ? ['/c', 'pnpm', '--dir', pkg.dir, 'run', 'build']
    : ['--dir', pkg.dir, 'run', 'build']

  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    console.error('Build command failed for', pkg.name, { status: result.status, error: result.error })
    process.exit(result.status ?? 1)
  }
}

console.log('\nAll workspace packages built successfully.')
