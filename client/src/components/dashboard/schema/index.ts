import { z } from "zod/v4";


export type PartnerLoginSchemaType = z.infer<typeof PartnerLoginSchema>;
export type PartnerRegisterSchemaType = z.infer<typeof PartnerRegisterSchema>;

export const PartnerLoginSchema = z.object({
    email: z.email().nonempty().max(254),
    password: z.string().min(8).max(128),
});

export const PartnerRegisterSchema = z.object({
    storeName: z.string().nonempty().max(100),
    email: z.email().nonempty().max(254),
    password: z.string().min(8).max(128),
})