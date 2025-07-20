import z from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1, "Page must be >= 1"),
  limit: z.coerce.number().min(1).max(100).default(10),
})