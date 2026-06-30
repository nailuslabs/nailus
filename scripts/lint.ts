import { execSync } from 'node:child_process'
import process from 'node:process'

try {
  execSync('eslint . --ext .ts,.js,.mjs', { stdio: 'inherit' })
}
catch {
  process.exit(1)
}
