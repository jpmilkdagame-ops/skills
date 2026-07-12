import { executor } from "../automation/executor";
import { brainEngine } from "../brain/brainEngine";
import { eventBus } from "../bus/eventBus";
import { dagEngine } from "../dag/dagEngine";
import { memory } from "../memory/memory";
import { router } from "../router/modelRouter";
import { optimizer } from "./optimizer";

export async function runSelfImprovingCycle(): Promise<void> {
  const event = await eventBus.consume();
  if (!event) {
    return;
  }

  const intent = brainEngine.parse(event);
  const dag = dagEngine.build(intent);
  const optimizedDag = optimizer.improve(dag);
  const plan = router.optimize(dagEngine.schedule(optimizedDag));
  const result = await executor.run(plan);

  await memory.store({ event, optimizedDag, plan, result });
  optimizer.learn(event, result);

  if (optimizer.detectsFailurePattern()) {
    const rewrittenDag = dagEngine.rewrite(optimizedDag, "execute");
    router.rebalance(router.optimize(dagEngine.schedule(rewrittenDag)));
  }
}
