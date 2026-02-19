import { execSync } from 'child_process';

try {
  const output = execSync('npm run lint -- --format json', { encoding: 'utf8' });
  const data = JSON.parse(output);
  const unusedVars = [];

  data.forEach(file => {
    file.messages.forEach(msg => {
      if (msg.ruleId === '@typescript-eslint/no-unused-vars' || msg.ruleId === 'no-unused-vars') {
        unusedVars.push({
          filePath: file.filePath,
          line: msg.line,
          column: msg.column,
          message: msg.message,
          nodeType: msg.nodeType
        });
      }
    });
  });

  process.stdout.write(JSON.stringify(unusedVars, null, 2));
} catch (error) {
  // execSync throws if exit code is not 0
  if (error.stdout) {
    const data = JSON.parse(error.stdout.toString());
    const unusedVars = [];

    data.forEach(file => {
      file.messages.forEach(msg => {
        if (msg.ruleId === '@typescript-eslint/no-unused-vars' || msg.ruleId === 'no-unused-vars') {
          unusedVars.push({
            filePath: file.filePath,
            line: msg.line,
            column: msg.column,
            message: msg.message,
            nodeType: msg.nodeType
          });
        }
      });
    });

    process.stdout.write(JSON.stringify(unusedVars, null, 2));
  } else {
    console.error(error);
  }
}
