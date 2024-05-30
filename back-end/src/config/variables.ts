export const role = {
  admin: 1,
  hod: 2,
  faculty: 3,
  student: 4,
};

export const roleByName = {
  1: "admin",
  2: "hod",
  3: "faculty",
  4: "student",
};

export const leaveDetails = {
  student: {
    totalLeave: 20,
    availableLeave: 20,
    usedLeave: 0,
    academicYear: new Date().getFullYear(),
    totalWorkingDays: 220,
    attendancePercentage: 100,
  },
  hod: {
    totalLeave: 12,
    availableLeave: 12,
    usedLeave: 0,
    academicYear: new Date().getFullYear(),
    totalWorkingDays: 228,
    attendancePercentage: 100,
  },
  faculty: {
    totalLeave: 15,
    availableLeave: 15,
    usedLeave: 0,
    academicYear: new Date().getFullYear(),
    totalWorkingDays: 225,
    attendancePercentage: 100.0,
  },
};

export const pagination = {
  limitDoc: 10,
  pageCount: 1,
};
