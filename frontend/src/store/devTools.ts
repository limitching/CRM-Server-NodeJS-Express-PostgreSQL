// Redux DevTools configuration
export const devToolsConfig = {
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  
  // Custom DevTools configuration
  devToolsOptions: {
    // Customize DevTools appearance
    name: 'CRM Frontend Store',
    
    // Enable/disable specific features
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true,
    },
    
    // Custom actions
    actionsBlacklist: ['persist/PERSIST', 'persist/REHYDRATE'],
    
    // Custom state
    stateSanitizer: (state: unknown) => {
      // Sanitize sensitive data before showing in DevTools
      if (state && typeof state === 'object' && state !== null && 'auth' in state) {
        const authState = (state as { auth?: { token?: string } }).auth;
        if (authState?.token) {
          return {
            ...state,
            auth: {
              ...authState,
              token: '[HIDDEN]',
            },
          };
        }
      }
      return state;
    },
    
    // Custom actions
    actionSanitizer: (action: unknown) => {
      // Sanitize sensitive actions
      if (action && typeof action === 'object' && action !== null && 'type' in action && 'payload' in action) {
        const actionObj = action as { type: string; payload?: unknown };
        if (actionObj.type === 'auth/loginUser' && actionObj.payload) {
          return {
            ...action,
            payload: {
              ...actionObj.payload,
              credentials: '[HIDDEN]',
            },
          };
        }
      }
      return action;
    },
  },
};
