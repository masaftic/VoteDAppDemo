import fs from 'fs';
import path from 'path';


const source = path.resolve(__dirname, './deployments-info/voting_contract_info.json');
const destination = path.resolve(__dirname, '../web3-client/public/deployments-info/voting_contract_info.json');
console.log("source:", source);
console.log("destination:", destination);

fs.copyFileSync(source, destination);
