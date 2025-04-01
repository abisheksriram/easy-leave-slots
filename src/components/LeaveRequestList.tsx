
import React from "react";
import { format } from "date-fns";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { leaveService } from "@/services/leaveService";

interface LeaveRequestListProps {
  leaveRequests: LeaveRequest[];
  onLeaveUpdated: () => void;
  isAdmin?: boolean;
}

export function LeaveRequestList({ leaveRequests, onLeaveUpdated, isAdmin = false }: LeaveRequestListProps) {
  // Format date range to display
  const formatDateRange = (startDate: Date, endDate: Date) => {
    return `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`;
  };

  // Calculate duration in days
  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Handle leave cancellation
  const handleCancel = async (leaveId: string) => {
    try {
      await leaveService.deleteLeaveRequest(leaveId);
      onLeaveUpdated();
    } catch (error) {
      console.error("Failed to cancel leave request:", error);
    }
  };

  // Handle leave status update (admin only)
  const handleStatusUpdate = async (leaveId: string, status: LeaveStatus) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, status);
      onLeaveUpdated();
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Leave Requests</h2>
      
      {leaveRequests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No leave requests found
        </div>
      ) : (
        <Table>
          <TableCaption>List of leave requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium capitalize">{leave.type}</TableCell>
                <TableCell>{formatDateRange(leave.startDate, leave.endDate)}</TableCell>
                <TableCell>{calculateDuration(leave.startDate, leave.endDate)} days</TableCell>
                <TableCell>{getStatusBadge(leave.status)}</TableCell>
                <TableCell className="text-right">
                  {leave.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">Cancel</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Leave Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this leave request? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, keep it</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancel(leave.id)}>
                              Yes, cancel it
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      {isAdmin && (
                        <>
                          <Button 
                            size="sm" 
                            className="h-8 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(leave.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8"
                            onClick={() => handleStatusUpdate(leave.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
