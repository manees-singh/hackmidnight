import { type Logger } from 'pino';
export * from './api.js';
/**
 * Contract information interface
 */
export interface ContractInfo {
    contractName: string;
    functions: Array<{
        name: string;
        parameters: Array<{
            name: string;
            type: string;
        }>;
        returnType: string;
        readOnly: boolean;
        description: string;
    }>;
    ledgerState: Array<{
        name: string;
        type: string;
    }>;
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
export declare class EnhancedContractAPI {
    private analyzer;
    private cliGenerator;
    private contractInfo;
    constructor(logger: Logger);
    initialize(): Promise<ContractInfo>;
    getContractInfo(): ContractInfo | null;
    generateMenuItems(): any[];
    generateMenuQuestion(menuItems: any[]): string;
    /**
     * Execute vote function
     */
    vote(...args: any[]): Promise<any>;
    /**
     * Execute get_votes function
     */
    get_votes(...args: any[]): Promise<any>;
}
export declare const CONTRACT_METADATA: {
    readonly name: "Voting Contract";
    readonly fileName: "voting.compact";
    readonly generatedAt: "2025-09-28T03:27:47.365Z";
    readonly functions: readonly [{
        readonly name: "vote";
        readonly parameters: readonly [];
        readonly returnType: "[]";
        readonly readOnly: false;
    }, {
        readonly name: "get_votes";
        readonly parameters: readonly [];
        readonly returnType: "Uint<64>";
        readonly readOnly: true;
    }];
    readonly ledgerState: readonly [{
        readonly name: "votes";
        readonly type: "Counter";
    }];
    readonly witnesses: readonly [];
};
