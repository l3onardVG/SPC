// Función para obtener el color basado en la primera letra del título
export const getBookColor = (title: string): { bg: string; text: string } => {
  const firstLetter = title.charAt(0).toUpperCase();
  const colors = [
    { bg: 'bg-red-50', text: 'text-red-600' },
    { bg: 'bg-blue-50', text: 'text-blue-600' },
    { bg: 'bg-green-50', text: 'text-green-600' },
    { bg: 'bg-purple-50', text: 'text-purple-600' },
    { bg: 'bg-orange-50', text: 'text-orange-600' },
    { bg: 'bg-pink-50', text: 'text-pink-600' },
    { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { bg: 'bg-teal-50', text: 'text-teal-600' },
    { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { bg: 'bg-cyan-50', text: 'text-cyan-600' },
    { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { bg: 'bg-rose-50', text: 'text-rose-600' },
    { bg: 'bg-violet-50', text: 'text-violet-600' },
    { bg: 'bg-amber-50', text: 'text-amber-600' },
    { bg: 'bg-lime-50', text: 'text-lime-600' },
    { bg: 'bg-sky-50', text: 'text-sky-600' },
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
    { bg: 'bg-slate-50', text: 'text-slate-600' },
    { bg: 'bg-zinc-50', text: 'text-zinc-600' },
    { bg: 'bg-stone-50', text: 'text-stone-600' },
    { bg: 'bg-neutral-50', text: 'text-neutral-600' },
    { bg: 'bg-gray-50', text: 'text-gray-600' },
    { bg: 'bg-red-100', text: 'text-red-700' },
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-violet-100', text: 'text-violet-700' },
    { bg: 'bg-sky-100', text: 'text-sky-700' },
    { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
    { bg: 'bg-slate-100', text: 'text-slate-700' },
    { bg: 'bg-zinc-100', text: 'text-zinc-700' },
    { bg: 'bg-stone-100', text: 'text-stone-700' },
    { bg: 'bg-neutral-100', text: 'text-neutral-700' },
    { bg: 'bg-gray-100', text: 'text-gray-700' },
  ];
  
  // Usar el código ASCII de la primera letra para seleccionar el color
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  return colors[colorIndex];
}; 