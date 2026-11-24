// Representative colour for each stone (category slug). Used to draw the
// polished gem spheres on the home page and the dots in the shop filter.
export const STONE_COLORS: Record<string, string> = {
  amethyst: "#7b4fa3",
  "rose-quartz": "#e3a2b4",
  "clear-quartz": "#dfe7ee",
  citrine: "#e2ae3c",
  "black-tourmaline": "#2a2a30",
  "black-obsidian": "#24242c",
  "lapis-lazuli": "#2c4fa6",
  "tiger-eye": "#a66d24",
  moonstone: "#c9d3e3",
  "green-aventurine": "#3e9a68",
  pyrite: "#b49a4c",
  selenite: "#eeeae0",
  "red-jasper": "#a3412f",
  "green-jade": "#3c8a5c",
  "black-sulimani": "#33302e",
  "black-agate": "#1f1f24",
  turquoise: "#38b1ab",
  "persian-turquoise": "#2fa3b8",
  sunstone: "#d9793a",
  howlite: "#e6e6e2",
};

export function stoneColor(slug: string | null | undefined): string {
  return (slug && STONE_COLORS[slug]) || "#6a7f94";
}
