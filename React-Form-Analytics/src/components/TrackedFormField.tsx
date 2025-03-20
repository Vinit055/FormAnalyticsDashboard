import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "@/schemas/FormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { TrackedFormFieldProps } from "../types";
import { useAnalytics } from "@/hooks/useAnalytics";

const TrackedFormField: React.FC<TrackedFormFieldProps> = ({
  name,
  label,
  description,
  children,
}) => {
  const { trackValidationError } = useAnalytics();
  const form = useFormContext<FormValues>();

  // Track validation errors for this field
  useEffect(() => {
    if (form.formState.errors[name]) {
      trackValidationError(
        name,
        form.formState.errors[name]?.message as string
      );
    }
  }, [form.formState.errors[name], name, trackValidationError]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children, {
              ...field,
              // We no longer need custom focus/blur handlers
            })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TrackedFormField;