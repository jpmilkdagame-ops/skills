import type { CloudRegionSignal } from "./types";

export async function getAllCloudRegions(): Promise<CloudRegionSignal[]> {
  // Replace this deterministic provider with AWS/GCP/Azure/edge telemetry collectors.
  return [
    { id: "aws-us-east-1", cloud: "aws", region: "us-east-1", costIndex: 0.42, latencyMs: 48, availability: 0.997, gpuAvailable: 8, carbonIntensity: 390 },
    { id: "gcp-us-central1", cloud: "gcp", region: "us-central1", costIndex: 0.38, latencyMs: 61, availability: 0.995, gpuAvailable: 4, carbonIntensity: 320 },
    { id: "azure-eastus", cloud: "azure", region: "eastus", costIndex: 0.44, latencyMs: 54, availability: 0.996, gpuAvailable: 6, carbonIntensity: 360 },
    { id: "edge-lab-1", cloud: "edge", region: "lab", costIndex: 0.18, latencyMs: 12, availability: 0.93, gpuAvailable: 1, carbonIntensity: 120 }
  ];
}
