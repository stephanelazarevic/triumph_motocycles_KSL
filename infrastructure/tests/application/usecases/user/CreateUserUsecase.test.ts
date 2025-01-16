import { CreateUserUsecase } from "application/usecases/user/CreateUserUsecase.ts";
import { UserRepositoryInMemory } from "infrastructure/adapters/repositories/UserRepositoryInMemory.ts";

const userRepository = new UserRepositoryInMemory([]);

Deno.test("Should create and persist a user successfully", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "SecurePass123!",
    "+1234567890",
    "123 Main St",
    "12345",
    "US",
    false
  );

  if (result instanceof Error) {
    throw new Error("Test failed: Unexpected error.");
  }

  console.assert(result.firstname === "John", "Firstname should be John.");
  console.assert(result.lastname === "DOE", "Lastname should be DOE.");
});
