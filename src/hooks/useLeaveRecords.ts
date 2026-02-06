import { useEffect, useState } from "react";
import { LeaveRecord } from "@/types/hostel";
import { mockLeaveRecords } from "@/data/mockData";

const STORAGE_KEY = "hostel.leaveRecords";

const loadLeaveRecords = () => {
  if (typeof window === "undefined") return mockLeaveRecords;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockLeaveRecords;
    const parsed = JSON.parse(raw) as LeaveRecord[];
    return Array.isArray(parsed) ? parsed : mockLeaveRecords;
  } catch {
    return mockLeaveRecords;
  }
};

export const useLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() =>
    loadLeaveRecords(),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leaveRecords));
    } catch {
      // Ignore storage write errors.
    }
  }, [leaveRecords]);

  return { leaveRecords, setLeaveRecords };
};
