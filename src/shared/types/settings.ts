export type SupportedLangs = 'en' | 'fr';
export type SupportedThemes = 'system' | 'light' | 'dark';
export type LinkTypes = 'default' | 'bold' | 'underline' | 'bold-underline';


export type Settings = {
  lang: SupportedLangs,
  theme: SupportedThemes,
  linkType: LinkTypes,
  dataGrid: {
    pagination: boolean
  }
};
