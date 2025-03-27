import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InfoProps } from "@/types";
import { TrackedFormField } from "react-form-analytics";

const ProfessionalInfo: React.FC<InfoProps> = ({ control }) => {
  return (
    <TabsContent value="professional" className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackedFormField name="occupation" label="Occupation">
          <Input placeholder="Software Engineer" />
        </TrackedFormField>

        <TrackedFormField name="companyName" label="Company Name (Optional)">
          <Input placeholder="Tech Company Inc." />
        </TrackedFormField>

        <FormField
          control={control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="educationLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <TrackedFormField
        name="skills"
        label="Skills & Expertise"
        description="Include both technical and soft skills relevant to your profession"
      >
        <Textarea
          placeholder="List your key skills separated by commas (e.g., React, TypeScript, Project Management)"
          className="min-h-32"
        />
      </TrackedFormField>
    </TabsContent>
  );
};

export default ProfessionalInfo;
