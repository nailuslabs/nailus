import { execSync } from 'node:child_process'
import process from 'node:process'

try {
  execSync('node --test', { stdio: 'inherit' })
}
catch {
  process.exit(1)
}
