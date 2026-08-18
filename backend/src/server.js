import { app } from "./app.js";
import { env } from "./config/env.js";
import { startVipRoleSyncJob } from "./jobs/syncVipRoles.js";

app.listen(env.port, () => {
  console.log(`GSR PMO backend listening on http://localhost:${env.port}`);
});

startVipRoleSyncJob();
