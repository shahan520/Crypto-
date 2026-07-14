import { Router, type IRouter } from "express";
import healthRouter     from "./health.js";
import authRouter       from "./auth.js";
import userRouter       from "./user.js";
import ordersRouter     from "./orders.js";
import depositsRouter   from "./deposits.js";
import withdrawalsRouter from "./withdrawals.js";
import walletsRouter    from "./wallets.js";
import teamsRouter      from "./teams.js";
import adminRouter      from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",        authRouter);
router.use("/user",        userRouter);
router.use("/orders",      ordersRouter);
router.use("/deposits",    depositsRouter);
router.use("/withdrawals", withdrawalsRouter);
router.use("/wallets",     walletsRouter);
router.use("/teams",       teamsRouter);
router.use("/admin",       adminRouter);

export default router;
