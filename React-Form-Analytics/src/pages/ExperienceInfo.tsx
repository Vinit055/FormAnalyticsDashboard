import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { InfoProps } from "@/types";
import { TrackedFormField } from "react-form-analytics";

const ExperienceInfo: React.FC<InfoProps> = ({ control }) => {
  return (
    <TabsContent value="experience" className="space-y-4 mt-4">
      <TrackedFormField name="lifeGoals" label="What are your main life goals?">
        <Textarea
          placeholder="Describe what you hope to achieve in your personal and professional life"
          className="min-h-20"
        />
      </TrackedFormField>

      <TrackedFormField
        name="problemSolvingApproach"
        label="How do you approach complex problems?"
      >
        <Textarea
          placeholder="Describe your step-by-step process for tackling challenging situations"
          className="min-h-32"
        />
      </TrackedFormField>

      <TrackedFormField
        name="ethicalDilemma"
        label="Describe an ethical dilemma you've faced and how you resolved it"
        description=" This helps us understand your decision-making process and value
              system"
      >
        <Textarea
          placeholder="Explain the situation, the conflicting values, and how you made your decision"
          className="min-h-40"
        />
      </TrackedFormField>

      <FormField
        control={control}
        name="satisfactionLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Overall life satisfaction (1-10)</FormLabel>
            <FormControl>
              <div className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Not satisfied</span>
              <span>Very satisfied</span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="receiveUpdates"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Receive Updates</FormLabel>
              <FormDescription>
                Get notified about new features and opportunities
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </TabsContent>
  );
};

export default ExperienceInfo;
