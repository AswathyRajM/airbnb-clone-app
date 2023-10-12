'use client';
import React from 'react';
import Select from 'react-select';

import { CountrySelectValue } from '@/app/types';
import { useCountries } from '@/app/hooks/useCountries';

interface CountrySelectProps {
  value: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}
function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { getAll } = useCountries();
  return (
    <div>
      <Select
        placeholder='Anywhere'
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectValue)}
        formatOptionLabel={(option: any) => (
          <div className='flex items-center gap-3'>
            <div>{option.flag}</div>
            <div>
              {option.label},
              <span className='text-neutral-500 ml-1'>{option.region}</span>
            </div>
          </div>
        )}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            // primary: '#F43F5E',
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
        // styles={{
        //   control: (base, state) => {
        //     console.log({ state });

        //     return {
        //       ...base,
        //       borderColor:
        //         state.isFocused || state.menuIsOpen ? 'black' : 'unset',
        //       outlineColor:
        //         state.isFocused || state.menuIsOpen ? 'black' : 'unset',
        //     };
        //   },
        // }}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
      />
    </div>
  );
}

export default CountrySelect;
