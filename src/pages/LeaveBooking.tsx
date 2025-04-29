
import React, { useEffect, useState } from "react";
import { LeaveCalendar } from "@/components/LeaveCalendar";
import { LeaveRequestForm } from "@/components/LeaveRequestForm";
import { LeaveRequestList } from "@/components/LeaveRequestList";
import { leaveService } from "@/services/leaveService";
import { LeaveRequest } from "@/types/leave";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

export default function LeaveBooking() {
  const { t } = useTranslation();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('leave.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('leave.description')}</p>
        </div>
        <LanguageSelector />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="request">{t('leave.request')}</TabsTrigger>
              <TabsTrigger value="history">{t('leave.history')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request">
              <LeaveRequestForm onSuccess={fetchLeaveRequests} />
            </TabsContent>
            
            <TabsContent value="history">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse">Loading leave requests...</div>
                </div>
              ) : (
                <LeaveRequestList 
                  leaveRequests={leaveRequests} 
                  onLeaveUpdated={fetchLeaveRequests} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <LeaveCalendar leaveRequests={leaveRequests} />
          
          <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-3">{t('leave.balance')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('leave.vacation')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">15</span>
                  <span className="text-sm text-muted-foreground">{t('leave.days')}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('leave.sickLeave')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">10</span>
                  <span className="text-sm text-muted-foreground">{t('leave.days')}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('leave.personalLeave')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">5</span>
                  <span className="text-sm text-muted-foreground">{t('leave.days')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
