// ESLint flat config格式 (ESLint v9+使用的新配置格式)
export default [
  {
    // 基础配置
    files: ["**/*.ts", "**/*.tsx"], // 匹配所有TypeScript文件
    ignores: ["**/dist/**", "**/node_modules/**"], // 忽略目录
    languageOptions: {
      ecmaVersion: "latest", // 使用最新的ECMAScript特性
      sourceType: "module", // 使用ES模块
      parser: "@typescript-eslint/parser", // TypeScript解析器
      parserOptions: {
        project: true, // 自动检测tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"), // TypeScript插件
    },
    rules: {
      // TypeScript核心规则
      "@typescript-eslint/no-explicit-any": "warn", // 避免使用any类型
      "@typescript-eslint/no-unused-vars": "error", // 未使用的变量报错
      "@typescript-eslint/explicit-function-return-type": "off", // 不强制显式返回类型

      // 基础代码质量规则
      "no-console": "warn", // 避免使用console
      eqeqeq: ["error", "always"], // 必须使用===和!==
      curly: "error", // 必须使用大括号
      semi: ["error", "always"], // 必须使用分号

      // 代码风格规则
      indent: ["error", 2], // 2空格缩进
      quotes: ["error", "single"], // 使用单引号
      "comma-dangle": ["error", "never"], // 禁止尾随逗号
    },
  },

  // 可选的测试文件配置 (如果项目有测试文件)
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // 测试文件中允许any
      "no-console": "off", // 测试文件中允许console
    },
  },
];
