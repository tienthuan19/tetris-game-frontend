"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"               

import { cn } from "@/lib/utils"

// DINH NGHIA CAC KIEU STYLE CHO LABEL
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
) // kich thuoc chu, do day, chieu cao dong, con tro va do trong suot khi vo hieu hoa

// COMPONENT LABEL CUSTOMIZE TU RADIX UI
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)} // ket hop style mac dinh va style tuy chinh
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName // ten hien thi cho debugging

export { Label }
