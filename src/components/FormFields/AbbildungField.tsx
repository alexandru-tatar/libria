import type { FieldValues, Path } from 'react-hook-form';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import type { BaseArrayFieldProps } from './fieldProps';
import { getErrorByPath } from './formErrors';

type AbbildungItem = {
  beschriftung: string;
  contentType: string;
};

const CONTENT_TYPE_OPTIONS: string[] = ['image/png'];

export const AbbildungField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseArrayFieldProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    const item: AbbildungItem = { beschriftung: '', contentType: '' };
    append(item as unknown as T[typeof name][number]);
  };

  const hasItems = fields.length > 0;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Abbildungen
        </Typography>

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Abbildung hinzufügen
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Optional. Wenn du eine Abbildung hinzufügst, sind Beschriftung und
        Content-Type Pflicht.
      </Typography>

      {!hasItems ? null : (
        <Stack spacing={2}>
          {fields.map((field, index) => {
            const beschriftungPath = `${String(name)}.${index}.beschriftung`;
            const contentTypePath = `${String(name)}.${index}.contentType`;

            const beschriftungError = getErrorByPath<T>(
              errors,
              beschriftungPath,
            );
            const contentTypeError = getErrorByPath<T>(errors, contentTypePath);

            return (
              <Box
                key={field.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    Abbildung {index + 1}
                  </Typography>

                  <IconButton
                    aria-label="Abbildung entfernen"
                    onClick={() => remove(index)}
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  <Controller
                    name={`${String(name)}.${index}.beschriftung` as Path<T>}
                    control={control}
                    rules={{
                      required: 'Beschriftung ist erforderlich',
                      maxLength: { value: 32, message: 'Maximal 32 Zeichen' },
                    }}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        fullWidth
                        label="Beschriftung"
                        value={controllerField.value ?? ''}
                        onChange={(event) =>
                          controllerField.onChange(event.target.value)
                        }
                        error={Boolean(beschriftungError)}
                        helperText={beschriftungError?.message}
                        inputProps={{ maxLength: 32 }}
                      />
                    )}
                  />

                  <Controller
                    name={`${String(name)}.${index}.contentType` as Path<T>}
                    control={control}
                    rules={{
                      required: 'Content-Type ist erforderlich',
                      maxLength: { value: 16, message: 'Maximal 16 Zeichen' },
                      validate: (value) =>
                        CONTENT_TYPE_OPTIONS.includes(String(value)) ||
                        'Ungültiger Content-Type',
                    }}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        fullWidth
                        select
                        label="Content-Type"
                        value={controllerField.value ?? ''}
                        onChange={(event) =>
                          controllerField.onChange(event.target.value)
                        }
                        error={Boolean(contentTypeError)}
                        helperText={contentTypeError?.message}
                      >
                        <MenuItem value="">Bitte auswählen</MenuItem>
                        {CONTENT_TYPE_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
