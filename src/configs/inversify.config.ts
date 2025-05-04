import { UserService } from "@src/modules/users/user.service";
import { Container } from "inversify";

import { TYPES } from "@src/types";
import { TestService } from "@src/modules/users/test.service";
import { UserController } from "@src/modules/users/user.controller";

const container = new Container({
  defaultScope: "Singleton",
});

container.bind<TestService>(TYPES.TestService).to(TestService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(UserController).toSelf();

export default container;
