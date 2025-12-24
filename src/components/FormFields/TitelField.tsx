import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface TitelFieldsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function TitelFields<T extends FieldValues>({
  control,
  errors,
}: TitelFieldsProps<T>) {
  return (
    <>
      <GenericField
        name={'titel.titel' as Path<T>}
        control={control}
        errors={errors}
        label="Titel"
        rules={{
          required: 'Titel ist erforderlich',
          pattern: {
            value: /^\w.*$/,
            message: 'Titel muss mit einem Buchstaben/Zahl beginnen',
          },
          maxLength: { value: 40, message: 'Maximal 40 Zeichen' },
        }}
        sx={{ mb: 2 }}
      />
      <GenericField
        name={'titel.untertitel' as Path<T>}
        control={control}
        errors={errors}
        label="Untertitel (optional)"
        rules={{
          maxLength: { value: 40, message: 'Maximal 40 Zeichen' },
        }}
        sx={{ mb: 2 }}
      />
    </>
  );
}
