// Enhanced API wrapper for Voting Contract
// Generated on: 2025-09-28T03:27:47.364Z
// Auto-generated from voting.compact

import { type Logger } from 'pino';
import { ContractAnalyzer } from './contract-analyzer.js';
import { DynamicCLIGenerator } from './dynamic-cli-generator.js';
import * as originalApi from './api.js';

// Re-export all original API functions
export * from './api.js';

/**
 * Contract information interface
 */
export interface ContractInfo {
  contractName: string;
  functions: Array<{
    name: string;
    parameters: Array<{ name: string; type: string }>;
    returnType: string;
    readOnly: boolean;
    description: string;
  }>;
  ledgerState: Array<{ name: string; type: string }>;
  witnesses: Array<{
    name: string;
    ledgerType: string;
    privateType: string;
    returns: string[];
  }>;
}

/**
 * Enhanced API with dynamic contract analysis
 */
export class EnhancedContractAPI {
  private analyzer: ContractAnalyzer;
  private cliGenerator: DynamicCLIGenerator;
  private contractInfo: ContractInfo | null;

  constructor(logger: Logger) {
    this.analyzer = new ContractAnalyzer();
    this.cliGenerator = new DynamicCLIGenerator(logger);
    this.contractInfo = null;
  }

  async initialize(): Promise<ContractInfo> {
    try {
      const analysis = await this.analyzer.analyzeContract();
      await this.cliGenerator.initialize();
      
      // Convert ContractAnalysis to ContractInfo format
      this.contractInfo = {
        contractName: analysis.contractName,
        functions: analysis.functions.map(func => ({
          ...func,
          readOnly: this.analyzer.isReadOnlyFunction(func.name),
          description: func.description || `Execute ${func.name} function`
        })),
        ledgerState: Object.entries(analysis.ledgerState).map(([name, type]) => ({ name, type })),
        witnesses: analysis.witnesses.map(witness => ({
          name: witness.name,
          ledgerType: witness.ledgerType,
          privateType: witness.privateType,
          returns: witness.returns
        }))
      };
      
      return this.contractInfo;
    } catch (error) {
      throw new Error(`Failed to initialize enhanced API: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getContractInfo(): ContractInfo | null {
    return this.contractInfo;
  }

  generateMenuItems(): any[] {
    return this.cliGenerator.generateMenuItems();
  }

  generateMenuQuestion(menuItems: any[]): string {
    return this.cliGenerator.generateMenuQuestion(menuItems);
  }

  // Dynamic function mapping based on contract analysis
  /**
   * Execute vote function
   */
  async vote(...args: any[]): Promise<any> {
    return await (originalApi as any).vote(...args);
  }
  /**
   * Execute get_votes function
   */
  async get_votes(...args: any[]): Promise<any> {
    return await (originalApi as any).get_votes(...args);
  }
}

// Export contract metadata for reference
export const CONTRACT_METADATA = {
  name: 'Voting Contract',
  fileName: 'voting.compact',
  generatedAt: '2025-09-28T03:27:47.365Z',
  functions: [
  {
    "name": "vote",
    "parameters": [],
    "returnType": "[]",
    "readOnly": false
  },
  {
    "name": "get_votes",
    "parameters": [],
    "returnType": "Uint<64>",
    "readOnly": true
  }
],
  ledgerState: [
  {
    "name": "votes",
    "type": "Counter"
  }
],
  witnesses: []
} as const;
