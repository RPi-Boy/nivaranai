import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const processSteps = [
  {
    icon: "/div-5.svg",
    title: "Upload",
    description: "Submit an issue with a photo, video, description, or voice note.",
  },
  {
    icon: "/div-4.svg",
    title: "AI Sorts",
    description: "AI analyzes and forwards to the correct civic department automatically.",
  },
  {
    icon: "/div-2.svg",
    title: "Govt Responds",
    description: "Authorities update the status and resolve your complaint. Track every step!",
  },
];

const detailedSteps = [
  {
    icon: "/div-1.svg",
    title: "Upload",
    description: "Submit an issue with a photo, video, description, or voice note.",
    titleColor: "text-blue-900",
  },
  {
    icon: "/div-3.svg",
    title: "AI Sorts",
    description: "AI analyzes and forwards to the correct civic department automatically.",
    titleColor: "text-green-900",
  },
  {
    icon: "/div-6.svg",
    title: "Govt Responds",
    description: "Authorities update the status and resolve your complaint. Track every step!",
    titleColor: "text-blue-900",
  },
];

const statistics = [
  {
    icon: "/i.svg",
    value: "12,452",
    label: "Issues Resolved",
  },
  {
    icon: "/i-2.svg",
    value: "28h",
    label: "Avg. Resolution Time",
  },
  {
    icon: "/i-3.svg",
    value: "93%",
    label: "Citizen Satisfaction",
  },
  {
    icon: "/i-7.svg",
    value: "1,244",
    label: "Active Issues",
  },
];

export const HomePage = (): JSX.Element => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-300 via-white to-green-100 min-h-screen">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-blue-800 tracking-tight">Report. Resolve.</span>
                  <span className="text-green-600 tracking-tight"> Rebuild</span>
                  <span className="text-blue-800 tracking-tight"> Your City.</span>
                </h1>

                <p className="text-blue-800 text-lg lg:text-xl xl:text-2xl leading-relaxed [font-family:'Poppins',Helvetica] font-normal">
                  Empower your community to become cleaner, safer, and responsive.
                  Raise civic issues in seconds — NivaranAI sorts, routes, and
                  helps the right authorities resolve it, with real-time tracking
                  and feedback.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/report-issue">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg h-auto">
                      <img className="w-4 h-6 mr-3" alt="Report icon" src="/i-8.svg" />
                      <span className="[font-family:'Poppins',Helvetica] font-semibold text-lg">
                        Report an Issue
                      </span>
                    </Button>
                  </Link>
                  
                  <Link to="/track-complaint">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg h-auto">
                      <span className="[font-family:'Poppins',Helvetica] font-semibold text-lg">
                        Track Complaint
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-8">
                  {processSteps.map((step, index) => (
                    <React.Fragment key={step.title}>
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <img className="w-20 h-20" alt={step.title} src={step.icon} />
                        </div>
                        <span className="[font-family:'Poppins',Helvetica] font-medium text-blue-900 text-base">
                          {step.title}
                        </span>
                      </div>
                      {index < processSteps.length - 1 && (
                        <img className="w-5 h-6" alt="Arrow" src="/frame.svg" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <p className="text-center text-blue-600 text-sm [font-family:'Poppins',Helvetica] font-normal">
                  Simple 3-step process to make your city better!
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div
                className="w-80 h-80 rounded-2xl shadow-lg bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/img.png)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gradient-to-r from-blue-200 via-white to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            <div className="text-center space-y-12">
              <h2 className="text-3xl font-bold text-blue-900 [font-family:'Poppins',Helvetica]">
                How NivaranAI Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {detailedSteps.map((step, index) => (
                  <div key={step.title} className="text-center space-y-6">
                    <div className="flex justify-center">
                      <img className="w-24 h-24" alt={step.title} src={step.icon} />
                    </div>
                    <h3 className={`text-2xl font-semibold ${step.titleColor} [font-family:'Poppins',Helvetica]`}>
                      {step.title}
                    </h3>
                    <p className="text-blue-700 text-xl leading-relaxed [font-family:'Poppins',Helvetica] font-normal">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statistics.map((stat) => (
                <Card key={stat.label} className="bg-blue-50 border-0 shadow-sm">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <img className="w-8 h-11" alt={stat.label} src={stat.icon} />
                    </div>
                    <div className="text-3xl font-bold text-blue-900 [font-family:'Poppins',Helvetica]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-700 [font-family:'Poppins',Helvetica] font-normal">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="w-full bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 [font-family:'Poppins',Helvetica]">
            Are you a Government Authority?
          </h2>
          <p className="text-blue-700 text-lg mb-8 [font-family:'Poppins',Helvetica]">
            Access your dashboard to manage and resolve citizen complaints efficiently with AI-powered prioritization.
          </p>
          <Link to="/admin/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Authority Login
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};