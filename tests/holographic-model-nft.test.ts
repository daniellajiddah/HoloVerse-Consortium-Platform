import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastTokenId = 0;
const tokenMetadata = new Map();
const tokenOwners = new Map();

// Simulated contract functions
function mintHolographicModel(name: string, description: string, modelHash: string, simulationId: number, significanceScore: number, creator: string) {
  const tokenId = ++lastTokenId;
  if (significanceScore < 0 || significanceScore > 100) {
    throw new Error('Invalid significance score');
  }
  tokenMetadata.set(tokenId, {
    creator,
    name,
    description,
    modelHash,
    simulationId,
    creationTime: Date.now(),
    significanceScore
  });
  tokenOwners.set(tokenId, creator);
  return tokenId;
}

function transferHolographicModel(tokenId: number, sender: string, recipient: string) {
  if (tokenOwners.get(tokenId) !== sender) {
    throw new Error('Not authorized');
  }
  tokenOwners.set(tokenId, recipient);
  return true;
}

describe('Holographic Model NFT Contract', () => {
  beforeEach(() => {
    lastTokenId = 0;
    tokenMetadata.clear();
    tokenOwners.clear();
  });
  
  it('should mint a new holographic model NFT', () => {
    const id = mintHolographicModel(
        'Brane World Model',
        'A holographic model representing a universe with extra dimensions',
        '0x1234567890abcdef',
        1,
        85,
        'scientist1'
    );
    expect(id).toBe(1);
    const metadata = tokenMetadata.get(id);
    expect(metadata.name).toBe('Brane World Model');
    expect(metadata.modelHash).toBe('0x1234567890abcdef');
    expect(metadata.significanceScore).toBe(85);
    expect(tokenOwners.get(id)).toBe('scientist1');
  });
  
  it('should transfer holographic model NFT ownership', () => {
    const id = mintHolographicModel(
        'Holographic Dark Energy Model',
        'A model explaining dark energy through holographic principles',
        '0xabcdef1234567890',
        2,
        92,
        'scientist2'
    );
    expect(transferHolographicModel(id, 'scientist2', 'researcher1')).toBe(true);
    expect(tokenOwners.get(id)).toBe('researcher1');
  });
  
  it('should not allow minting with invalid significance score', () => {
    expect(() => mintHolographicModel(
        'Invalid Model',
        'This should fail',
        '0x0000000000000000',
        3,
        101,
        'scientist3'
    )).toThrow('Invalid significance score');
  });
  
  it('should not allow unauthorized transfers', () => {
    const id = mintHolographicModel(
        'Quantum Gravity Hologram',
        'A holographic representation of quantum gravity effects',
        '0xfedcba9876543210',
        4,
        88,
        'scientist4'
    );
    expect(() => transferHolographicModel(id, 'unauthorized_user', 'researcher2')).toThrow('Not authorized');
  });
});
