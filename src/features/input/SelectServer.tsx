import { useCallback, useMemo, useState } from "react";
// import { getArtists } from '@/app/actions/artists.action';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

interface Props {
  value: string | null;
  setValue: (value: string | null) => void;
}

const SelectServer = ({}: Props) => {
  const [value, setValue] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['artists'],
  //   queryFn: async () => await getArtists(),
  // });

  const data = ["http://localhost:8080"];

  const setSelectedArtist = useCallback(
    (artist: string) => {
      setValue(artist);
    },
    [setValue],
  );

  const selectedArtist = value;

  const filtered: string[] = useMemo(
    () =>
      query === ""
        ? (data ?? [])
        : (data ?? []).filter(person => {
            return person.toLowerCase().includes(query.toLowerCase());
          }),
    [data, query],
  );

  // if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox
      immediate
      value={selectedArtist}
      onChange={setSelectedArtist}
      onClose={() => setQuery("")}
    >
      <ComboboxInput
        className="p-2 border border-grey-200 rounded-lg focus:outline-blue-400"
        aria-label="Assignee"
        placeholder={false ? "Loading…" : "Choose an ESMeta server"}
        defaultValue={null}
        displayValue={(person: string | null) => {
          if (person === null) return "";

          if (person.startsWith("http://")) {
            return person.split("http://").at(1) || person;
          }

          if (person.startsWith("https://")) {
            return person.split("https://").at(1) || person;
          }

          return person;
        }}
        onChange={event => setQuery(event.target.value)}
      />

      <ComboboxOptions
        anchor="bottom"
        className="w-[var(--input-width)] z-[3] shadow-md bg-white rounded-lg empty:invisible mt-1 text-sm"
      >
        {filtered.map(artist => (
          <ComboboxOption
            key={artist}
            value={artist}
            className="data-[focus]:bg-blue-100 p-2"
          >
            {artist}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

export default SelectServer;
