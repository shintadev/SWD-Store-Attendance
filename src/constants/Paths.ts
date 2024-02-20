/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Employees: {
    Base: '/employees',
    CRUD: '/',
    List: '/list',
  },
  Shift: {
    Base: '/schedule',
    CRUD: '/',
    Assign: '/assign',
  },
  Attendance: {
    Base: '/attendance',
    CRUD: '/',
  },
} as const;















