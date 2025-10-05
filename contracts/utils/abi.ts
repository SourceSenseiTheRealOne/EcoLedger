import { readFileSync } from 'fs';
import { join } from 'path';

export function getABI(contractName: string): any {
  try {
    const abiPath = join(__dirname, 'abi.json');
    const abi = JSON.parse(readFileSync(abiPath, 'utf8'));
    return abi;
  } catch (error) {
    console.error(`Error reading ABI for ${contractName}:`, error);
    return null;
  }
}

export function getContractAddress(network: string): string | null {
  try {
    const deploymentPath = join(__dirname, '..', 'deployments', `${network}.json`);
    const deployment = JSON.parse(readFileSync(deploymentPath, 'utf8'));
    return deployment.contractAddress;
  } catch (error) {
    console.error(`Error reading deployment info for ${network}:`, error);
    return null;
  }
}

export function getDeploymentInfo(network: string): any {
  try {
    const deploymentPath = join(__dirname, '..', 'deployments', `${network}.json`);
    const deployment = JSON.parse(readFileSync(deploymentPath, 'utf8'));
    return deployment;
  } catch (error) {
    console.error(`Error reading deployment info for ${network}:`, error);
    return null;
  }
}
