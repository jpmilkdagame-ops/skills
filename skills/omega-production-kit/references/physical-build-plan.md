# Physical Build Plan Guidance

Use this reference when the user asks for Omega hardware, physical deployment, rack layout, wiring, network topology, port-by-port switch planning, shopping categories, room/device placement, power/cooling, or phased construction.

## Output shape

Produce a concrete physical build plan with these sections:

1. Assumptions and safety notes.
2. Build tier: lab, production rack, or hybrid site.
3. Hardware architecture by layer:
   - Omega Core Unit.
   - Neural Cluster Nodes.
   - Environmental Interfaces.
   - Edge and Mobile Layer.
4. Rack layout or room placement.
5. Network segmentation with VLAN/CIDR examples.
6. Port-by-port switch plan.
7. Cabling and labeling plan.
8. Power, UPS, cooling, and thermal monitoring.
9. Installation sequence.
10. Acceptance tests.
11. Phase roadmap.

## Required cautions

- Do not present exact current prices or claim hardware is buyable today unless verified in the current session.
- Recommend licensed electrical review for circuits, UPS/PDU sizing, grounding, and high-draw GPU systems.
- Keep microphones, cameras, sensors, and physical actuators privacy- and safety-sensitive.
- Require manual override and audit logs before autonomous physical-world automation.

## Sizing heuristics

- Lab: workstation/tower or compact 4U core, 2-4 nodes, 2.5/10GbE mix, one UPS, one VLAN-capable switch.
- Production rack: 4U-8U GPU core, NAS/memory node, 4-10 nodes, 10GbE backbone, PoE access switch, dedicated firewall, UPS/PDU.
- Hybrid site: production rack plus multi-room edge nodes, VPN/zero-trust access, cloud burst, backup archive, and site-to-site observability.

## Physical-to-software mapping

- Core Unit maps to `core-gateway`, `brain-engine`, `dag-orchestrator`, event bus, and observability.
- Memory Node maps to PostgreSQL, Qdrant/vector DB, Redis persistence where used, backup archive, and snapshots.
- Reasoning/Vision/Voice/Automation nodes map to the `nodes/*` runtimes and register with `node-registry`.
- Interfaces and mobile clients should reach only gateway/API/WebSocket surfaces, not databases or worker nodes directly.

## Template asset

The scaffold includes `docs/physical-build-plan.md` with a complete example rack, VLAN, switch-port, cabling, power, and acceptance-test plan. Use it as the starting artifact and customize names, rack units, port counts, node quantities, and VLANs to the user's environment.
