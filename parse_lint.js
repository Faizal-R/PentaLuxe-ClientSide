import fs from 'fs';

const data = JSON.parse(fs.readFileSync('lint_output.json', 'utf8'));

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

console.log(JSON.stringify(unusedVars, null, 2));
