import os
import time

node_id = os.getenv("NODE_ID", "omega-node")
node_role = os.getenv("NODE_ROLE", "worker")

print(f"starting {node_id} role={node_role}", flush=True)
while True:
    print(f"heartbeat node_id={node_id} role={node_role}", flush=True)
    time.sleep(30)
