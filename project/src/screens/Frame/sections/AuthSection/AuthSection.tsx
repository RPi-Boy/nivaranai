import { MapPinIcon, MicIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

export const AuthSection = (): JSX.Element => {
  return (
    <div className="w-full bg-[linear-gradient(180deg,rgba(155,199,255,1)_52%,rgba(255,255,255,1)_100%)] py-[72px] px-4">
      <div className="max-w-[574px] mx-auto">
        <Card className="rounded-2xl border border-blue-100 shadow-[0px_25px_50px_#00000040] bg-[linear-gradient(90deg,rgba(224,242,254,1)_0%,rgba(255,255,255,1)_50%,rgba(240,253,244,1)_100%)]">
          <CardContent className="p-10">
            <h1 className="[font-family:'Poppins',Helvetica] font-bold text-blue-600 text-2xl tracking-[0] leading-6 mb-8">
              Raise a Civic Issue
            </h1>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Upload Image/Video
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    className="opacity-0 absolute inset-0 w-full h-12 cursor-pointer z-10"
                  />
                  <div className="w-full h-12 bg-white border border-blue-200 rounded flex items-center">
                    <div className="w-[124px] h-full bg-[#f8f8f9] rounded-sm border border-black flex flex-col justify-center px-3">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-black text-xs">
                        choose file
                      </div>
                      <div className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs">
                        No file chosen
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Describe the Issue
                </Label>
                <div className="relative">
                  <Textarea
                    placeholder="Type here or use voice..."
                    className="min-h-[90px] bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-base resize-none pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                  >
                    <MicIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Location
                </Label>
                <div className="relative">
                  <Input
                    defaultValue="Auto-detecting..."
                    className="bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-[#adaebc] text-base pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <MapPinIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full h-40 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-blue-400">
                    <MapPinIcon className="h-6 w-6" />
                    <span className="[font-family:'Poppins',Helvetica] font-normal text-sm">
                      Map Preview / Pin (for manual location)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Category
                </Label>
                <Select defaultValue="pothole">
                  <SelectTrigger className="bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-black text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pothole">Pothole</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white [font-family:'Poppins',Helvetica] font-semibold text-base">
                Submit Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
