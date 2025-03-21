import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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

const ERROR_PERSISTENCE_THRESHOLD = 60000; // 1 minute
const TrackedFormField: React.FC<TrackedFormFieldProps> = ({
  name,
  label,
  description,
  children,
}) => {
  const { trackValidationError } = useAnalytics();
  const form = useFormContext<FormValues>();
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Watch the field's value to detect changes
  useWatch({
    control: form.control,
    name: name,
  });

  // Track validation errors for this field with time persistence check
  useEffect(() => {
    const fieldError = form.formState.errors[name];

    // Clear any existing timer when the error state changes
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    // If there's an error, start a timer
    if (fieldError) {
      errorTimerRef.current = setTimeout(() => {
        // After threshold time, if the error still exists, track it
        if (form.formState.errors[name]) {
          trackValidationError(
            name,
            form.formState.errors[name]?.message as string
          );
        }
      }, ERROR_PERSISTENCE_THRESHOLD);
    }

    // Cleanup on unmount or when error state changes
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [form.formState.errors[name], name, trackValidationError, form.formState]);

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
