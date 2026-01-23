import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const input = await Bun.stdin.json();
const MAX_ITERATIONS = 3;

// Check scratchpad for DONE flag
const scratchpad = existsSync('.cursor/scratchpad.md')
  ? readFileSync('.cursor/scratchpad.md', 'utf-8')
  : '';

if (scratchpad.includes('DONE') || input.loop_count >= MAX_ITERATIONS) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Run quality gates
let qualityReport = '';

try {
  execSync('npm run lint', { stdio: 'pipe' });
  qualityReport += '✅ Lint passed\n';
} catch (error) {
  qualityReport += '❌ Lint failed\n';
}

try {
  execSync('npm run build', { stdio: 'pipe' });
  qualityReport += '✅ Build passed\n';
} catch (error) {
  qualityReport += '❌ Build failed\n';
}

try {
  execSync('npm run test', { stdio: 'pipe' });
  qualityReport += '✅ Tests passed\n';
} catch (error) {
  qualityReport += '❌ Tests failed\n';
}

// If quality gates fail, continue work
if (qualityReport.includes('❌')) {
  console.log(
    JSON.stringify({
      followup_message: `[Iteration ${input.loop_count + 1}/${MAX_ITERATIONS}]
Quality gates failed:
${qualityReport}

Please fix all issues before continuing. Update .cursor/scratchpad.md with DONE when all quality gates pass.`,
    })
  );
} else {
  console.log(JSON.stringify({}));
}
