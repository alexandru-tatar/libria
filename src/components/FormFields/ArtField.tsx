import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

const ART_OPTIONS = [
  { value: '', label: 'Keine Auswahl' },
  { value: 'EPUB', label: 'EPUB' },
  { value: 'HARDCOVER', label: 'Hardcover' },
  { value: 'PAPERBACK', label: 'Paperback' },
];

export const ArtField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Art"
      select
      options={ART_OPTIONS}
      rules={{
        validate: (value?: string) =>
          !value ||
          ART_OPTIONS.some(({ value: v }) => v === value) ||
          'Ungültige Art',
      }}
    />
  );
};
