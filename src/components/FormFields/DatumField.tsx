import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

export const DatumField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Erscheinungsdatum"
      type="date"
      rules={{
        validate: (value) =>
          !value ||
          /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ||
          'Format: YYYY-MM-DD',
      }}
    />
  );
};
