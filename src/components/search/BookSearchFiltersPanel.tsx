import {
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { BookArt, Filters } from '../../domain/books/search';

type ViewMode = 'cards' | 'list';

type Props = {
  filters: Filters;
  quickTags: string[];
  viewMode: ViewMode;
  setFilterValue: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggleTag: (tag: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

export const BookSearchFiltersPanel = ({
  filters,
  quickTags,
  viewMode,
  setFilterValue,
  toggleTag,
  onViewModeChange,
}: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      mb: 2,
    }}
  >
    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="h6" fontWeight={900}>
          Filter
        </Typography>
        <Chip
          label={
            filters.schlagwoerter.length
              ? `${filters.schlagwoerter.length} Tags aktiv`
              : 'Keine Tags'
          }
          color={filters.schlagwoerter.length ? 'primary' : 'default'}
          variant={filters.schlagwoerter.length ? 'filled' : 'outlined'}
          sx={{ borderRadius: 999 }}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="ISBN"
            value={filters.isbn}
            onChange={(e) => setFilterValue('isbn', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="art-label">Buchart</InputLabel>
            <Select
              labelId="art-label"
              label="Buchart"
              value={filters.art}
              onChange={(e) => setFilterValue('art', e.target.value as BookArt)}
            >
              <MenuItem value="">Alle</MenuItem>
              <MenuItem value="EPUB">EPUB</MenuItem>
              <MenuItem value="HARDCOVER">HARDCOVER</MenuItem>
              <MenuItem value="PAPERBACK">PAPERBACK</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="sort-label">Sortierung</InputLabel>
            <Select
              labelId="sort-label"
              label="Sortierung"
              value={filters.sort}
              onChange={(e) => setFilterValue('sort', e.target.value)}
            >
              <MenuItem value="titel,asc">Titel A–Z</MenuItem>
              <MenuItem value="titel,desc">Titel Z–A</MenuItem>
              <MenuItem value="preis,asc">Preis aufsteigend</MenuItem>
              <MenuItem value="preis,desc">Preis absteigend</MenuItem>
              <MenuItem value="datum,desc">Neueste zuerst</MenuItem>
              <MenuItem value="datum,asc">Älteste zuerst</MenuItem>
              <MenuItem value="rating,desc">Beste Bewertung</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Preis von (€)"
            type="number"
            value={filters.preisVon}
            onChange={(e) => setFilterValue('preisVon', e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Preis bis (€)"
            type="number"
            value={filters.preisBis}
            onChange={(e) => setFilterValue('preisBis', e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Rabatt ab"
            type="number"
            value={filters.rabattAb}
            onChange={(e) => setFilterValue('rabattAb', e.target.value)}
            fullWidth
            helperText="0–1 (z.B. 0.2 = 20%)"
            slotProps={{ htmlInput: { step: 0.05, min: 0, max: 1 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Typography variant="body2" color="text.secondary">
                Mindestbewertung
              </Typography>
              <Typography variant="body2" fontWeight={800}>
                {filters.ratingMin} ★
              </Typography>
            </Stack>
            <Slider
              value={filters.ratingMin}
              min={0}
              max={5}
              step={1}
              valueLabelDisplay="auto"
              onChange={(_, v) => setFilterValue('ratingMin', v as number)}
            />
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={filters.lieferbar}
                onChange={(e) => setFilterValue('lieferbar', e.target.checked)}
              />
            }
            label="Nur lieferbar"
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Ansicht
            </Typography>
            <RadioGroup
              row
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            >
              <FormControlLabel
                value="cards"
                control={<Radio />}
                label="Karten"
              />
              <FormControlLabel
                value="list"
                control={<Radio />}
                label="Liste"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1 }}>
        Quick-Tags
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {quickTags.map((tag) => {
          const active = filters.schlagwoerter.includes(tag);
          return (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() => toggleTag(tag)}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              sx={{ mb: 1, borderRadius: 999 }}
            />
          );
        })}
      </Stack>
    </CardContent>
  </Card>
);
