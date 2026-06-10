"use client";

import { useEffect, useState } from "react";

export type WorldometersLiveCountry = {
  gdp?: number;
  gdpPerCapita?: number;
  gdpGrowthRate?: number;
  population?: number;
  populationGrowthRate?: number;
};

type LiveSnapshot = {
  generatedAt: string;
  countries: Record<string, WorldometersLiveCountry>;
};

// One in-flight request shared by every live counter on the page.
let snapshotPromise: Promise<LiveSnapshot | null> | null = null;

function loadSnapshot(): Promise<LiveSnapshot | null> {
  if (!snapshotPromise) {
    snapshotPromise = fetch("/api/economy/worldometers", { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<LiveSnapshot>) : null))
      .catch(() => null);
  }
  return snapshotPromise;
}

/** Returns the freshest Worldometers figures for one country, or null until loaded. */
export function useWorldometersLive(iso3: string) {
  const [live, setLive] = useState<{ data: WorldometersLiveCountry; generatedAt: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSnapshot().then((snapshot) => {
      if (cancelled || !snapshot?.countries) {
        return;
      }
      const data = snapshot.countries[iso3];
      if (data) {
        setLive({ data, generatedAt: snapshot.generatedAt });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [iso3]);

  return live;
}

/** Ticks `now` (epoch ms) every `intervalMs` while `active`, for live counters. */
export function useTick(active: boolean, intervalMs = 80) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) {
      return;
    }
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);
  return now;
}
