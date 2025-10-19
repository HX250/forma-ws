const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../env/prod.env.ts');
const apiEndpoint = process.env.API_END_POINT || '';

const envConfigFile = `export const environment = {
  production: true,
  API_END_POINT: '${apiEndpoint}',
};
`;

fs.writeFileSync(targetPath, envConfigFile);

