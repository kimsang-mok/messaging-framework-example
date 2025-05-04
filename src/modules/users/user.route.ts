import express from "express";
import { UserController } from "./user.controller";
import container from "@src/configs/inversify.config";

const router = express.Router();

const userController = container.get(UserController);

router.route("/").post(userController.createUser);
router.route("/delay").post(userController.createUserWith5sDelay);
router.route("/dynamic-delay").post(userController.createUserWithDynamicDelay);

export default router;
