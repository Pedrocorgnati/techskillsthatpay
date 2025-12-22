import type { TranslationKey, TranslationObject } from "@/libs/translation-models";
import { translations_en } from "@/libs/translations_en";
import { translations_es } from "@/libs/translations_es";
import { translations_it } from "@/libs/translations_it";
import { translations_pt } from "@/libs/translations_pt";

export enum ELanguageCode {
  EN = "en",
  PT = "pt",
  ES = "es",
  IT = "it"
}

export enum ECountryCode {
  AD = "AD",
  AE = "AE",
  AF = "AF",
  AG = "AG",
  AI = "AI",
  AL = "AL",
  AM = "AM",
  AO = "AO",
  AQ = "AQ",
  AR = "AR",
  AS = "AS",
  AT = "AT",
  AU = "AU",
  AW = "AW",
  AX = "AX",
  AZ = "AZ",
  BA = "BA",
  BB = "BB",
  BD = "BD",
  BE = "BE",
  BF = "BF",
  BG = "BG",
  BH = "BH",
  BI = "BI",
  BJ = "BJ",
  BL = "BL",
  BM = "BM",
  BN = "BN",
  BO = "BO",
  BQ = "BQ",
  BR = "BR",
  BS = "BS",
  BT = "BT",
  BV = "BV",
  BW = "BW",
  BY = "BY",
  BZ = "BZ",
  CA = "CA",
  CC = "CC",
  CD = "CD",
  CF = "CF",
  CG = "CG",
  CH = "CH",
  CI = "CI",
  CK = "CK",
  CL = "CL",
  CM = "CM",
  CN = "CN",
  CO = "CO",
  CR = "CR",
  CU = "CU",
  CV = "CV",
  CW = "CW",
  CX = "CX",
  CY = "CY",
  CZ = "CZ",
  DE = "DE",
  DJ = "DJ",
  DK = "DK",
  DM = "DM",
  DO = "DO",
  DZ = "DZ",
  EC = "EC",
  EE = "EE",
  EG = "EG",
  EH = "EH",
  ER = "ER",
  ES = "ES",
  ET = "ET",
  FI = "FI",
  FJ = "FJ",
  FK = "FK",
  FM = "FM",
  FO = "FO",
  FR = "FR",
  GA = "GA",
  GB = "GB",
  GD = "GD",
  GE = "GE",
  GF = "GF",
  GG = "GG",
  GH = "GH",
  GI = "GI",
  GL = "GL",
  GM = "GM",
  GN = "GN",
  GP = "GP",
  GQ = "GQ",
  GR = "GR",
  GS = "GS",
  GT = "GT",
  GU = "GU",
  GW = "GW",
  GY = "GY",
  HK = "HK",
  HM = "HM",
  HN = "HN",
  HR = "HR",
  HT = "HT",
  HU = "HU",
  ID = "ID",
  IE = "IE",
  IL = "IL",
  IM = "IM",
  IN = "IN",
  IO = "IO",
  IQ = "IQ",
  IR = "IR",
  IS = "IS",
  IT = "IT",
  JE = "JE",
  JM = "JM",
  JO = "JO",
  JP = "JP",
  KE = "KE",
  KG = "KG",
  KH = "KH",
  KI = "KI",
  KM = "KM",
  KN = "KN",
  KP = "KP",
  KR = "KR",
  KW = "KW",
  KY = "KY",
  KZ = "KZ",
  LA = "LA",
  LB = "LB",
  LC = "LC",
  LI = "LI",
  LK = "LK",
  LR = "LR",
  LS = "LS",
  LT = "LT",
  LU = "LU",
  LV = "LV",
  LY = "LY",
  MA = "MA",
  MC = "MC",
  MD = "MD",
  ME = "ME",
  MF = "MF",
  MG = "MG",
  MH = "MH",
  MK = "MK",
  ML = "ML",
  MM = "MM",
  MN = "MN",
  MO = "MO",
  MP = "MP",
  MQ = "MQ",
  MR = "MR",
  MS = "MS",
  MT = "MT",
  MU = "MU",
  MV = "MV",
  MW = "MW",
  MX = "MX",
  MY = "MY",
  MZ = "MZ",
  NA = "NA",
  NC = "NC",
  NE = "NE",
  NF = "NF",
  NG = "NG",
  NI = "NI",
  NL = "NL",
  NO = "NO",
  NP = "NP",
  NR = "NR",
  NU = "NU",
  NZ = "NZ",
  OM = "OM",
  PA = "PA",
  PE = "PE",
  PF = "PF",
  PG = "PG",
  PH = "PH",
  PK = "PK",
  PL = "PL",
  PM = "PM",
  PN = "PN",
  PR = "PR",
  PS = "PS",
  PT = "PT",
  PW = "PW",
  PY = "PY",
  QA = "QA",
  RE = "RE",
  RO = "RO",
  RS = "RS",
  RU = "RU",
  RW = "RW",
  SA = "SA",
  SB = "SB",
  SC = "SC",
  SD = "SD",
  SE = "SE",
  SG = "SG",
  SH = "SH",
  SI = "SI",
  SJ = "SJ",
  SK = "SK",
  SL = "SL",
  SM = "SM",
  SN = "SN",
  SO = "SO",
  SR = "SR",
  SS = "SS",
  ST = "ST",
  SV = "SV",
  SX = "SX",
  SY = "SY",
  SZ = "SZ",
  TC = "TC",
  TD = "TD",
  TF = "TF",
  TG = "TG",
  TH = "TH",
  TJ = "TJ",
  TK = "TK",
  TL = "TL",
  TM = "TM",
  TN = "TN",
  TO = "TO",
  TR = "TR",
  TT = "TT",
  TV = "TV",
  TW = "TW",
  TZ = "TZ",
  UA = "UA",
  UG = "UG",
  UM = "UM",
  US = "US",
  UY = "UY",
  UZ = "UZ",
  VA = "VA",
  VC = "VC",
  VE = "VE",
  VG = "VG",
  VI = "VI",
  VN = "VN",
  VU = "VU",
  WF = "WF",
  WS = "WS",
  YE = "YE",
  YT = "YT",
  ZA = "ZA",
  ZM = "ZM",
  ZW = "ZW"
}

const TRANSLATIONS: Record<ELanguageCode, TranslationObject> = {
  [ELanguageCode.EN]: translations_en,
  [ELanguageCode.PT]: translations_pt,
  [ELanguageCode.ES]: translations_es,
  [ELanguageCode.IT]: translations_it
};

const LANGUAGE_TAGS: Record<ELanguageCode, string> = {
  [ELanguageCode.EN]: "en",
  [ELanguageCode.PT]: "pt-BR",
  [ELanguageCode.ES]: "es-ES",
  [ELanguageCode.IT]: "it-IT"
};

const COUNTRY_LANGUAGE_MAP: Record<string, ELanguageCode> = {
  BR: ELanguageCode.PT,
  PT: ELanguageCode.PT,
  AO: ELanguageCode.PT,
  MZ: ELanguageCode.PT,
  CV: ELanguageCode.PT,
  GW: ELanguageCode.PT,
  ST: ELanguageCode.PT,
  TL: ELanguageCode.PT,
  ES: ELanguageCode.ES,
  MX: ELanguageCode.ES,
  AR: ELanguageCode.ES,
  CO: ELanguageCode.ES,
  CL: ELanguageCode.ES,
  PE: ELanguageCode.ES,
  VE: ELanguageCode.ES,
  EC: ELanguageCode.ES,
  GT: ELanguageCode.ES,
  CU: ELanguageCode.ES,
  BO: ELanguageCode.ES,
  DO: ELanguageCode.ES,
  HN: ELanguageCode.ES,
  PY: ELanguageCode.ES,
  SV: ELanguageCode.ES,
  NI: ELanguageCode.ES,
  CR: ELanguageCode.ES,
  PA: ELanguageCode.ES,
  UY: ELanguageCode.ES,
  PR: ELanguageCode.ES,
  IT: ELanguageCode.IT
};

type LanguageResolutionInput = {
  preferredLanguage?: ELanguageCode | null;
  acceptLanguage?: string | null;
  navigatorLanguage?: string | null;
};

export function getTranslationForLanguage(language: ELanguageCode, key: TranslationKey) {
  return TRANSLATIONS[language][key] || TRANSLATIONS[ELanguageCode.EN][key];
}

export function formatTranslation(
  value: string,
  replacements: Record<string, string | number> = {}
) {
  return Object.entries(replacements).reduce(
    (acc, [token, replacement]) => acc.replaceAll(`{${token}}`, String(replacement)),
    value
  );
}

export function getLanguageFromCountry(country?: string | null) {
  if (!country) return ELanguageCode.EN;
  const normalized = country.trim().toUpperCase();
  return COUNTRY_LANGUAGE_MAP[normalized] ?? ELanguageCode.EN;
}

export function getLanguageTag(language: ELanguageCode) {
  return LANGUAGE_TAGS[language] ?? LANGUAGE_TAGS[ELanguageCode.EN];
}

function parseLanguageTag(value?: string | null) {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("pt")) return ELanguageCode.PT;
  if (normalized.startsWith("es")) return ELanguageCode.ES;
  if (normalized.startsWith("it")) return ELanguageCode.IT;
  if (normalized.startsWith("en")) return ELanguageCode.EN;
  const parts = normalized.split("-");
  if (parts.length > 1) {
    return getLanguageFromCountry(parts[1]);
  }
  return null;
}

export function getPreferredLanguage(): ELanguageCode | null {
  return null;
}

export function resolveLanguage(input: LanguageResolutionInput = {}) {
  if (input.preferredLanguage) return input.preferredLanguage;

  const acceptLanguage = input.acceptLanguage?.split(",")[0] || null;
  const fromAccept = parseLanguageTag(acceptLanguage);
  if (fromAccept) return fromAccept;

  const fromNavigator = parseLanguageTag(input.navigatorLanguage);
  if (fromNavigator) return fromNavigator;

  return ELanguageCode.EN;
}
