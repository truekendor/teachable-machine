import { type } from "os";
import { TrainingProps } from "../store/Store";

const epochs =
    "Эпоха означает, что модель изучила каждый пример из обучающего образца хотя бы раз. Например, если указано 50 эпох, то при обучении набор данных обработается 50 раз. В целом чем больше это значение, тем лучше модель научится прогнозировать данные.";
const learningRate =
    "Будьте осторожны с изменением этого числа. Даже небольшие различия могут существенно повлиять на то, насколько эффективно учится ваша модель.";
const batchSize =
    "Пакет – это набор образцов, использованных в одной итерации при обучении. Допустим, вы выбрали пакет размером 16, а у вас 80 изображений. Это значит, все данные будут поделены на пять пакетов: 80 / 16 = 5. Как только модель ознакомится с пятью пакетами, завершится одна эпоха.";
const optimizer =
    "Оптимизатор — это функция или алгоритм, который изменяет атрибуты нейронной сети, такие как веса и скорость обучения. Это помогает уменьшить общие потери(loss) и повысить точность. Оптимизатор по умолчанию - Adam.";
const validationSplit =
    "Откладывает процент данных в сет валидации и не использует его для обучения модели";

type TextType = Partial<Record<keyof TrainingProps, string>>;

export const infoText: TextType = {
    epochs,
    learningRate,
    batchSize,
    optimizer,
    validationSplit,
};
