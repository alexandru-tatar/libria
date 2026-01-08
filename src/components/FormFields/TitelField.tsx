import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

type TitelFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
};

export const TitelFields = <T extends FieldValues>({
  control,
  errors,
}: TitelFieldsProps<T>) => {
  return (
    <>
      <GenericField
        name={'titel.titel' as Path<T>}
        control={control}
        errors={errors}
        label="Titel"
        required
        rules={{
          required: 'Titel ist erforderlich',
          maxLength: { value: 40, message: 'Maximal 40 Zeichen' },
        }}
        sx={{ mb: 2 }}
      />

      <GenericField
        name={'titel.untertitel' as Path<T>}
        control={control}
        errors={errors}
        label="Untertitel"
        rules={{
          maxLength: { value: 40, message: 'Maximal 40 Zeichen' },
        }}
        sx={{ mb: 2 }}
      />
    </>
  );
};
