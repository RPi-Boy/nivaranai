import { MapPinIcon, MicIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

export const ReportIssuePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    location: 'Auto-detecting...',
    category: 'pothole',
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate complaint ID
    const complaintId = `CMP${Date.now().toString().slice(-6)}`;
    
    // Store complaint data (in real app, this would be sent to backend)
    const complaint = {
      id: complaintId,
      ...formData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Reported',
          description: `Complaint received and assigned ID #${complaintId}.`,
          time: 'Just now',
          icon: '/span-2.svg'
        }
      ]
    };

    localStorage.setItem(`complaint_${complaintId}`, JSON.stringify(complaint));
    
    setIsSubmitting(false);
    
    // Redirect to track complaint page with success message
    navigate(`/track-complaint?id=${complaintId}&success=true`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Report a Civic Issue</h1>
          <p className="text-blue-700 text-lg">
            Help make your city better by reporting issues in your area
          </p>
        </div>

        <Card className="rounded-2xl border border-blue-100 shadow-lg bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Upload Image/Video
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                    className="opacity-0 absolute inset-0 w-full h-12 cursor-pointer z-10"
                  />
                  <div className="w-full h-12 bg-white border border-blue-200 rounded flex items-center">
                    <div className="w-[124px] h-full bg-[#f8f8f9] rounded-sm border border-gray-300 flex flex-col justify-center px-3">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-black text-xs">
                        choose file
                      </div>
                      <div className="[font-family:'Poppins',Helvetica] font-normal text-gray-600 text-xs">
                        {formData.file ? formData.file.name : 'No file chosen'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                  Describe the Issue *
                </Label>
                <div className="relative">
                  <Textarea
                    placeholder="Type here or use voice..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[90px] bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-base resize-none pr-12"
                    required
                  />
                  <Button
                    type="button"
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
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-base pr-12"
                  />
                  <Button
                    type="button"
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
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-white border-blue-200 [font-family:'Poppins',Helvetica] font-normal text-black text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="water-leak">Water Leak</SelectItem>
                    <SelectItem value="streetlight">Streetlight Issue</SelectItem>
                    <SelectItem value="garbage">Garbage Collection</SelectItem>
                    <SelectItem value="traffic">Traffic Signal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.description}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white [font-family:'Poppins',Helvetica] font-semibold text-base disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};