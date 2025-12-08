// app/types/icon.ts
import { IconBaseProps } from "react-icons";

// Тип IconType - это функциональный компонент, который принимает пропсы IconBaseProps,
// необходимые для рендеринга иконки.
export type IconType = React.FC<IconBaseProps>;
