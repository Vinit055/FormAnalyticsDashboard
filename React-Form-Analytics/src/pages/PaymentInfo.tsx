import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CreditCard } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoProps } from "@/types";

const PaymentInfo: React.FC<InfoProps> = ({ control }) => {
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

      <FormField
        control={control}
        name="cardName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cardholder Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input placeholder="1234567890123456" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input type="password" placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
};

export default PaymentInfo;
