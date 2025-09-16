import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

const ticketData = [
  {
    icon: "/i-1.svg",
    title: "Pothole - Main Street",
    urgency: "High",
    urgencyColor: "text-red-500",
    location: "| MG Road",
    status: "Pending",
    statusBg: "bg-yellow-100",
    statusText: "text-yellow-800",
  },
  {
    icon: "/i-4.svg",
    title: "Water Leak - Block B",
    urgency: "Medium",
    urgencyColor: "text-yellow-500",
    location: "| Anna Nagar",
    status: "",
    statusBg: "",
    statusText: "",
  },
];

export const HowItWorksSection = (): JSX.Element => {
  return (
    <section className="w-full bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 items-start">
          <Card className="w-[431px] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]">
            <CardContent className="p-8">
              <div className="flex justify-center mb-8">
                <img
                  className="w-[45px] h-9"
                  alt="Authority icon"
                  src="/i-10.svg"
                />
              </div>

              <div className="text-center mb-8">
                <h3 className="[font-family:'Poppins',Helvetica] font-bold text-blue-800 text-xl">
                  Authority Login
                </h3>
              </div>

              <div className="space-y-6">
                <Input
                  className="h-[42px] border-blue-200 [font-family:'Poppins',Helvetica]"
                  placeholder="Username"
                />

                <Input
                  type="password"
                  className="h-[42px] border-blue-200 [font-family:'Poppins',Helvetica]"
                  placeholder="Password"
                />

                <Button className="w-full h-[49px] bg-green-600 hover:bg-green-700 [font-family:'Poppins',Helvetica] font-bold">
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <img className="w-6 h-6" alt="Inbox icon" src="/frame-2.svg" />
                <h3 className="[font-family:'Poppins',Helvetica] font-bold text-blue-900 text-lg">
                  Ticket Inbox (AI Prioritized)
                </h3>
              </div>

              <div className="space-y-6">
                {ticketData.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 rounded-lg p-4 shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="w-[30px] h-6"
                        alt="Ticket icon"
                        src={ticket.icon}
                      />

                      <div>
                        <h4 className="[font-family:'Poppins',Helvetica] font-semibold text-blue-900 text-base mb-1">
                          {ticket.title}
                        </h4>
                        <div className="flex items-center text-sm">
                          <span className="[font-family:'Poppins',Helvetica] font-normal text-blue-600">
                            Urgency:
                          </span>
                          <span
                            className={`[font-family:'Poppins',Helvetica] font-bold ${ticket.urgencyColor} ml-1`}
                          >
                            {ticket.urgency}
                          </span>
                          <span className="[font-family:'Poppins',Helvetica] font-normal text-blue-600">
                            {ticket.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {ticket.status && (
                        <Badge
                          className={`${ticket.statusBg} ${ticket.statusText} hover:${ticket.statusBg}`}
                        >
                          {ticket.status}
                        </Badge>
                      )}

                      {index === 0 && (
                        <Button className="bg-green-600 hover:bg-green-700 h-8 px-4">
                          <img
                            className="w-3.5 h-4 mr-2"
                            alt="Resolve icon"
                            src="/i-6.svg"
                          />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
