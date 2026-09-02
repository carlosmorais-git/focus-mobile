/**
 * Declara os módulos de asset que o Metro resolve mas o TypeScript não conhece.
 *
 * `import Img from "./foto.png"` funciona em runtime porque o Metro transforma o
 * arquivo num `ImageSourcePropType`. Para o `tsc` isso é só um módulo inexistente.
 *
 * A RN 0.86 parou de declarar esses módulos (o antigo `@types/react-native` fazia
 * isso), e o `expo/types` cobre apenas CSS. Este arquivo é versionado de propósito:
 * `expo-env.d.ts` está no `.gitignore` e não serve para o que o projeto precisa fixar.
 */

declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}

declare module "*.jpg" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}

declare module "*.jpeg" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}

declare module "*.gif" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}

declare module "*.webp" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}

declare module "*.svg" {
  import type { ImageSourcePropType } from "react-native";
  const conteudo: ImageSourcePropType;
  export default conteudo;
}
