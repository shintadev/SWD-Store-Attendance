/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Employees: {
    Base: '/emp',
    Get: '/i/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    Face: '/scan',
  },
} as const;




