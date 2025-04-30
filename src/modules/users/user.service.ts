import { MessagingService, Publisher, Consumer } from "rabbitmq-stream";
import { UserCreatedEvent } from "./user.event";

@MessagingService()
export class UserService {
  constructor() {}

  @Publisher("userPublisher")
  async createUser(data: UserCreatedEvent) {
    return {
      data,
      publishOptions: {
        delayMs: 5000,
        headers: {
          "x-trace-id": "abc123",
        },
      },
    };
  }

  @Consumer("userCreatedInput")
  async useCreatedInput(event: UserCreatedEvent) {
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

export default new UserService();
