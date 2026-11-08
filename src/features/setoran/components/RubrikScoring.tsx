import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, Sparkles } from "lucide-react";
import type { RubrikKriteria } from "@/features/rubrik/types";

export interface RubrikScoringProps {
  rubrikId?: number;
  rubrikNama?: string;
  kriteria: RubrikKriteria[];
  values: Record<number, number>;
  onChange: (values: Record<number, number>) => void;
}

export function RubrikScoring({
  rubrikNama,
  kriteria,
  values,
  onChange,
}: RubrikScoringProps) {
  const handleScoreChange = (id_kriteria: number, rawVal: number, min: number, max: number) => {
    const clamped = isNaN(rawVal) ? min : Math.min(Math.max(rawVal, min), max);
    onChange({
      ...values,
      [id_kriteria]: clamped,
    });
  };

  // Calculate weighted average
  const { totalScore, maxPossibleScore, percentageScore } = useMemo(() => {
    let weightedSum = 0;
    let maxWeightedSum = 0;
    let totalWeight = 0;

    for (const item of kriteria) {
      const val = values[item.id_kriteria] ?? item.skala_min;
      const weight = item.bobot || 1;
      weightedSum += val * weight;
      maxWeightedSum += item.skala_max * weight;
      totalWeight += weight;
    }

    const pct = maxWeightedSum > 0 ? (weightedSum / maxWeightedSum) * 100 : 0;
    const finalVal = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return {
      totalScore: Number(finalVal.toFixed(2)),
      maxPossibleScore: Number((maxWeightedSum / (totalWeight || 1)).toFixed(2)),
      percentageScore: Math.round(pct),
    };
  }, [kriteria, values]);

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-none overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/15 text-primary">
              <ClipboardCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight">
                  Penilaian Rubrik {rubrikNama ? `— ${rubrikNama}` : ""}
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-primary/10 text-primary">
                  Terbobot
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Nilai setiap kriteria sesuai standar skala yang ditentukan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">Nilai Akhir:</div>
              <div className="text-lg font-bold text-primary leading-tight">
                {totalScore} <span className="text-xs text-muted-foreground font-normal">/ {maxPossibleScore}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`h-7 px-2 font-bold ${
                percentageScore >= 80
                  ? "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-400"
                  : percentageScore >= 60
                  ? "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-400"
                  : "bg-rose-500/15 text-rose-700 border-rose-300 dark:text-rose-400"
              }`}
            >
              {percentageScore}%
            </Badge>
          </div>
        </div>

        {/* List Kriteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kriteria.map((item) => {
            const currentVal = values[item.id_kriteria] ?? item.skala_min;
            const min = item.skala_min;
            const max = item.skala_max;
            const step = max - min <= 5 ? 0.5 : 1;

            return (
              <div
                key={item.id_kriteria}
                className="p-3 rounded-lg bg-card border space-y-2 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`rubrik-input-${item.id_kriteria}`}
                      className="text-xs font-semibold cursor-pointer"
                    >
                      {item.nama}
                    </Label>
                    <div className="text-[10px] text-muted-foreground">
                      Bobot: {item.bobot}% | Skala: {min}–{max}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Input
                      id={`rubrik-input-${item.id_kriteria}`}
                      aria-label={`Nilai angka kriteria ${item.nama}`}
                      type="number"
                      min={min}
                      max={max}
                      step={step}
                      value={currentVal}
                      onChange={(e) =>
                        handleScoreChange(item.id_kriteria, parseFloat(e.target.value), min, max)
                      }
                      className="h-7 w-16 text-center font-bold text-xs"
                    />
                    <span className="text-xs text-muted-foreground font-medium">/{max}</span>
                  </div>
                </div>

                {/* Range Slider for fast input */}
                <div className="space-y-1">
                  <input
                    aria-label={`Slider kriteria ${item.nama}`}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentVal}
                    onChange={(e) =>
                      handleScoreChange(item.id_kriteria, parseFloat(e.target.value), min, max)
                    }
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                    <span>Min ({min})</span>
                    <span className="font-semibold text-primary">{currentVal}</span>
                    <span>Max ({max})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Summary */}
        <div className="p-2.5 rounded-lg bg-card/80 border text-xs flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-muted-foreground font-medium shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Rincian Bobot:</span>
          </div>
          {kriteria.map((item, idx) => {
            const val = values[item.id_kriteria] ?? item.skala_min;
            return (
              <span key={item.id_kriteria} className="inline-flex items-center gap-1 text-[11px]">
                <span className="text-muted-foreground">{item.nama}:</span>
                <span className="font-semibold">
                  {val}/{item.skala_max} ({item.bobot}%)
                </span>
                {idx < kriteria.length - 1 && <span className="text-muted-foreground">·</span>}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
