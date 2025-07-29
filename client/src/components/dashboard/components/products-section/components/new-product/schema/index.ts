import { z } from 'zod'

export const productOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required'),
  type: z.enum(['text', 'image']),
  value: z.union([z.string(), z.any()]),
})

export const productSpecificationSchema = z.object({
  spec_name: z.string().min(1, 'Specification name is required'),
  spec_value: z.string().min(1, 'Specification value is required'),
})

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  currency: z.enum(['EGP', 'USD']),
  category_id: z.coerce.string().min(1),
  stock: z.number().min(0),
  product_overview: z.string().optional(),
  productOptions: z.array(productOptionSchema).optional(),
  productSpecifications: z.array(productSpecificationSchema).optional(),
})
export type ProductFormSchema = z.infer<typeof productSchema>
