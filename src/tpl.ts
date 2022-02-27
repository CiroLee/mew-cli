export const vuePageTpl = (name: string) => {
  return `<template>
  <div>
    <h2>{{ name }}</h2>
  </div>
</template>
<script lang="ts" setup>
const name = '${name}';
</script>
`;
};

export const reactPageTpl = (name: string) => {
  const upperCaseName = name.replace(/^\S/, s => s.toUpperCase());
  return `
  import { FC } from 'react';
  import style from './index.module.scss';
  const ${upperCaseName}: FC = () => {
    return <div className={style.bold}>${name}</div>;
  };

  export default ${upperCaseName};
  `;
};

export const moduleScss = `.bold {
  font-weight: bold;
}
`;
