export const colors = {
  // Brand
  primary: '#0F6B45',      // main green - buttons, headings, active states
  primaryLight: '#E6F2EC', // light green tint - icon backgrounds, tags
  danger: '#A6093D',       // expense red - Save Expense button, ₦ on expense screens

  // Backgrounds
  background: '#F4F6FA',   // screen background
  card: '#FFFFFF',         // card surfaces
  inputBackground: '#EEF1F6', // input fields, pills (unselected)

  // Text
  textPrimary: '#1A1A2E',  // headings, main text
  textSecondary: '#6B7280',// labels, muted text
  textInverse: '#FFFFFF',  // text on dark/colored buttons

  // Status
  success: '#0F6B45',      // sales / positive amounts
  error: '#A6093D',        // expenses / negative amounts

  // Utility
  border: '#E5E7EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999, // fully rounded - buttons, tags, payment method selectors
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyBold: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }, // "AMOUNT", "DESCRIPTION" labels
  small: { fontSize: 13, fontWeight: '400' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};