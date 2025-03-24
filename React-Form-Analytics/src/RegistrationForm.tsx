import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { formSchema, FormValues } from "./schemas/FormSchema";
import PersonalInfo from "./pages/PersonalInfo";
import ProfessionalInfo from "./pages/ProfessionalInfo";
import PaymentInfo from "./pages/PaymentInfo";
import ExperienceInfo from "./pages/ExperienceInfo";
import { useAnalytics } from "./hooks/useAnalytics";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";

const DRAFT_STORAGE_KEY = "registration_form_draft";

// Internal component that uses analytics
const RegistrationFormInternal = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const { trackTabChange, trackFormSubmit } = useAnalytics();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      occupation: "",
      companyName: "",
      yearsOfExperience: 0,
      skills: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      lifeGoals: "",
      problemSolvingApproach: "",
      ethicalDilemma: "",
      satisfactionLevel: 5,
      receiveUpdates: false,
    },
    mode: "onChange", // Changed to onChange to track validation errors as they occur
  });

  // Load draft data from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft) as FormValues;
        // Convert string date to Date object if it exists
        if (parsedData.dateOfBirth) {
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        }
        form.reset(parsedData);
      } catch (error) {
        console.error("Failed to parse saved draft:", error);
      }
    }
  }, [form]);

  // Track tab changes
  useEffect(() => {
    trackTabChange(activeTab);

    // We should add this effect as a cleanup function to prevent memory leaks
    return () => {
      // If needed, we could add cleanup code here
    };
  }, [activeTab]);

  function onSubmit(data: FormValues) {
    console.log(data);
    trackFormSubmit();

    // Clear draft from localStorage after successful submission
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    form.reset(form.formState.defaultValues);
    setActiveTab("personal");


    // Show success message
    toast.success("Form submitted successfully!");
  }

  // Save draft to localStorage
  function saveDraft() {
    const currentValues = form.getValues();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(currentValues));
    toast.success("Draft saved! Your form data has been saved locally.");
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 p-4 gap-6">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please fill out all the information to create your account
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs
              defaultValue="personal"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>
              <PersonalInfo control={form.control} />
              <ProfessionalInfo control={form.control} />
              <PaymentInfo control={form.control} />
              <ExperienceInfo control={form.control} />
            </Tabs>

            <CardFooter className="flex justify-end pt-6">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={saveDraft}>
                  Save Draft
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

// Wrapper component that provides analytics context
const UserRegistrationForm = () => {
  return (
    <AnalyticsProvider>
      <RegistrationFormInternal />
    </AnalyticsProvider>
  );
};

export default UserRegistrationForm;
