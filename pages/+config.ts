import vikeReact from "vike-react/config";
import vikeReactQuery from "vike-react-query/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "Small Turtle House - Riichi Mahjong",
  description: "Play riichi mahjong online at Small Turtle House",

  extends: [vikeReact, vikeReactQuery],
} satisfies Config;
