import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

export const HomepageField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Homepage"
      type="url"
      rules={{
        validate: (value) =>
          !value || /^https?:\/\/.+/i.test(String(value)) || 'Ungültige URL',
      }}
    />
  );
};
