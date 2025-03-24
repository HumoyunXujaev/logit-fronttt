/**
 * Utility functions for the user switcher
 */

export const SELECTED_TEST_USER_KEY = 'selectedTestUser';

/**
 * Enable the user switcher in any environment
 */
export const enableUserSwitcher = () => {
  localStorage.setItem('enableUserSwitcher', 'true');
  window.location.reload();
};

/**
 * Disable the user switcher
 */
export const disableUserSwitcher = () => {
  localStorage.removeItem('enableUserSwitcher');
  localStorage.removeItem(SELECTED_TEST_USER_KEY);
  window.location.reload();
};

/**
 * Check if user switcher is enabled
 */
export const isUserSwitcherEnabled = () => {
  return localStorage.getItem('enableUserSwitcher') === 'true';
};

/**
 * Get the selected test user ID
 */
export const getSelectedTestUser = () => {
  return localStorage.getItem(SELECTED_TEST_USER_KEY);
};

/**
 * Set the selected test user ID
 */
export const setSelectedTestUser = (userId: string) => {
  localStorage.setItem(SELECTED_TEST_USER_KEY, userId);
};

/**
 * Clear the selected test user (but keep user switcher enabled)
 */
export const clearSelectedTestUser = () => {
  localStorage.removeItem(SELECTED_TEST_USER_KEY);
};

/**
 * Completely reset the user switcher and all related data
 */
export const resetUserSwitcher = () => {
  localStorage.removeItem('enableUserSwitcher');
  localStorage.removeItem(SELECTED_TEST_USER_KEY);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('telegram_id');
  localStorage.removeItem('logit_user_state');
};
