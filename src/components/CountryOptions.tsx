import { COUNTRIES, COUNTRY_DIVIDER } from "@/lib/taxonomy";

/** <option> list for a country <select> — top countries, a disabled divider, then the rest. */
export function CountryOptions() {
  return (
    <>
      {COUNTRIES.map((country) =>
        country === COUNTRY_DIVIDER ? (
          <option key={country} disabled>
            {country}
          </option>
        ) : (
          <option key={country} value={country}>
            {country}
          </option>
        ),
      )}
    </>
  );
}
