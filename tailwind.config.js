module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand:       '#2563eb',
        'brand-dark':'#1d4ed8',
        'brand-light':'#eff6ff',
        surface:     '#ffffff',
        base:        '#f5f5f7',
        line:        '#e5e7eb',
        muted:       '#6b7280',
        subtle:      '#9ca3af',
        ink:         '#111827',
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs:    ['12px', '18px'],
        sm:    ['13px', '20px'],
        base:  ['14px', '22px'],
        md:    ['15px', '24px'],
        lg:    ['16px', '24px'],
        xl:    ['18px', '28px'],
        '2xl': ['20px', '30px'],
        '3xl': ['24px', '32px'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:      '6px',
        md:      '8px',
        lg:      '10px',
        xl:      '12px',
        '2xl':   '16px',
        full:    '9999px',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md:      '0 4px 12px rgba(0,0,0,0.08)',
        lg:      '0 8px 24px rgba(0,0,0,0.10)',
        input:   '0 0 0 3px rgba(37,99,235,0.12)',
      },
      spacing: {
        sidebar: '208px',
      },
    },
  },
  plugins: [],
};