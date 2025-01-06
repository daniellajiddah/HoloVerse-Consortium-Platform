import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let simulationCount = 0;
const simulations = new Map();

// Simulated contract functions
function createSimulation(name: string, description: string, parameters: string, creator: string) {
  const simulationId = ++simulationCount;
  simulations.set(simulationId, {
    creator,
    name,
    description,
    parameters,
    status: "pending",
    resourceAllocation: 0,
    startTime: 0,
    endTime: 0
  });
  return simulationId;
}

function updateSimulationStatus(simulationId: number, newStatus: string, updater: string) {
  const simulation = simulations.get(simulationId);
  if (!simulation) throw new Error('Invalid simulation');
  if (simulation.creator !== updater && updater !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  if (!['pending', 'running', 'completed', 'failed'].includes(newStatus)) throw new Error('Invalid status');
  simulation.status = newStatus;
  if (newStatus === 'running') {
    simulation.startTime = Date.now();
  } else if (newStatus === 'completed' || newStatus === 'failed') {
    simulation.endTime = Date.now();
  }
  simulations.set(simulationId, simulation);
  return true;
}

function allocateResources(simulationId: number, resources: number, allocator: string) {
  const simulation = simulations.get(simulationId);
  if (!simulation) throw new Error('Invalid simulation');
  if (allocator !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  simulation.resourceAllocation = resources;
  simulations.set(simulationId, simulation);
  return true;
}

describe('Simulation Management Contract', () => {
  beforeEach(() => {
    simulationCount = 0;
    simulations.clear();
  });
  
  it('should create a new simulation', () => {
    const id = createSimulation('Holographic Universe Model A', 'Initial test of holographic principle', '{"dimensions": 11, "coupling_constant": 0.1}', 'scientist1');
    expect(id).toBe(1);
    const simulation = simulations.get(id);
    expect(simulation.name).toBe('Holographic Universe Model A');
    expect(simulation.status).toBe('pending');
  });
  
  it('should update simulation status', () => {
    const id = createSimulation('Holographic Universe Model B', 'Advanced test with quantum fluctuations', '{"dimensions": 26, "coupling_constant": 0.01}', 'scientist2');
    expect(updateSimulationStatus(id, 'running', 'scientist2')).toBe(true);
    const simulation = simulations.get(id);
    expect(simulation.status).toBe('running');
    expect(simulation.startTime).not.toBe(0);
  });
  
  it('should allocate resources to a simulation', () => {
    const id = createSimulation('Holographic Universe Model C', 'Large-scale simulation with multiple branes', '{"dimensions": 10, "brane_count": 2}', 'scientist3');
    expect(allocateResources(id, 1000, 'CONTRACT_OWNER')).toBe(true);
    const simulation = simulations.get(id);
    expect(simulation.resourceAllocation).toBe(1000);
  });
  
  it('should not allow unauthorized status updates', () => {
    const id = createSimulation('Holographic Universe Model D', 'Simulation of holographic dark matter', '{"dark_matter_density": 0.23}', 'scientist4');
    expect(() => updateSimulationStatus(id, 'running', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow invalid status updates', () => {
    const id = createSimulation('Holographic Universe Model E', 'Test of holographic entropy bounds', '{"entropy_bound": "bekenstein"}', 'scientist5');
    expect(() => updateSimulationStatus(id, 'invalid_status', 'scientist5')).toThrow('Invalid status');
  });
});

