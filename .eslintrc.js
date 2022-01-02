module.exports = {
  // root:true, //配置文件是可以有继承关系
  extends: 'airbnb', // 是继承或者说扩展自airbnb的配置
  parser: 'babel-eslint', // 把源代码转成AST语法树的工具
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  // 指定脚本的运行环境
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'linebreak-style': 'off',
    indent: ['error', 2], // 缩进的风格
    'no-console': 'off', // 不能出现console
  },
};
