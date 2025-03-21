import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InfoProps } from "@/types";
import TrackedFormField from "@/components/TrackedFormField";

const PaymentInfo: React.FC<InfoProps> = () => {
  return (
    <TabsContent value="payment" className="space-y-4 mt-4">
      <div className="bg-slate-100 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-slate-600" />
          <h3 className="font-medium">Secure Payment Information</h3>
        </div>
        <p className="text-sm text-slate-500">
          Your payment details are encrypted and secure. We comply with PCI DSS
          standards.
        </p>
      </div>

      <TrackedFormField name="cardName" label="Cardholder Name">
        <Input placeholder="John Doe" />
      </TrackedFormField>

      <TrackedFormField name="cardNumber" label="Card Number">
        <Input placeholder="1234567890123456" />
      </TrackedFormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackedFormField name="expiryDate" label="Expiry Date">
          <Input placeholder="MM/YY" />
        </TrackedFormField>

        <TrackedFormField name="cvv" label="CVV">
          <Input type="password" placeholder="123" />
        </TrackedFormField>
      </div>
    </TabsContent>
  );
};

export default PaymentInfo;
