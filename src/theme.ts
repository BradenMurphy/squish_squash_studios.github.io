import type { ThemeConfig } from 'antd'

/**
 * antd theme ported from the original style.css :root design tokens.
 * Brand palette is exposed as plain constants too, so custom (non-antd)
 * components can reference the exact same colours.
 */
export const brand = {
  pink: 'hsl(330, 85%, 60%)',
  pinkLight: 'hsl(330, 90%, 95%)',
  turquoise: 'hsl(174, 80%, 40%)',
  turquoiseLight: 'hsl(174, 80%, 94%)',
  orange: 'hsl(25, 95%, 55%)',
  orangeLight: 'hsl(25, 95%, 94%)',
  yellow: 'hsl(48, 100%, 55%)',
  yellowLight: 'hsl(48, 100%, 92%)',
  purple: 'hsl(265, 75%, 60%)',
  purpleLight: 'hsl(265, 75%, 94%)',
  green: 'hsl(145, 65%, 45%)',
  greenLight: 'hsl(145, 65%, 94%)',
  whatsapp: '#25D366',

  bgBase: 'hsl(40, 30%, 98%)',
  bgAlt: 'hsl(210, 20%, 97%)',
  bgCard: 'hsl(0, 0%, 100%)',
  textDark: 'hsl(210, 30%, 15%)',
  textMuted: 'hsl(210, 15%, 45%)',
} as const

export const theme: ThemeConfig = {
  token: {
    colorPrimary: brand.pink,
    colorInfo: brand.turquoise,
    colorSuccess: brand.green,
    colorWarning: brand.orange,
    colorText: brand.textDark,
    colorTextSecondary: brand.textMuted,
    colorBgBase: brand.bgBase,
    fontFamily: "'Outfit', system-ui, sans-serif",
    fontSize: 16,
    borderRadius: 16,
    borderRadiusLG: 24,
  },
  components: {
    Button: {
      controlHeightLG: 52,
      paddingInlineLG: 32,
      fontWeight: 600,
      primaryShadow: '0 10px 20px -5px hsla(330, 85%, 60%, 0.35)',
    },
    Collapse: {
      headerBg: brand.bgCard,
      contentBg: brand.bgCard,
    },
    Card: {
      borderRadiusLG: 24,
    },
  },
}
