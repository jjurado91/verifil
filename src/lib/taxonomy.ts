// Shared category/country taxonomy. Kept in one place so a candidate's
// "trade" and a job's "category" use the exact same vocabulary — matching
// depends on this staying consistent.
//
// Categories are now admin-managed (see the job_categories table and
// /admin/categories) — this static list is only a seed/fallback.
export const CATEGORIES = [
  "Construction",
  "Logistics / Warehouse",
  "Welding / Fabrication",
  "Electrical",
  "Healthcare & Caregiving",
  "Hospitality / Food Service",
  "Manufacturing",
  "Driving / Heavy Equipment",
  "Other",
];

// Countries surfaced first in every dropdown — the most common OFW
// destinations plus home/reference countries. Alphabetical within the
// group, per how it should render.
export const TOP_COUNTRIES = [
  "Canada",
  "Germany",
  "Hong Kong",
  "Japan",
  "Kuwait",
  "Philippines",
  "Qatar",
  "Saudi Arabia",
  "UAE",
  "USA",
];

// Marker rendered as a disabled <option> to visually separate the top
// group from the rest — not a selectable value.
export const COUNTRY_DIVIDER = "──────────";

const ALL_WORLD_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo (DRC)", "Congo (Republic)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Macau", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "UAE", "Uganda", "Ukraine",
  "United Kingdom", "USA", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const topSet = new Set(TOP_COUNTRIES);

// Full world list minus whatever's already in the top group, A-Z.
export const OTHER_COUNTRIES = ALL_WORLD_COUNTRIES.filter(
  (c) => !topSet.has(c),
).sort((a, b) => a.localeCompare(b));

// Renders as: [top countries A-Z] [divider] [everyone else A-Z]
export const COUNTRIES = [...TOP_COUNTRIES, COUNTRY_DIVIDER, ...OTHER_COUNTRIES];
