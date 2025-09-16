import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

export const TrackComplaintPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(searchParams.get('success') === 'true');

  // Sample complaints data
  const sampleComplaints = [
    {
      id: "CMP123456",
      title: "Pothole at MG Road",
      location: "MG Road, Pune",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      timeText: "Reported 2 hours ago",
      image: "/img-1.png",
      hasImage: true,
      category: "pothole",
      description: "Large pothole causing traffic issues",
      timeline: [
        {
          title: "Reported",
          description: "Complaint received and assigned ID #CMP123456.",
          time: "2 hours ago",
          icon: "/span-2.svg",
        },
        {
          title: "Under Review",
          description: "Department is reviewing your complaint.",
          time: "1 hour ago",
          icon: "/span-1.svg",
        }
      ]
    },
    {
      id: "CMP789012",
      title: "Water Leak, Sector 21",
      location: "Sector 21, Noida",
      status: "Resolved",
      statusColor: "bg-green-100 text-green-700",
      timeText: "Resolved 6 hrs ago",
      image: null,
      hasImage: false,
      category: "water-leak",
      description: "Water pipe burst near main road",
      timeline: [
        {
          title: "Reported",
          description: "Complaint received and assigned ID #CMP789012.",
          time: "2 days ago",
          icon: "/span-2.svg",
        },
        {
          title: "Under Review",
          description: "Department is reviewing your complaint.",
          time: "1 day ago",
          icon: "/span-1.svg",
        },
        {
          title: "Resolved",
          description: "Issue fixed. Thank you for your feedback!",
          time: "6 hours ago",
          icon: "/span.svg",
        },
      ]
    },
    {
      id: "CMP345678",
      title: "Streetlight not working",
      location: "Park Street, Kolkata",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-700",
      timeText: "In progress for 1 day",
      image: null,
      hasImage: false,
      category: "streetlight",
      description: "Street light pole damaged, area is dark at night",
      timeline: [
        {
          title: "Reported",
          description: "Complaint received and assigned ID #CMP345678.",
          time: "3 days ago",
          icon: "/span-2.svg",
        },
        {
          title: "Under Review",
          description: "Department is reviewing your complaint.",
          time: "2 days ago",
          icon: "/span-1.svg",
        },
        {
          title: "In Progress",
          description: "Work has started on fixing the issue.",
          time: "1 day ago",
          icon: "/span-1.svg",
        }
      ]
    },
  ];

  useEffect(() => {
    if (searchId) {
      // Check localStorage first for newly created complaints
      const storedComplaint = localStorage.getItem(`complaint_${searchId}`);
      if (storedComplaint) {
        setSelectedComplaint(JSON.parse(storedComplaint));
      } else {
        // Check sample complaints
        const found = sampleComplaints.find(c => c.id === searchId);
        setSelectedComplaint(found || null);
      }
    }
  }, [searchId]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSearch = () => {
    if (searchId) {
      const storedComplaint = localStorage.getItem(`complaint_${searchId}`);
      if (storedComplaint) {
        setSelectedComplaint(JSON.parse(storedComplaint));
      } else {
        const found = sampleComplaints.find(c => c.id === searchId);
        setSelectedComplaint(found || null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-200 py-12">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Success!</strong> Your complaint has been submitted successfully. 
            {searchId && ` Your complaint ID is: ${searchId}`}
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Track Your Complaints</h1>
          <p className="text-blue-700 text-lg">
            Enter your complaint ID to track the status and progress
          </p>
        </div>

        <div className="flex gap-4 items-center justify-center mb-8">
          <Input
            placeholder="Enter Complaint ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-96 h-[42px] bg-white border-blue-200 [font-family:'Poppins',Helvetica] text-base"
          />
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>

        {selectedComplaint ? (
          <div className="space-y-8">
            {/* Complaint Details */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">
                      {selectedComplaint.title}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/frame-4.svg" alt="Location" className="w-2.5 h-3.5" />
                      <span className="text-blue-600">{selectedComplaint.location}</span>
                    </div>
                    <p className="text-gray-700">{selectedComplaint.description}</p>
                  </div>
                  <Badge className={`${selectedComplaint.statusColor} rounded-full px-4 py-2`}>
                    {selectedComplaint.status}
                  </Badge>
                </div>

                {selectedComplaint.hasImage && selectedComplaint.image && (
                  <div className="mb-6">
                    <img 
                      src={selectedComplaint.image} 
                      alt="Issue" 
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  Complaint Progress Timeline
                </h2>

                <div className="relative border-l-4 border-blue-200 pl-8 ml-6">
                  {selectedComplaint.timeline.map((step: any, index: number) => (
                    <div
                      key={index}
                      className={`relative pb-8 ${index === selectedComplaint.timeline.length - 1 ? "pb-0" : ""}`}
                    >
                      <img
                        src={step.icon}
                        alt="Timeline icon"
                        className="absolute w-6 h-6 -left-[38px] top-0"
                      />

                      <div className="space-y-2">
                        <h3 className="font-semibold text-blue-800 text-base">
                          {step.title}
                        </h3>
                        <p className="text-blue-700 text-sm leading-[14px]">
                          {step.description}
                        </p>
                        <p className="text-blue-400 text-xs">
                          {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section - Only show for resolved complaints */}
            {selectedComplaint.status === 'Resolved' && (
              <Card className="bg-blue-50 shadow-lg">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                      <h3 className="font-semibold text-blue-900 text-lg leading-[18px] mb-4">
                        How satisfied are you with the resolution?
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <Textarea
                        placeholder="Any comments or suggestions?"
                        className="min-h-[66px] bg-white border-blue-200 text-base resize-none"
                      />

                      <div className="flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-auto font-semibold">
                          Submit Feedback
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : searchId ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">
              No complaint found with ID: {searchId}
            </div>
            <p className="text-gray-600">
              Please check your complaint ID and try again.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-blue-900">Recent Complaints</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleComplaints.map((complaint) => (
                <Card key={complaint.id} className="h-72 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => setSelectedComplaint(complaint)}>
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-blue-800 text-base leading-4 flex-1 pr-2">
                        {complaint.title}
                      </h3>
                      <Badge className={`${complaint.statusColor} rounded-full px-3 py-1 text-xs font-normal`}>
                        {complaint.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <img src="/frame-4.svg" alt="Location" className="w-2.5 h-3.5" />
                      <span className="font-normal text-blue-500 text-sm">
                        {complaint.location}
                      </span>
                    </div>

                    <div className="flex-1 mb-4">
                      {complaint.hasImage ? (
                        <div
                          className="w-full h-32 rounded bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${complaint.image})` }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-[#f0f0f0] rounded flex items-center justify-center">
                          <div className="text-center font-normal text-[#999999] text-xs">
                            IMG<br />320×128
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <img src="/frame-6.svg" alt="Time" className="w-3 h-3" />
                      <span className="font-normal text-blue-700 text-xs">
                        {complaint.timeText}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};