import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

export const PreisField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Preis"
      required
      type="number"
      rules={{
        required: 'Preis ist erforderlich',
        min: { value: 0, message: 'Preis muss positiv sein' },
        validate: (value) =>
          /^\d{1,8}(\.\d{1,2})?$/.test(String(value)) ||
          'Maximal 8 Stellen, 2 Nachkommastellen',
      }}
    />
  );
};
