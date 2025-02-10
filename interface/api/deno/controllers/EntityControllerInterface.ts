import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";

export interface EntityControllerInterface {
  getAll(context: Context): Promise<Response>;
  getById(context: Context): Promise<Response>;
  create(context: Context): Promise<Response>;
  update(context: Context): Promise<Response>;
  delete(context: Context): Promise<Response>;
}
