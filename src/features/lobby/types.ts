export type AvatarOption = {
  id: string;
  label: string;
  gradient: string;
  imagePath: string;
};

export const AVATARS: AvatarOption[] = [
  {
    id: "emanuel",
    label: "emanuel",
    gradient: "from-red-500 to-rose-900",
    imagePath: "/avatars/mamel.png",
  },
  {
    id: "judas",
    label: "judas",
    gradient: "from-sky-400 to-indigo-900",
    imagePath: "/avatars/judas.png",
  },
  {
    id: "predo",
    label: "predo",
    gradient: "from-amber-300 to-stone-900",
    imagePath: "/avatars/predo.png",
  },
  {
    id: "pedro gay",
    label: "pedro gay",
    gradient: "from-violet-300 to-purple-950",
    imagePath: "/avatars/predogay.png",
  },
  {
    id: "paulete",
    label: "paulete",
    gradient: "from-emerald-300 to-slate-950",
    imagePath: "/avatars/paulete.png",
  },
];
