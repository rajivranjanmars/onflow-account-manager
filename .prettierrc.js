module.exports = {
  bracketSpacing: true,
  bracketSameLine: false,
  singleQuote: false,
  trailingComma: "all",
  semi: true,

  // @trivago/prettier-plugin-sort-imports
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "@/(.*)$",
    "^../(.*)$",
    "^./(.*)$",
    "(^../.*)types",
    "(^./.*)types",
  ],
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
