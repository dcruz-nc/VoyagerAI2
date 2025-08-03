// const { exec } = require('child_process');

// const testScripts = [
//   'test:docs',
//   'test:pages',
//   'test:payment',
//   'test:rental',
//   'test:user'
// ];

// let failedScripts = [];

// function runSequentially(scripts, index = 0) {
//   if (index >= scripts.length) {
//     if (failedScripts.length > 0) {
//       console.error(`\n❌ Some tests failed: ${failedScripts.join(', ')}`);
//       process.exit(1);
//     } else {
//       console.log('\n✅ All tests passed!');
//       process.exit(0);
//     }
//     return;
//   }

//   const script = scripts[index];
//   console.log(`\n🚀 Running: npm run ${script}\n`);

//   const child = exec(`npm run ${script}`);

//   child.stdout.pipe(process.stdout);
//   child.stderr.pipe(process.stderr);

//   child.on('exit', (code) => {
//     if (code !== 0) {
//       console.error(`\n❌ ${script} failed with exit code ${code}`);
//       failedScripts.push(script);
//     } else {
//       console.log(`\n🧪 Finished: ${script} (exit code 0)`);
//     }

//     runSequentially(scripts, index + 1);
//   });

//   child.on('error', (err) => {
//     console.error(`\n❌ Failed to start ${script}:`, err);
//     failedScripts.push(script);
//     runSequentially(scripts, index + 1);
//   });
// }

// runSequentially(testScripts);
