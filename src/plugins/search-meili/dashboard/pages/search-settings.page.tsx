import {
  Page,
  PageLayout,
  PageBlock,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  Button,
  api,
} from '@vendure/dashboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, X, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GET_MEILI_SETTINGS, UPDATE_MEILI_SETTINGS } from '../queries/search-admin.queries';

const DEFAULT_SEARCHABLE = ['name', 'variantName', 'description', 'sku', 'collectionNames', 'facetValueNames'];
const DEFAULT_FILTERABLE = ['price', 'inStock', 'collectionIds', 'facetValueIds', 'enabled', 'labelIds', 'productId'];
const DEFAULT_SORTABLE = ['price', 'createdAt', 'name'];
const DEFAULT_RANKING = ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness'];

type SettingsState = {
  searchableAttributes: string[];
  filterableAttributes: string[];
  sortableAttributes: string[];
  stopWords: string[];
  rankingRules: string[];
  synonyms: Record<string, string[]>;
  typoToleranceEnabled: boolean;
  typoOneTypo: number;
  typoTwoTypos: number;
};

export function SearchSettingsPage({ route }: { route: any }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['meili-settings'],
    queryFn: () => api.query(GET_MEILI_SETTINGS),
  });

  const rawSettings = (data as any)?.meiliSettings;

  const [settings, setSettings] = useState<SettingsState>({
    searchableAttributes: DEFAULT_SEARCHABLE,
    filterableAttributes: DEFAULT_FILTERABLE,
    sortableAttributes: DEFAULT_SORTABLE,
    stopWords: [],
    rankingRules: DEFAULT_RANKING,
    synonyms: {},
    typoToleranceEnabled: true,
    typoOneTypo: 4,
    typoTwoTypos: 8,
  });

  const [newStopWord, setNewStopWord] = useState('');
  const [newSynonymWord, setNewSynonymWord] = useState('');
  const [newSynonymValues, setNewSynonymValues] = useState('');

  useEffect(() => {
    if (rawSettings) {
      setSettings({
        searchableAttributes: rawSettings.searchableAttributes || DEFAULT_SEARCHABLE,
        filterableAttributes: rawSettings.filterableAttributes || DEFAULT_FILTERABLE,
        sortableAttributes: rawSettings.sortableAttributes || DEFAULT_SORTABLE,
        stopWords: rawSettings.stopWords || [],
        rankingRules: rawSettings.rankingRules || DEFAULT_RANKING,
        synonyms: rawSettings.synonyms ? JSON.parse(rawSettings.synonyms) : {},
        typoToleranceEnabled: rawSettings.typoToleranceEnabled ?? true,
        typoOneTypo: rawSettings.typoOneTypo ?? 4,
        typoTwoTypos: rawSettings.typoTwoTypos ?? 8,
      });
    }
  }, [rawSettings]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.mutate(UPDATE_MEILI_SETTINGS, {
        input: {
          searchableAttributes: settings.searchableAttributes,
          filterableAttributes: settings.filterableAttributes,
          sortableAttributes: settings.sortableAttributes,
          stopWords: settings.stopWords,
          rankingRules: settings.rankingRules,
          synonyms: JSON.stringify(settings.synonyms),
          typoToleranceEnabled: settings.typoToleranceEnabled,
          typoOneTypo: settings.typoOneTypo,
          typoTwoTypos: settings.typoTwoTypos,
        },
      }),
    onSuccess: () => {
      toast.success('Settings saved successfully');
      queryClient.invalidateQueries({ queryKey: ['meili-settings'] });
    },
    onError: (e: any) => toast.error(`Save failed: ${e.message}`),
  });

  const toggleAttribute = (field: keyof SettingsState, attr: string) => {
    setSettings(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(attr) ? arr.filter(a => a !== attr) : [...arr, attr],
      };
    });
  };

  const addStopWord = () => {
    const word = newStopWord.trim().toLowerCase();
    if (word && !settings.stopWords.includes(word)) {
      setSettings(prev => ({ ...prev, stopWords: [...prev.stopWords, word] }));
    }
    setNewStopWord('');
  };

  const removeStopWord = (word: string) => {
    setSettings(prev => ({ ...prev, stopWords: prev.stopWords.filter(w => w !== word) }));
  };

  const addSynonym = () => {
    const word = newSynonymWord.trim().toLowerCase();
    const synonyms = newSynonymValues.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (word && synonyms.length > 0) {
      setSettings(prev => ({ ...prev, synonyms: { ...prev.synonyms, [word]: synonyms } }));
    }
    setNewSynonymWord('');
    setNewSynonymValues('');
  };

  const removeSynonym = (word: string) => {
    setSettings(prev => {
      const updated = { ...prev.synonyms };
      delete updated[word];
      return { ...prev, synonyms: updated };
    });
  };

  const moveRankingRule = (index: number, direction: 'up' | 'down') => {
    const rules = [...settings.rankingRules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rules.length) return;
    [rules[index], rules[newIndex]] = [rules[newIndex], rules[index]];
    setSettings(prev => ({ ...prev, rankingRules: rules }));
  };

  const allFields = [...new Set([...DEFAULT_SEARCHABLE, ...DEFAULT_FILTERABLE, ...DEFAULT_SORTABLE])];

  return (
    <Page pageId="search-settings">
      <PageTitle>Search Settings</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="h-8 gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-none"
          >
            <Save className="h-3.5 w-3.5" />
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </PageActionBarRight>
      </PageActionBar>

      <PageLayout>
        {/* Typo Tolerance */}
        <PageBlock column="main" blockId="meili-typo">
          <SectionHeader title="Typo Tolerance" />
          <div className="px-6 pb-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.typoToleranceEnabled}
                onChange={e => setSettings(prev => ({ ...prev, typoToleranceEnabled: e.target.checked }))}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-200">Enable Typo Tolerance</span>
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Min chars for 1 typo</label>
                <input
                  type="number"
                  value={settings.typoOneTypo}
                  onChange={e => setSettings(prev => ({ ...prev, typoOneTypo: parseInt(e.target.value) || 4 }))}
                  className="w-full border rounded px-2 py-1.5 text-sm bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
                  min={1}
                  max={20}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Min chars for 2 typos</label>
                <input
                  type="number"
                  value={settings.typoTwoTypos}
                  onChange={e => setSettings(prev => ({ ...prev, typoTwoTypos: parseInt(e.target.value) || 8 }))}
                  className="w-full border rounded px-2 py-1.5 text-sm bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
                  min={1}
                  max={30}
                />
              </div>
            </div>
          </div>
        </PageBlock>

        {/* Searchable Fields */}
        <PageBlock column="main" blockId="meili-searchable">
          <SectionHeader title="Searchable Attributes" />
          <div className="px-6 pb-6">
            <AttributeCheckboxes
              all={allFields}
              selected={settings.searchableAttributes}
              onToggle={attr => toggleAttribute('searchableAttributes', attr)}
            />
          </div>
        </PageBlock>

        {/* Filterable Fields */}
        <PageBlock column="main" blockId="meili-filterable">
          <SectionHeader title="Filterable Attributes" />
          <div className="px-6 pb-6">
            <AttributeCheckboxes
              all={allFields}
              selected={settings.filterableAttributes}
              onToggle={attr => toggleAttribute('filterableAttributes', attr)}
            />
          </div>
        </PageBlock>

        {/* Sortable Fields */}
        <PageBlock column="main" blockId="meili-sortable">
          <SectionHeader title="Sortable Attributes" />
          <div className="px-6 pb-6">
            <AttributeCheckboxes
              all={allFields}
              selected={settings.sortableAttributes}
              onToggle={attr => toggleAttribute('sortableAttributes', attr)}
            />
          </div>
        </PageBlock>

        {/* Ranking Rules */}
        <PageBlock column="main" blockId="meili-ranking">
          <SectionHeader title="Ranking Rules" />
          <div className="px-6 pb-6">
            <p className="text-xs text-slate-500 mb-3">Drag rules to reorder priority (top = highest priority).</p>
            <div className="space-y-1.5 max-w-sm">
              {settings.rankingRules.map((rule, i) => (
                <div key={rule} className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 w-4">{i + 1}.</span>
                  <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-200">{rule}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveRankingRule(i, 'up')} disabled={i === 0} className="text-slate-400 hover:text-cyan-500 disabled:opacity-20 text-xs px-1">↑</button>
                    <button onClick={() => moveRankingRule(i, 'down')} disabled={i === settings.rankingRules.length - 1} className="text-slate-400 hover:text-cyan-500 disabled:opacity-20 text-xs px-1">↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageBlock>

        {/* Stop Words */}
        <PageBlock column="main" blockId="meili-stopwords">
          <SectionHeader title="Stop Words" />
          <div className="px-6 pb-6 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newStopWord}
                onChange={e => setNewStopWord(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addStopWord()}
                placeholder="Add stop word..."
                className="flex-1 border rounded px-3 py-1.5 text-sm bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
              />
              <Button size="sm" onClick={addStopWord} className="h-8 gap-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-none">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.stopWords.map(word => (
                <span key={word} className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300">
                  {word}
                  <button onClick={() => removeStopWord(word)} className="text-slate-400 hover:text-rose-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {!settings.stopWords.length && (
                <span className="text-xs text-slate-400">No stop words configured</span>
              )}
            </div>
          </div>
        </PageBlock>

        {/* Synonyms */}
        <PageBlock column="main" blockId="meili-synonyms">
          <SectionHeader title="Synonyms Manager" />
          <div className="px-6 pb-6 space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Word</label>
                <input
                  type="text"
                  value={newSynonymWord}
                  onChange={e => setNewSynonymWord(e.target.value)}
                  placeholder="e.g. phone"
                  className="w-full border rounded px-3 py-1.5 text-sm bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div className="flex-[2]">
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Synonyms (comma-separated)</label>
                <input
                  type="text"
                  value={newSynonymValues}
                  onChange={e => setNewSynonymValues(e.target.value)}
                  placeholder="e.g. smartphone, mobile, cellphone"
                  className="w-full border rounded px-3 py-1.5 text-sm bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <Button size="sm" onClick={addSynonym} className="h-8 gap-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-none">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <div className="space-y-1.5">
              {Object.entries(settings.synonyms).map(([word, synonyms]) => (
                <div key={word} className="flex items-center gap-3 p-2.5 rounded border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200 min-w-[100px]">{word}</span>
                  <span className="text-slate-400 text-xs">→</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {synonyms.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 rounded text-xs font-medium border border-cyan-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => removeSynonym(word)} className="text-slate-400 hover:text-rose-500 ml-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {!Object.keys(settings.synonyms).length && (
                <p className="text-xs text-slate-400">No synonyms configured</p>
              )}
            </div>
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700/50">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">{title}</h3>
    </div>
  );
}

function AttributeCheckboxes({ all, selected, onToggle }: { all: string[]; selected: string[]; onToggle: (attr: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 pt-4">
      {all.map(attr => (
        <label key={attr} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border cursor-pointer text-xs font-medium transition-colors
          border-slate-200 dark:border-slate-700/50
          hover:border-cyan-400 dark:hover:border-cyan-500
          data-[checked]:border-cyan-500 data-[checked]:bg-cyan-500/10 data-[checked]:text-cyan-700 dark:data-[checked]:text-cyan-400"
          data-checked={selected.includes(attr) ? '' : undefined}
        >
          <input
            type="checkbox"
            checked={selected.includes(attr)}
            onChange={() => onToggle(attr)}
            className="accent-cyan-500"
          />
          <span className={selected.includes(attr) ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400'}>
            {attr}
          </span>
        </label>
      ))}
    </div>
  );
}
