//app/components/ControlSliders.tsx
import { Slider } from './ui/slider';
import { Label } from './ui/label';

export interface SliderValues {
  education: number;
  viewpoint: number;
  sentiment: number;
  recency: number;
}

interface ControlSlidersProps {
  values: SliderValues;
  onChange: (values: SliderValues) => void;
}

export default function ControlSliders({ values, onChange }: ControlSlidersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-lg text-slate-900">Control Your Reality</h2>
        <p className="text-sm text-slate-500 mt-1">
          Adjust these sliders to customize what content you see
        </p>
        <button
          onClick={() => onChange({ education: 75, viewpoint: 100, sentiment: 100, recency: 50 })}
          className="mt-4 px-4 py-2 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
        >
          ⚡ Break My Bubble
        </button>
      </div>

      <div className="space-y-6">
        {/* Educational vs Entertainment */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-slate-700">Educational</Label>
            <Label className="text-sm font-medium text-slate-700">Entertainment</Label>
          </div>
          <Slider
            value={[values.education]}
            onValueChange={([value]) => onChange({ ...values, education: value })}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Learn</span>
            <span className="text-violet-600 font-medium">{values.education}%</span>
            <span>Entertain</span>
          </div>
        </div>

        {/* Agreeable vs Opposing */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-slate-700">Agreeable</Label>
            <Label className="text-sm font-medium text-slate-700">Opposing Views</Label>
          </div>
          <Slider
            value={[values.viewpoint]}
            onValueChange={([value]) => onChange({ ...values, viewpoint: value })}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Comfort</span>
            <span className="text-violet-600 font-medium">{values.viewpoint}%</span>
            <span>Challenge</span>
          </div>
        </div>

        {/* Positive vs Controversial */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-slate-700">Positive</Label>
            <Label className="text-sm font-medium text-slate-700">Controversial</Label>
          </div>
          <Slider
            value={[values.sentiment]}
            onValueChange={([value]) => onChange({ ...values, sentiment: value })}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Uplifting</span>
            <span className="text-violet-600 font-medium">{values.sentiment}%</span>
            <span>Provocative</span>
          </div>
        </div>

        {/* Recent vs Viral */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-slate-700">Recent</Label>
            <Label className="text-sm font-medium text-slate-700">Viral</Label>
          </div>
          <Slider
            value={[values.recency]}
            onValueChange={([value]) => onChange({ ...values, recency: value })}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Fresh</span>
            <span className="text-violet-600 font-medium">{values.recency}%</span>
            <span>Trending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
