# Omega AI Physical Build Plan

This plan turns Omega from a software-only platform into a deployable physical AI mesh with a core rack, specialized neural nodes, room interfaces, edge devices, and a segmented network.

## Safety and procurement notes

- Have a licensed electrician validate dedicated circuits, UPS sizing, grounding, and rack power distribution before energizing high-draw GPU systems.
- Verify current hardware availability, pricing, firmware support, and Linux driver compatibility before purchase.
- Treat any camera, microphone, biometric, or home/office automation integration as privacy-sensitive; document consent, retention, and physical disable controls.
- Do not enable autonomous physical-world actions until audit logs, manual override, fail-safe defaults, and rollback procedures are tested.

## Build targets

| Build tier | Best for | Core unit | Nodes | Network | Power envelope |
| --- | --- | --- | --- | --- | --- |
| Lab | desk/studio MVP | workstation tower or short-depth 4U server | 2-4 mini PCs/edge boards | 2.5/10GbE mixed | 1.5-3 kW peak |
| Production rack | serious local AI platform | 4U-8U GPU server + NAS | 4-10 specialized nodes | 10GbE backbone | 3-7 kW peak |
| Hybrid site | multi-room + cloud extension | rack core + managed cloud burst | 10+ nodes across rooms | 10/25GbE core + Wi-Fi 6E/7 | site-specific |

## Physical layers

### 1. Omega Core Unit

Purpose: primary brain, local inference host, orchestration/control plane, gateway, event bus, and observability entry point.

Recommended physical spec:

- Form factor: 4U GPU server, 8U split server/storage layout, or high-airflow tower for lab builds.
- CPU: workstation/server CPU with high PCIe lane count.
- GPU: 1-4 inference GPUs sized for local models and vision workloads.
- RAM: 128-512 GB ECC where platform supports it.
- Storage:
  - OS: mirrored SSDs.
  - Hot data: NVMe RAID or mirrored high-endurance NVMe.
  - Backups/archive: NAS or ZFS storage node.
- Network: dual 10GbE minimum; 25/40GbE optional for large clusters and NAS traffic.
- Power: redundant PSU where supported, UPS-backed PDU, and graceful shutdown signal.
- Cooling: front-to-back airflow, blanking panels, thermal sensors, and alerting.

### 2. Neural Cluster Nodes

| Node type | Physical placement | Hardware class | Minimum links | Notes |
| --- | --- | --- | --- | --- |
| Reasoning node | rack shelf or office closet | CPU-focused mini server | 1x 2.5/10GbE | Runs planning, routing, lightweight local models. |
| Vision node | near camera aggregation point | GPU mini workstation or accelerator box | 1x 10GbE preferred | Keep video processing local; avoid raw camera streams over Wi-Fi. |
| Voice node | room ceiling/wall/desk | low-power mini PC or embedded board + mic array | PoE/1GbE or Wi-Fi fallback | Use hardware mute and local wake-word processing where possible. |
| Automation node | wiring closet or rack | low-latency mini PC | 1x 1/2.5GbE | Connects to n8n/webhooks/IoT bridges; isolate physical actuators. |
| Memory node | rack near core | NAS/storage server | 2x 10GbE or better | Hosts backups, object archive, snapshots, and optional vector DB replicas. |
| Edge node | each room/device zone | embedded board | PoE preferred | Handles sensors and simple local policies during core outage. |

### 3. Environmental Interfaces

- Wall dashboard: PoE touchscreen or tablet kiosk on an isolated interface VLAN.
- Voice station: far-field microphone array with hardware mute and visual recording indicator.
- Sensor bundle: motion, temperature, light, door/presence; prefer local hub or MQTT bridge.
- Display output: HDMI-over-IP or local mini PC for command center screens.
- Physical controls: emergency stop, automation disable switch, and manual overrides for locks/lights/HVAC.

### 4. Edge and Mobile Layer

- Mobile app traffic should enter through HTTPS/WSS gateway only, never directly to worker nodes.
- Watches and AR devices should receive notification summaries, not raw sensitive event streams.
- Remote access should use VPN or zero-trust access broker with MFA.

## Rack layout

Example 18U production rack, top-to-bottom:

| Rack U | Device | Reason |
| --- | --- | --- |
| U18 | Patch panel | Keeps room drops and node cables strain-relieved. |
| U17 | 10/25GbE switch | Short patch runs to core and nodes. |
| U16 | 1GbE PoE switch | Powers voice stations, panels, cameras, sensors. |
| U15 | Cable manager | Separates copper, fiber/DAC, and power. |
| U13-U14 | NAS / memory node | Storage close to core and switch. |
| U9-U12 | Omega Core GPU server | Heaviest compute with clear front-to-back airflow. |
| U7-U8 | Neural mini-node shelf | Reasoning/automation nodes. |
| U6 | KVM/maintenance shelf | Crash cart, small monitor, keyboard. |
| U4-U5 | UPS | Low center of gravity. |
| U1-U3 | Expansion / second UPS | Keep heavy power equipment at bottom. |

## Network segmentation

Use VLANs or equivalent firewall zones. Keep default-deny routing between zones and explicitly allow only required ports.

| VLAN | Name | CIDR example | Devices | Allowed north/south traffic |
| --- | --- | --- | --- | --- |
| 10 | management | 10.10.10.0/24 | switch, iDRAC/IPMI, hypervisors | admin VPN only |
| 20 | core-services | 10.10.20.0/24 | core, Kafka, Redis, DBs | API gateway, node event traffic |
| 30 | neural-nodes | 10.10.30.0/24 | reasoning, vision, automation nodes | Kafka/gRPC to core services |
| 40 | interfaces | 10.10.40.0/24 | dashboards, wall panels | HTTPS/WSS to gateway |
| 50 | iot-sensors | 10.10.50.0/24 | sensors, cameras, voice stations | MQTT/RTSP to brokers/processors only |
| 60 | guest/mobile | 10.10.60.0/24 | phones, guest devices | internet + gateway only |
| 70 | storage | 10.10.70.0/24 | NAS, backup targets | core/memory node only |

## Port-by-port switch plan

| Switch port | VLAN/profile | Device | Link | Label |
| --- | --- | --- | --- | --- |
| 1 | trunk 10/20/30/70 | Omega Core NIC 1 | 10/25GbE | CORE-A |
| 2 | storage VLAN 70 | Omega Core NIC 2 | 10/25GbE | CORE-STOR |
| 3 | storage VLAN 70 | NAS / Memory Node A | 10/25GbE | MEM-A |
| 4 | storage VLAN 70 | NAS / Memory Node B optional | 10/25GbE | MEM-B |
| 5 | neural VLAN 30 | Reasoning Node 1 | 2.5/10GbE | REASON-1 |
| 6 | neural VLAN 30 | Reasoning Node 2 | 2.5/10GbE | REASON-2 |
| 7 | neural VLAN 30 | Automation Node 1 | 1/2.5GbE | AUTO-1 |
| 8 | neural VLAN 30 | Vision Node 1 | 10GbE | VISION-1 |
| 9 | interface VLAN 40 | Dashboard / wall display | 1GbE/PoE | PANEL-1 |
| 10 | interface VLAN 40 | Dashboard / command display | 1GbE/PoE | PANEL-2 |
| 11-16 | iot VLAN 50 | voice/camera/sensor drops | 1GbE/PoE | ROOM-* |
| 17 | management VLAN 10 | Out-of-band management | 1GbE | MGMT-SW |
| 18 | trunk | Wi-Fi AP 1 | 2.5GbE/PoE+ | AP-1 |
| 19 | trunk | Wi-Fi AP 2 | 2.5GbE/PoE+ | AP-2 |
| 20 | WAN/firewall uplink | Router/firewall LAN | 10GbE | FW-LAN |
| 21-24 | spare/trunk | expansion | 10GbE | SPARE |

## Cabling and labeling

- Use Cat6A for 10GbE copper runs; use DAC or fiber for rack-adjacent 25/40GbE links.
- Label both ends with rack unit, switch port, device, and VLAN/profile.
- Separate power and data paths where practical.
- Keep camera and microphone drops on isolated PoE ports with per-port disable capability.
- Maintain a cable schedule and update it whenever a node moves.

## Power and thermal plan

- Estimate peak draw for every device, then size UPS and circuits for continuous load with headroom.
- Put core, switches, firewall, and storage on UPS-backed outlets.
- Configure graceful shutdown from UPS signal for core and memory nodes.
- Put non-critical displays and lab nodes on separate non-critical outlets if runtime matters.
- Place temperature probes at rack intake, rack exhaust, and room ambient.
- Alert on sustained high intake temperature, UPS on-battery state, and fan/PSU failures.

## Installation sequence

1. Prepare room: rack location, airflow path, dedicated circuits, UPS, grounding, and network demarcation.
2. Install rack hardware: UPS, PDU, switches, patch panel, cable managers, NAS, core, node shelf.
3. Cable management network first: firewall uplink, core links, storage links, node links, PoE drops.
4. Configure VLANs, firewall rules, DHCP reservations, DNS names, NTP, and management access.
5. Burn in hardware: memory test, GPU stress, storage SMART checks, network throughput, UPS failover.
6. Deploy base software: OS, drivers, Docker/Kubernetes, event bus, core gateway, observability.
7. Register nodes: issue node identity, declare capabilities, validate heartbeat and failover.
8. Add interfaces: dashboards, voice stations, sensors, and mobile access through gateway only.
9. Run acceptance tests: command flow, event replay, memory retrieval, automation dry run, emergency stop.
10. Document final state: port map, IP map, rack elevation, serials, warranty info, backups, rollback plan.

## Acceptance tests

| Test | Pass condition |
| --- | --- |
| Power failover | Core, switch, firewall, and memory node remain online long enough for graceful shutdown or configured runtime. |
| Network isolation | IoT/interface VLANs cannot reach databases, management ports, or node internals directly. |
| Event flow | Voice or dashboard command produces `task.request`, DAG creation, node execution, memory write, and UI status event. |
| Node loss | Stopping one reasoning node triggers heartbeat failure and routing away from that node. |
| Backup restore | A sample memory snapshot restores into a clean environment. |
| Manual override | Physical-world automation can be disabled without software cooperation. |
| Observability | A single trace ID links gateway, brain, DAG, node, memory, and automation logs. |

## Phase plan

### Phase 1 — Base build

- One core server or workstation.
- One managed switch with VLANs.
- Two to four nodes: reasoning, automation, voice, optional memory/NAS.
- One dashboard panel.
- Local Docker Compose or single-node Kubernetes.

### Phase 2 — Production rack

- Rack-mounted core, storage, UPS, firewall, 10GbE backbone, PoE switch.
- Dedicated memory node/NAS and observability stack.
- Vision and voice nodes in target rooms.
- Formal node certificates, backup jobs, monitoring alerts, and runbooks.

### Phase 3 — Hybrid ecosystem

- Multi-site VPN/zero-trust overlay.
- Cloud burst for heavy models/training.
- Centralized backup/object archive.
- Policy-gated self-improvement with human approval, replay, and rollback.
