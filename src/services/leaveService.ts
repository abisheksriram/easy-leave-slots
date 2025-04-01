
import { LeaveRequest, CreateLeaveRequest, LeaveStatus } from "@/types/leave";
import { toast } from "sonner";

// Mock data for demonstration purposes
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    userId: "user1",
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2024, 6, 19),
    type: "vacation",
    reason: "Summer vacation",
    status: "approved",
    createdAt: new Date(2024, 5, 20),
    updatedAt: new Date(2024, 5, 25),
  },
  {
    id: "2",
    userId: "user1",
    startDate: new Date(2024, 7, 5),
    endDate: new Date(2024, 7, 6),
    type: "personal",
    reason: "Family event",
    status: "pending",
    createdAt: new Date(2024, 6, 20),
    updatedAt: new Date(2024, 6, 20),
  },
];

// Helper to simulate async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveService = {
  // Get all leave requests for the current user
  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    await delay(500); // Simulate API call
    return [...mockLeaveRequests];
  },

  // Create a new leave request
  createLeaveRequest: async (request: CreateLeaveRequest): Promise<LeaveRequest> => {
    await delay(800); // Simulate API call
    
    // Validate dates
    if (request.startDate > request.endDate) {
      toast.error("Start date cannot be after end date");
      throw new Error("Invalid date range");
    }
    
    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      userId: "user1", // Hardcoded for demo
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...request
    };
    
    mockLeaveRequests.push(newRequest);
    toast.success("Leave request submitted successfully");
    return newRequest;
  },

  // Update a leave request status (for admin functionality)
  updateLeaveStatus: async (leaveId: string, status: LeaveStatus): Promise<LeaveRequest> => {
    await delay(500); // Simulate API call
    
    const leaveRequest = mockLeaveRequests.find(leave => leave.id === leaveId);
    
    if (!leaveRequest) {
      toast.error("Leave request not found");
      throw new Error("Leave request not found");
    }
    
    leaveRequest.status = status;
    leaveRequest.updatedAt = new Date();
    
    toast.success(`Leave request ${status}`);
    return leaveRequest;
  },

  // Delete a leave request
  deleteLeaveRequest: async (leaveId: string): Promise<void> => {
    await delay(500); // Simulate API call
    
    const index = mockLeaveRequests.findIndex(leave => leave.id === leaveId);
    
    if (index === -1) {
      toast.error("Leave request not found");
      throw new Error("Leave request not found");
    }
    
    mockLeaveRequests.splice(index, 1);
    toast.success("Leave request deleted");
  }
};
