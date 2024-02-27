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
  User: {
    Base: 'users',
    CRUD: '/',
  },
  Auth: {
    Base: '/auth',
    Login: '/login',
    Logout: '/logout',
    RefreshToken: '/refresh-token',
  },
} as const;

