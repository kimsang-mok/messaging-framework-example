import { MessagingService, Publisher, Consumer } from "rabbitmq-stream";
import { UserCreatedEvent } from "./user.event";
import { inject, injectable } from "inversify";
import { TestService } from "./test.service";
import { TYPES } from "@src/types";

@MessagingService()
@injectable()
export class UserService {
  constructor(@inject(TYPES.TestService) private testService: TestService) {}

  @Publisher("userPublisher")
  async createUser(data: UserCreatedEvent) {
    this.testService.sayHello();

    return {
      data,
      messageOptions: {
        delayMs: 5000,
        headers: {
          "x-trace-id": "abc123",
        },
      },
    };
  }

  @Consumer("userCreatedInput")
  async useCreatedInput(event: UserCreatedEvent, rawEvent: any) {
    console.log("Raw Events: ", rawEvent);
    if (event.id === "1") {
      throw new Error(`Cannot process event: ${event}`);
    }

    console.log("Consume user created event: ", event);
  }

  async createUserWith5sDelay(data: UserCreatedEvent) {
    return;
  }

  async createUserWithDynamicDelay(data: UserCreatedEvent, delayMs: number) {
    return;
  }
}
