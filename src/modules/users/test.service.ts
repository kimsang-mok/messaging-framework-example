import { injectable } from "inversify";

@injectable()
export class TestService {
  sayHello() {
    console.log("Hello!");
  }
}
