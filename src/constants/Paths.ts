/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Employees: {
    Base: '/employees',
    CRUD: '/',
  },
  Shift: {
    Base: '/schedule',
    CRUD: '/',
  },
  Attendance: {
    Base: '/attendance',
    CRUD: '/',
  },
} as const;













