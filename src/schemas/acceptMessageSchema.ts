import { z } from "zod";

export const AcceptMessagehema = z.object({
  acceptMessages: z.boolean(),
});
