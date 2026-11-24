// Applique le thème avant le premier affichage (évite un flash). Fichier externe : la politique de sécurité interdit les scripts inline.
;(() => {
  let preference = 'dark'
  try { preference = localStorage.getItem('vybe-theme') || 'dark' } catch {}
  const theme = preference === 'system'
    ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : preference
  document.documentElement.dataset.theme = theme
})()
