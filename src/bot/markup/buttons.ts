import {
  Actions,
  QuestAnswers,
  Wholesale_Cooperation,
} from 'src/bot/constant/action';
import { Markup } from 'telegraf';

const products = [
  'Линейка Х 1500 тяг',
  'Линейка Х zero 1500 тяг',
  'Линейка S 2500 тяг',
  'Линейка M 4000 тяг',
  'Линейка Q 1500 тяг',
  'Линейка L жидкость',
];

export function MAIN_MENU() {
  return Markup.inlineKeyboard([
    [
      { text: Actions.QA, callback_data: Actions.QA },
      {
        text: Actions.WHOLESALE_AND_COOPERATION,
        callback_data: Actions.WHOLESALE_AND_COOPERATION,
      },
    ],
    [{ text: Actions.BREAKDOWN, callback_data: Actions.BREAKDOWN }],
    [
      { text: Actions.CONNECT_TO_HR, callback_data: Actions.CONNECT_TO_HR },
      {
        text: Actions.CONNECT_TO_MARKETING,
        callback_data: Actions.CONNECT_TO_MARKETING,
      },
    ],
  ]);
}

export function QA() {
  return Markup.inlineKeyboard([
    [{ text: QuestAnswers.SHOP_PRICE, callback_data: QuestAnswers.SHOP_PRICE }],
    [
      {
        text: QuestAnswers.SHOP_LOCATION,
        callback_data: QuestAnswers.SHOP_LOCATION,
      },
    ],
    [
      {
        text: QuestAnswers.SHOP_LOCATION_NONE,
        callback_data: QuestAnswers.SHOP_LOCATION_NONE,
      },
    ],
    [
      {
        text: QuestAnswers.SHOP_ORIGINAL,
        callback_data: QuestAnswers.SHOP_ORIGINAL,
      },
    ],
    [
      {
        text: QuestAnswers.SHOP_NAMING,
        callback_data: QuestAnswers.SHOP_NAMING,
      },
    ],
    [
      {
        text: Actions.BACK,
        callback_data: Actions.BACK + '_lvl_1',
      },
    ],
  ]);
}

export function BREAKDOWN() {
  const chunks = products.map((product) => {
    return [
      {
        text: product,
        callback_data: 'product',
      },
    ];
  });

  //   add back button
  chunks.push([
    {
      text: Actions.BACK,
      callback_data: Actions.BACK + '_lvl_1',
    },
  ]);

  return Markup.inlineKeyboard(chunks);
}

export function REQUEST_POLICY() {
  return Markup.inlineKeyboard([
    [
      {
        text: Actions.AGGRE_WITH_POLICY,
        callback_data: Actions.AGGRE_WITH_POLICY,
      },
    ],
  ]);
}

export function BACK() {
  return Markup.inlineKeyboard([
    [
      {
        text: Actions.BACK,
        callback_data: Actions.BACK + '_lvl_1',
      },
    ],
  ]);
}

export function WHOLESALE_AND_COOPERATION() {
  return Markup.inlineKeyboard([
    [
      {
        text: Wholesale_Cooperation.VOLUME_WHOLESALE,
        callback_data: Wholesale_Cooperation.VOLUME_WHOLESALE,
      },
    ],
    [
      {
        text: Wholesale_Cooperation.VIEW_PRICE,
        callback_data: Wholesale_Cooperation.VIEW_PRICE,
      },
    ],
    [
      {
        text: Wholesale_Cooperation.VIEW_CONTACT,
        callback_data: Wholesale_Cooperation.VIEW_CONTACT,
      },
    ],
    [
      {
        text: Actions.BACK,
        callback_data: Actions.BACK + '_lvl_1',
      },
    ],
  ]);
}
