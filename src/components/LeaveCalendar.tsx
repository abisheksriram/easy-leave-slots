
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LeaveRequest } from "@/types/leave";
import { format } from "date-fns";

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
  onDateSelect?: (date: Date | undefined) => void;
}

export function LeaveCalendar({ leaveRequests, onDateSelect }: LeaveCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Helper function to check if a date is a leave day
  const isLeaveDay = (date: Date) => {
    return leaveRequests.find(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Leave Calendar</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        className="rounded-md"
        modifiers={{
          pending: (date) => {
            const leave = isLeaveDay(date);
            return leave ? leave.status === 'pending' : false;
          },
          approved: (date) => {
            const leave = isLeaveDay(date);
            return leave ? leave.status === 'approved' : false;
          },
          rejected: (date) => {
            const leave = isLeaveDay(date);
            return leave ? leave.status === 'rejected' : false;
          },
        }}
        modifiersClassNames={{
          pending: "leave-calendar-day pending",
          approved: "leave-calendar-day approved",
          rejected: "leave-calendar-day rejected",
        }}
      />
      <div className="mt-4 flex gap-3 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-200 mr-1"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-1"></div>
          <span>Approved</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-200 mr-1"></div>
          <span>Rejected</span>
        </div>
      </div>
    </div>
  );
}
