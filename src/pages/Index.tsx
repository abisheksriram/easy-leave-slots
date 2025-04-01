
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-8 max-w-3xl p-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-gray-900">
            Easy Leave Management
          </h1>
          <p className="text-xl text-gray-600">
            A simple and efficient way to request and manage your time off.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Calendar className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Request Leave</h3>
            <p className="text-gray-600 mb-4">
              Submit your time off requests with just a few clicks.
            </p>
            <Link to="/leave">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Calendar className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Time Off</h3>
            <p className="text-gray-600 mb-4">
              See your leave history and balance at a glance.
            </p>
            <Link to="/leave">
              <Button className="w-full">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
