import { z } from "zod";

export const initialStockFormSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        qty: z.number().int().min(0, "Qty cannot be negative"),
      }),
    )
    .min(1, "At least one product is required"),
});

export type InitialStockFormValues = z.infer<typeof initialStockFormSchema>;
