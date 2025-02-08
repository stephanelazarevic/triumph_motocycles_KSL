export function handleRequest(controllerMethod: (request: Request) => Promise<Response>) {
  return async (context: any) => {
    try {
      const response = await controllerMethod(context.request);
      context.response.status = response.status;
      context.response.body = await response.text();
    } catch (error) {
      console.error("Error handling request:", error);
      context.response.status = 500;
      context.response.body = { message: "Internal Server Error" };
    }
  };
}
