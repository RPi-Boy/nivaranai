import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

export const ComplaintTrackingSection = (): JSX.Element => {
  const complaintCards = [
    {
      title: "Pothole at MG Road",
      location: "MG Road, Pune",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      timeText: "Reported 2 hours ago",
      image: "/img-1.png",
      hasImage: true,
    },
    {
      title: "Water Leak, Sector 21",
      location: "Sector 21, Noida",
      status: "Resolved",
      statusColor: "bg-green-100 text-green-700",
      timeText: "Resolved 6 hrs ago",
      image: null,
      hasImage: false,
    },
    {
      title: "Streetlight not working",
      location: "Park Street, Kolkata",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-700",
      timeText: "In progress for 1 day",
      image: null,
      hasImage: false,
    },
  ];

  const timelineSteps = [
    {
      title: "Reported",
      description: "Complaint received and assigned ID #123456.",
      time: "2 hours ago",
      icon: "/span-2.svg",
    },
    {
      title: "Under Review",
      description: "Department is reviewing your complaint.",
      time: "1 hour ago",
      icon: "/span-1.svg",
    },
    {
      title: "Resolved",
      description: "Issue fixed. Thank you for your feedback!",
      time: "Just now",
      icon: "/span.svg",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white via-white to-blue-200 rounded-t-[20px] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="[font-family:'Poppins',Helvetica] font-bold text-blue-900 text-2xl">
          Track Your Complaints
        </h1>

        <div className="flex gap-4 items-center">
          <Input
            placeholder="Enter Complaint ID..."
            className="w-96 h-[42px] bg-white border-blue-200 [font-family:'Poppins',Helvetica] text-base"
          />

          <Select>
            <SelectTrigger className="w-[167px] h-[43px] bg-white border-blue-200">
              <SelectValue>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-base">
                  All Categories
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[143px] h-[43px] bg-white border-blue-200">
              <SelectValue>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-base">
                  All Status
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {complaintCards.map((complaint, index) => (
            <Card
              key={index}
              className="h-72 shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]"
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="[font-family:'Poppins',Helvetica] font-bold text-blue-800 text-base leading-4 flex-1 pr-2">
                    {complaint.title}
                  </h3>
                  <Badge
                    className={`${complaint.statusColor} rounded-full px-3 py-1 text-xs font-normal`}
                  >
                    {complaint.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/frame-4.svg"
                    alt="Location"
                    className="w-2.5 h-3.5"
                  />
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-blue-500 text-sm">
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
                      <div className="text-center [font-family:'Inter',Helvetica] font-normal text-[#999999] text-xs">
                        IMG
                        <br />
                        320×128
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={
                      index === 0
                        ? "/frame-6.svg"
                        : index === 1
                          ? "/frame-10.svg"
                          : "/frame-3.svg"
                    }
                    alt="Time"
                    className="w-3 h-3"
                  />
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-blue-700 text-xs">
                    {complaint.timeText}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
          <CardContent className="p-8">
            <h2 className="[font-family:'Poppins',Helvetica] font-bold text-blue-900 text-xl mb-6">
              Complaint Progress Timeline
            </h2>

            <div className="relative border-l-4 border-blue-200 pl-8 ml-6">
              {timelineSteps.map((step, index) => (
                <div
                  key={index}
                  className={`relative pb-8 ${index === timelineSteps.length - 1 ? "pb-0" : ""}`}
                >
                  <img
                    src={step.icon}
                    alt="Timeline icon"
                    className="absolute w-6 h-6 -left-[38px] top-0"
                  />

                  <div className="space-y-2">
                    <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-blue-800 text-base">
                      {step.title}
                    </h3>
                    <p className="[font-family:'Poppins',Helvetica] font-normal text-blue-700 text-sm leading-[14px]">
                      {step.description}
                    </p>
                    <p className="[font-family:'Poppins',Helvetica] font-normal text-blue-400 text-xs">
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-blue-900 text-lg leading-[18px] mb-4">
                  How satisfied are you with the resolution?
                </h3>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Any comments or suggestions?"
                  className="min-h-[66px] bg-white border-blue-200 [font-family:'Poppins',Helvetica] text-base resize-none"
                />

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-auto [font-family:'Poppins',Helvetica] font-semibold text-[15px]">
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
