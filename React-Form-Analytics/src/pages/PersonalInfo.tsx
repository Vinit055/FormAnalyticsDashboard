import TrackedFormField from "@/components/TrackedFormField";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { InfoProps } from "@/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

const PersonalInfo: React.FC<InfoProps> = ({ control }) => {
  return (
    <TabsContent value="personal" className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackedFormField name="firstName" label="First Name">
          <Input placeholder="John" />
        </TrackedFormField>

        <TrackedFormField name="lastName" label="Last Name">
          <Input placeholder="Doe" />
        </TrackedFormField>

        <TrackedFormField name="email" label="Email">
          <Input placeholder="john.doe@example.com" />
        </TrackedFormField>

        {/* <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <TrackedFormField name="phone" label="Phone Number">
          <Input placeholder="1234567890" />
        </TrackedFormField>

        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal flex justify-between items-center"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-4" />

      <TrackedFormField name="address" label="Address">
        <Input placeholder="123 Main St" />
      </TrackedFormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TrackedFormField name="city" label="City">
          <Input placeholder="New York" />
        </TrackedFormField>

        <TrackedFormField name="country" label="Country">
          <Input placeholder="United States" />
        </TrackedFormField>

        <TrackedFormField name="zipCode" label="ZIP Code">
          <Input placeholder="12345" />
        </TrackedFormField>
      </div>
    </TabsContent>
  );
};

export default PersonalInfo;
