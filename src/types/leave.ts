
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'other';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaveRequest {
  startDate: Date;
  endDate: Date;
  type: LeaveType;
  reason: string;
}
