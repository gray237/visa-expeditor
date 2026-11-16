"use client";

import { useEffect, useState } from "react";
import type { VisaSummaryRecord } from "@/data/visa";

export function useVisaRecords(
  passport: string,
  initialPassport: string,
  initialRecords: VisaSummaryRecord[],
): VisaSummaryRecord[] {
  const [state, setState] = useState({
    passport: initialPassport,
    records: initialRecords,
  });

  useEffect(() => {
    if (passport === state.passport) return;
    const controller = new AbortController();
    fetch(`/api/visa/${passport}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad response"))))
      .then((data: { records?: VisaSummaryRecord[] }) => {
        setState({ passport, records: Array.isArray(data.records) ? data.records : [] });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ passport, records: [] });
      });
    return () => controller.abort();
  }, [passport, state.passport]);

  return state.records;
}
