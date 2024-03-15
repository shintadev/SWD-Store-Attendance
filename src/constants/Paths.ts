/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Employee: {
    Base: '/employees',
    CRUD: '/',
    List: '/list',
    All: '/all',
  },
  Shift: {
    Base: '/shift',
    CRUD: '/',
    Schedule: '/schedule',
    Assign: '/assign',
  },
  Attendance: {
    Base: '/attendance',
    CRUD: '/',
  },
  User: {
    Base: '/users',
    CRUD: '/',
    List: '/list',
  },
  Auth: {
    Base: '/auth',
    Login: '/login',
    Logout: '/logout',
    RefreshToken: '/refresh-token',
  },
  Admin: {
    Base: '/admin',
  },
} as const;








