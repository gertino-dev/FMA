import { useEffect } from 'react';

const BASE = "Fédération Malagasy d'Athlétisme";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} · FMA Madagascar`;
  }, [title]);
}
